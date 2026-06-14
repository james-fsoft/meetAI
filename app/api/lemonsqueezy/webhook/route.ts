import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

// Reverse map: variant id → plan, so we can resolve the plan even if custom data
// is missing on an event.
function planFromVariant(variantId: string): string | null {
  const m: Record<string, string | undefined> = {
    [process.env.LEMONSQUEEZY_VARIANT_PRO || ""]: "pro",
    [process.env.LEMONSQUEEZY_VARIANT_PRO_ANNUAL || ""]: "pro",
    [process.env.LEMONSQUEEZY_VARIANT_BUSINESS || ""]: "business",
    [process.env.LEMONSQUEEZY_VARIANT_BUSINESS_ANNUAL || ""]: "business",
  };
  return m[variantId] || null;
}

/**
 * POST /api/lemonsqueezy/webhook
 * Receives subscription lifecycle events and keeps the user's plan in sync.
 * Verifies the HMAC signature with LEMONSQUEEZY_WEBHOOK_SECRET.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "webhook not configured" }, { status: 500 });

  const raw = await req.text();
  const signature = req.headers.get("x-signature") || "";
  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  // constant-time compare
  const ok = signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!ok) return NextResponse.json({ error: "bad signature" }, { status: 401 });

  let body: any;
  try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: "bad json" }, { status: 400 }); }

  const event = body?.meta?.event_name as string | undefined;
  const custom = body?.meta?.custom_data || {};
  const attrs = body?.data?.attributes || {};
  if (!event) return NextResponse.json({ ok: true }); // ignore unknown

  // Resolve which user + plan this concerns.
  const userId = custom.user_id as string | undefined;
  const email = (attrs.user_email || custom.email) as string | undefined;
  const plan = (custom.plan as string) || planFromVariant(String(attrs.variant_id || "")) || null;
  const status = String(attrs.status || "");

  // Decide the target plan for this event.
  let target: string | null = null;
  if (["subscription_created", "subscription_updated", "subscription_resumed", "subscription_payment_success"].includes(event)) {
    target = ["expired", "unpaid"].includes(status) ? "free" : (plan || null);
  } else if (["subscription_expired", "subscription_cancelled"].includes(event)) {
    // cancelled keeps access until the period ends; only drop on expiry/unpaid
    target = ["expired", "unpaid"].includes(status) || event === "subscription_expired" ? "free" : (plan || null);
  }
  if (!target) return NextResponse.json({ ok: true });

  const admin = createAdminClient();
  let q = admin.from("profiles").update({ plan: target });
  if (userId) q = q.eq("id", userId);
  else if (email) q = q.eq("email", email);
  else return NextResponse.json({ ok: true }); // nothing to match on
  await q;

  return NextResponse.json({ ok: true });
}
