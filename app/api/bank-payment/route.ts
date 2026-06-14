import { NextRequest, NextResponse } from "next/server";
import { createClient as createServer, supabaseConfigured } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { userFromBearer } from "@/lib/auth-token";
import { planAmount, transferContent, vietQrUrl, bankConfigured, BANK, CONFIRM_HOURS } from "@/lib/billing";
import { sendOrderEmails } from "@/lib/email";

export const dynamic = "force-dynamic";

const PLANS = ["pro", "business"];

async function getUser(req: NextRequest): Promise<{ id: string; email: string | null } | null> {
  const u = await userFromBearer(req);
  if (u) return { id: u.id, email: u.email };
  try {
    const sb = createServer();
    const { data: { user } } = await sb.auth.getUser();
    return user ? { id: user.id, email: user.email ?? null } : null;
  } catch { return null; }
}

/**
 * POST /api/bank-payment
 *   { action: "create", plan, billing }  → create a pending order, return QR + bank info
 *   { action: "submitted", id }          → user claims they transferred → email user + admin
 */
export async function POST(req: NextRequest) {
  if (!supabaseConfigured()) return NextResponse.json({ error: "Chưa cấu hình hệ thống." }, { status: 500 });
  const body = await req.json().catch(() => ({}));
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "unauthorized", code: "login" }, { status: 401 });

  const admin = createAdminClient();

  if (body.action === "create") {
    if (!bankConfigured()) return NextResponse.json({ error: "Thanh toán chuyển khoản chưa được cấu hình." }, { status: 503 });
    const plan = String(body.plan || "");
    const billing = body.billing === "annual" ? "annual" : "monthly";
    if (!PLANS.includes(plan)) return NextResponse.json({ error: "Gói không hợp lệ." }, { status: 400 });
    const amount = planAmount(plan, billing);
    if (!amount) return NextResponse.json({ error: "Không xác định được số tiền." }, { status: 400 });

    const content = transferContent(plan, user.id);
    const { data, error } = await admin.from("payments").insert({
      user_id: user.id, email: user.email, plan, billing, amount, content, status: "pending",
    }).select("id").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({
      id: data.id, amount, content, confirmHours: CONFIRM_HOURS,
      bank: { name: BANK.label, account: BANK.account, holder: BANK.name },
      qrUrl: vietQrUrl(amount, content),
    });
  }

  if (body.action === "submitted") {
    const id = String(body.id || "");
    if (!id) return NextResponse.json({ error: "Thiếu mã đơn." }, { status: 400 });
    const { data: pay } = await admin.from("payments").select("*").eq("id", id).eq("user_id", user.id).single();
    if (!pay) return NextResponse.json({ error: "Không tìm thấy đơn." }, { status: 404 });

    if (pay.status === "pending") {
      await admin.from("payments").update({ status: "awaiting" }).eq("id", id);
    }

    const emailed = await sendOrderEmails(admin, pay, user.email);
    return NextResponse.json({ ok: true, confirmHours: CONFIRM_HOURS, emailed });
  }

  return NextResponse.json({ error: "Hành động không hợp lệ." }, { status: 400 });
}
