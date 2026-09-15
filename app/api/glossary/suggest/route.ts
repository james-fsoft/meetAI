import { NextRequest, NextResponse } from "next/server";
import { supabaseConfigured } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { requestUserId, isMissingTable } from "@/lib/meetings";
import { KINDS } from "@/lib/glossary";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * POST /api/glossary/suggest  { have?: string[] }
 * Reads the caller's most recent saved meetings and suggests proper nouns and
 * terms worth adding to their dictionary — the ones speech recognition is most
 * likely to get wrong. Returns { suggestions: [{ term, kind }] }.
 */
export async function POST(req: NextRequest) {
  // Who is asking comes first, so an anonymous caller gets "sign in", not a server error.
  if (!supabaseConfigured()) return NextResponse.json({ suggestions: [], signedIn: false });
  const userId = await requestUserId(req);
  if (!userId) return NextResponse.json({ suggestions: [], signedIn: false }, { status: 401 });
  const key = process.env.OPENAI_API_KEY;
  if (!key) return NextResponse.json({ error: "Server missing OPENAI_API_KEY" }, { status: 500 });

  const body = await req.json().catch(() => ({} as any));
  const have: string[] = Array.isArray(body?.have) ? body.have.map((s: unknown) => String(s || "").toLowerCase()) : [];

  const { data, error } = await createAdminClient()
    .from("meetings")
    .select("title,summary,transcript,started_at")
    .eq("user_id", userId)
    .order("started_at", { ascending: false })
    .limit(8);
  if (error) {
    if (isMissingTable(error)) return NextResponse.json({ suggestions: [], noMeetings: true, signedIn: true });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const text = (data || [])
    .map((m: any) => [m.title, m.summary, m.transcript].filter(Boolean).join("\n"))
    .join("\n\n")
    .slice(-12000)
    .trim();
  if (text.length < 120) return NextResponse.json({ suggestions: [], noMeetings: true, signedIn: true });

  const sys =
    `You help build a speech-recognition dictionary. From the meeting text, list the proper nouns and ` +
    `special terms a speech engine would most likely get wrong: people, companies, products, technical terms, acronyms. ` +
    `Ignore common words, generic job titles and anything you are not sure is a name or term. ` +
    `Reply ONLY as compact JSON: {"items":[{"term":"...","kind":"person|company|product|term|acronym"}]} — at most 8 items, ` +
    `each term written exactly as it should appear.`;

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: sys }, { role: "user", content: text }],
      }),
    });
    const d = await r.json();
    if (!r.ok) return NextResponse.json({ error: d.error?.message || "OpenAI error" }, { status: r.status });
    const items = JSON.parse(d.choices?.[0]?.message?.content || "{}")?.items;
    const suggestions = (Array.isArray(items) ? items : [])
      .map((x: any) => ({ term: String(x?.term || "").trim().slice(0, 120), kind: KINDS.includes(x?.kind) ? x.kind : "term" }))
      .filter((x: any) => x.term && !have.includes(x.term.toLowerCase()))
      .slice(0, 6);
    return NextResponse.json({ suggestions, signedIn: true });
  } catch {
    return NextResponse.json({ error: "suggest failed" }, { status: 500 });
  }
}
