import { NextRequest, NextResponse } from "next/server";
import { supabaseConfigured } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { requestUserId, isMissingTable, FULL_COLS } from "@/lib/meetings";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// GET /api/meetings/:id → one meeting with transcript + live turns.
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!supabaseConfigured()) return NextResponse.json({ error: "not configured" }, { status: 500 });
  const userId = await requestUserId(req);
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!UUID.test(params.id)) return NextResponse.json({ error: "bad id" }, { status: 400 });

  const { data, error } = await createAdminClient()
    .from("meetings").select(FULL_COLS).eq("user_id", userId).eq("id", params.id).maybeSingle();
  if (error) {
    if (isMissingTable(error)) return NextResponse.json({ error: "meetings_table_missing" }, { status: 503 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ meeting: data });
}

// DELETE /api/meetings/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!supabaseConfigured()) return NextResponse.json({ error: "not configured" }, { status: 500 });
  const userId = await requestUserId(req);
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!UUID.test(params.id)) return NextResponse.json({ error: "bad id" }, { status: 400 });

  const { error } = await createAdminClient().from("meetings").delete().eq("user_id", userId).eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
