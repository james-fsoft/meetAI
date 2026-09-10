import { NextRequest, NextResponse } from "next/server";
import { supabaseConfigured } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { requestUserId, isMissingTable, cleanMeeting, LIST_COLS } from "@/lib/meetings";

export const dynamic = "force-dynamic";

/**
 * GET  /api/meetings?from=ISO&to=ISO → the caller's meetings in that range (calendar).
 * POST /api/meetings  { meeting } | { meetings: [...] } → upsert by (user, client_id).
 */
export async function GET(req: NextRequest) {
  if (!supabaseConfigured()) return NextResponse.json({ error: "not configured" }, { status: 500 });
  const userId = await requestUserId(req);
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const sp = req.nextUrl.searchParams;
  const from = new Date(sp.get("from") || "");
  const to = new Date(sp.get("to") || "");

  let q = createAdminClient().from("meetings").select(LIST_COLS).eq("user_id", userId);
  if (!isNaN(from.getTime())) q = q.gte("started_at", from.toISOString());
  if (!isNaN(to.getTime())) q = q.lt("started_at", to.toISOString());
  const { data, error } = await q.order("started_at", { ascending: true }).limit(1000);

  if (error) {
    if (isMissingTable(error)) return NextResponse.json({ error: "meetings_table_missing" }, { status: 503 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ meetings: data || [] });
}

export async function POST(req: NextRequest) {
  if (!supabaseConfigured()) return NextResponse.json({ error: "not configured" }, { status: 500 });
  const userId = await requestUserId(req);
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const list: any[] = Array.isArray(body?.meetings) ? body.meetings.slice(0, 50) : body?.meeting ? [body.meeting] : [];
  const rows = list.map((m) => cleanMeeting(m, userId)).filter(Boolean) as NonNullable<ReturnType<typeof cleanMeeting>>[];
  if (!rows.length) return NextResponse.json({ error: "nothing to save" }, { status: 400 });

  const { data, error } = await createAdminClient()
    .from("meetings")
    .upsert(rows, { onConflict: "user_id,client_id" })
    .select("id,client_id");

  if (error) {
    if (isMissingTable(error)) return NextResponse.json({ error: "meetings_table_missing" }, { status: 503 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ saved: data || [] });
}
