import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient, isAdmin } from "@/lib/supabase-admin";

/**
 * POST /api/admin/grant-trial  { userId, days }
 * Admin-only. Grants a free trial (treated as Pro) for `days` days, or revokes
 * it when days = 0. Sets profiles.trial_until.
 */
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user?.email)) return NextResponse.json({ error: "Không có quyền" }, { status: 403 });

  const { userId, days } = await req.json().catch(() => ({}));
  if (!userId) return NextResponse.json({ error: "Thiếu userId" }, { status: 400 });

  const d = Number(days);
  const trial_until =
    d === 0
      ? null // revoke
      : new Date(Date.now() + (Number.isFinite(d) && d > 0 ? d : 7) * 86400000).toISOString();

  const admin = createAdminClient();
  const { error } = await admin.from("profiles").update({ trial_until }).eq("id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, trial_until });
}
