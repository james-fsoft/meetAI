import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient, isAdmin } from "@/lib/supabase-admin";

const ALLOWED = ["free", "pro", "business", "enterprise"];

/**
 * POST /api/admin/set-plan  { userId, plan }
 * Admin-only: updates a profile's plan. Verifies the caller is an admin
 * via their session, then uses the service-role client to update.
 */
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user?.email)) return NextResponse.json({ error: "Không có quyền" }, { status: 403 });

  const { userId, plan } = await req.json().catch(() => ({}));
  if (!userId || !ALLOWED.includes(plan)) {
    return NextResponse.json({ error: "Tham số không hợp lệ" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("profiles").update({ plan }).eq("id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
