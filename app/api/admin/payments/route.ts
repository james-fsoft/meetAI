import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient, isAdmin } from "@/lib/supabase-admin";
import { sendEmail, emailLayout, infoBox, sendOrderEmails } from "@/lib/email";
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
        emailLayout("Kích hoạt thành công ✅",
          `<p style="font-family:-apple-system,'Segoe UI',Inter,Roboto,Arial,sans-serif;font-size:14.5px;line-height:1.65;color:#3a4660;margin:0 0 14px">Gói của bạn đã được kích hoạt và sẵn sàng sử dụng. Cảm ơn bạn đã tin dùng Flash Meet!</p>` +
          infoBox([
            ["Gói", `${String(pay.plan).toUpperCase()} · ${pay.billing === "annual" ? "theo năm" : "theo tháng"}`],
            ["Số tiền", fmtVnd(pay.amount)],
            ["Trạng thái", "✅ Đang hoạt động"],
          ]),
          { cta: { text: "Bắt đầu dùng Flash Meet →", url: "https://meet.transflash.app" },
            preheader: `Gói ${String(pay.plan).toUpperCase()} đã được kích hoạt.` })
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
