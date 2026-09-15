import { NextRequest, NextResponse } from "next/server";
import { supabaseConfigured } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { requestUserId } from "@/lib/meetings";
import { GLOSSARY_COLS, buildContext, cleanTerm, glossaryPrompt, isMissingGlossary, rowToTerm } from "@/lib/glossary";

export const dynamic = "force-dynamic";

/**
 * The caller's personal dictionary.
 *
 * GET    /api/glossary                    → { terms, signedIn, tableMissing }
 * GET    /api/glossary?context=1&lang=vi  → { context, prompt } ready for the Soniox config / GPT prompts
 * POST   /api/glossary { terms: [...] }   → upsert by (user, client_id)
 * DELETE /api/glossary?ids=a,b            → remove entries
 *
 * The live engines call the GET on every page, signed in or not, so an
 * anonymous caller gets an empty dictionary instead of a 401.
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const wantContext = sp.get("context") === "1";
  const lang = sp.get("lang") || undefined;
  const empty = wantContext ? { context: null, prompt: "" } : { terms: [] };

  if (!supabaseConfigured()) return NextResponse.json({ ...empty, signedIn: false });
  const userId = await requestUserId(req);
  if (!userId) return NextResponse.json({ ...empty, signedIn: false });

  const { data, error } = await createAdminClient()
    .from("glossary_terms")
    .select(GLOSSARY_COLS)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1000);

  if (error) {
    if (isMissingGlossary(error)) return NextResponse.json({ ...empty, signedIn: true, tableMissing: true });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const terms = (data || []).map(rowToTerm);
  if (wantContext) return NextResponse.json({ context: buildContext(terms, lang), prompt: glossaryPrompt(terms, lang), signedIn: true });
  return NextResponse.json({ terms, signedIn: true });
}

export async function POST(req: NextRequest) {
  if (!supabaseConfigured()) return NextResponse.json({ error: "not configured" }, { status: 500 });
  const userId = await requestUserId(req);
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const raw: any[] = Array.isArray(body?.terms) ? body.terms.slice(0, 500) : body?.term ? [body.term] : [];
  const rows = raw.map((t) => cleanTerm(t, userId)).filter(Boolean) as NonNullable<ReturnType<typeof cleanTerm>>[];
  if (!rows.length) return NextResponse.json({ error: "nothing to save" }, { status: 400 });

  const { data, error } = await createAdminClient()
    .from("glossary_terms")
    .upsert(rows, { onConflict: "user_id,client_id" })
    .select(GLOSSARY_COLS);

  if (error) {
    if (isMissingGlossary(error)) return NextResponse.json({ error: "glossary_table_missing" }, { status: 503 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ terms: (data || []).map(rowToTerm) });
}

export async function DELETE(req: NextRequest) {
  if (!supabaseConfigured()) return NextResponse.json({ error: "not configured" }, { status: 500 });
  const userId = await requestUserId(req);
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const ids = [
    ...(req.nextUrl.searchParams.get("ids") || "").split(",").map((s) => s.trim()).filter(Boolean),
    ...(Array.isArray(body?.ids) ? body.ids.map((s: unknown) => String(s || "").trim()).filter(Boolean) : []),
  ].slice(0, 500);
  if (!ids.length) return NextResponse.json({ error: "nothing to delete" }, { status: 400 });

  const { error } = await createAdminClient().from("glossary_terms").delete().eq("user_id", userId).in("client_id", ids);
  if (error) {
    if (isMissingGlossary(error)) return NextResponse.json({ error: "glossary_table_missing" }, { status: 503 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ deleted: ids.length });
}
