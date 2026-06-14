import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient, isAdmin } from "@/lib/supabase-admin";
import { sendEmail, emailLayout, sendOrderEmails } from "@/lib/email";
import { fmtVnd } from "@/lib/billing";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return isAdmin(user?.email) ? user : null;
}

// GET /api/admin/payments → pending + awaiting orders (newest first)
export async function GET() {
  const me = await requireAdmin();
  if (!me) return NextResponse.json({ error: "Không có quyền" }, { status: 403 });
  const admin = createAdminClient();
  const { data, error } = await admin.from("payments")
    .select("*").in("status", ["pending", "awaiting"]).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ payments: data || [] });
}

// POST /api/admin/payments { id, action: "confirm" | "reject" }
export async function POST(req: NextRequest) {
  const me = await requireAdmin();
  if (!me) return NextResponse.json({ error: "Không có quyền" }, { status: 403 });

  const { id, action } = await req.json().catch(() => ({}));
  if (!id || !["confirm", "reject", "resend"].includes(action)) {
    return NextResponse.json({ error: "Tham số không hợp lệ" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: pay } = await admin.from("payments").select("*").eq("id", id).single();
  if (!pay) return NextResponse.json({ error: "Không tìm thấy đơn" }, { status: 404 });

  if (action === "resend") {
    const emailed = await sendOrderEmails(admin, pay, pay.email);
    return NextResponse.json({ ok: true, emailed });
  }

  if (action === "confirm") {
    if (pay.user_id) {
      const { error } = await admin.from("profiles").update({ plan: pay.plan }).eq("id", pay.user_id);
      if (error) return NextResponse.json({ error: "Cập nhật gói lỗi: " + error.message }, { status: 500 });
    }
    await admin.from("payments").update({
      status: "confirmed", confirmed_at: new Date().toISOString(), confirmed_by: me.email,
    }).eq("id", id);
    // tell the user their plan is live
    if (pay.email) {
      await sendEmail(
        pay.email,
        "Gói của bạn đã được kích hoạt — Flash Meet",
        emailLayout("Kích hoạt thành công ✅", `
          <p style="font-size:14px;line-height:1.6;color:#33405c">Gói <b>${String(pay.plan).toUpperCase()}</b> (${pay.billing === "annual" ? "theo năm" : "theo tháng"}) đã được kích hoạt cho tài khoản của bạn.</p>
          <p style="font-size:14px;line-height:1.6;color:#33405c">Số tiền: <b>${fmtVnd(pay.amount)}</b></p>
          <p style="font-size:14px;color:#33405c">Cảm ơn bạn đã sử dụng Flash Meet! Đăng nhập tại meet.transflash.app để bắt đầu.</p>
        `)
      );
    }
    return NextResponse.json({ ok: true });
  }

  // reject
  await admin.from("payments").update({
    status: "rejected", confirmed_at: new Date().toISOString(), confirmed_by: me.email,
  }).eq("id", id);
  return NextResponse.json({ ok: true });
}
