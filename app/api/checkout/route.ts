import { NextRequest, NextResponse } from "next/server";
import { createClient, supabaseConfigured } from "@/lib/supabase-server";

// Map each paid plan + billing cycle to its Lemon Squeezy variant id.
// Set these in env once the products/variants exist in your store.
const VARIANTS: Record<string, Record<string, string | undefined>> = {
  pro: {
    monthly: process.env.LEMONSQUEEZY_VARIANT_PRO,
    annual: process.env.LEMONSQUEEZY_VARIANT_PRO_ANNUAL,
  },
  business: {
    monthly: process.env.LEMONSQUEEZY_VARIANT_BUSINESS,
    annual: process.env.LEMONSQUEEZY_VARIANT_BUSINESS_ANNUAL,
  },
};

/**
 * POST /api/checkout?plan=pro|business&billing=monthly|annual
 * Creates a Lemon Squeezy checkout for the signed-in user and returns its URL.
 * The user id + plan ride along in custom data so the webhook can upgrade them.
 */
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const plan = url.searchParams.get("plan") || "";
  const billing = url.searchParams.get("billing") === "annual" ? "annual" : "monthly";
  const variant = VARIANTS[plan]?.[billing];
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;

  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "Cần đăng nhập trước khi thanh toán" }, { status: 401 });
  }
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Cần đăng nhập" }, { status: 401 });

  if (!apiKey || !storeId || !variant) {
    return NextResponse.json(
      { error: "Thanh toán thẻ chưa được cấu hình (Lemon Squeezy)." },
      { status: 400 }
    );
  }

  const r = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: { email: user.email, custom: { user_id: user.id, plan } },
          product_options: { redirect_url: `${url.origin}/?upgraded=${plan}` },
        },
        relationships: {
          store: { data: { type: "stores", id: String(storeId) } },
          variant: { data: { type: "variants", id: String(variant) } },
        },
      },
    }),
  });
  const d = await r.json();
  if (!r.ok) {
    return NextResponse.json({ error: d.errors?.[0]?.detail || "Lemon Squeezy error" }, { status: 502 });
  }
  return NextResponse.json({ url: d.data?.attributes?.url });
}
