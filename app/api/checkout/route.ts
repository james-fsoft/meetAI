import { NextRequest, NextResponse } from "next/server";
import { createClient, supabaseConfigured } from "@/lib/supabase-server";

// Map each paid plan to its Lemon Squeezy variant id (set in env once products exist).
const VARIANTS: Record<string, string | undefined> = {
  pro: process.env.LEMONSQUEEZY_VARIANT_PRO,
  business: process.env.LEMONSQUEEZY_VARIANT_BUSINESS,
};

/**
 * POST /api/checkout?plan=pro|business
 * Creates a Lemon Squeezy checkout for the signed-in user and returns its URL.
 * Until Lemon Squeezy is configured, responds with a clear 400 so the UI can
 * fall back gracefully.
 */
export async function POST(req: NextRequest) {
  const plan = new URL(req.url).searchParams.get("plan") || "";
  const variant = VARIANTS[plan];
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
      { error: "Thanh toán chưa được cấu hình (Lemon Squeezy)." },
      { status: 400 }
    );
  }

  const origin = new URL(req.url).origin;
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
          product_options: { redirect_url: `${origin}/?upgraded=${plan}` },
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
