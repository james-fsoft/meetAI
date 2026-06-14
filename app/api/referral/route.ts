import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient as createServer, supabaseConfigured } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { userFromBearer } from "@/lib/auth-token";

export const dynamic = "force-dynamic";

const BONUS = 60; // minutes credited to each side

async function getUser(req: NextRequest): Promise<{ id: string } | null> {
  const u = await userFromBearer(req);
  if (u) return { id: u.id };
  try {
    const sb = createServer();
    const { data: { user } } = await sb.auth.getUser();
    return user ? { id: user.id } : null;
  } catch { return null; }
}

// GET /api/referral → returns the signed-in user's personal invite link
// (generating a stable code on first call).
export async function GET(req: NextRequest) {
  if (!supabaseConfigured()) return NextResponse.json({ error: "not configured" }, { status: 500 });
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "login", code: "login" }, { status: 401 });

  const admin = createAdminClient();
  const { data: prof } = await admin.from("profiles").select("ref_code").eq("id", user.id).single();
  let code = prof?.ref_code as string | undefined;
  if (!code) {
    // short, URL-safe, hard-to-guess
    for (let i = 0; i < 4 && !code; i++) {
      const candidate = crypto.randomBytes(5).toString("base64url").replace(/[-_]/g, "").slice(0, 7).toUpperCase();
      const { error } = await admin.from("profiles").update({ ref_code: candidate }).eq("id", user.id);
      if (!error) code = candidate;
    }
    if (!code) return NextResponse.json({ error: "could not create code" }, { status: 500 });
  }
  const origin = new URL(req.url).origin;
  return NextResponse.json({ code, link: `${origin}/?ref=${code}`, bonus: BONUS });
}

// POST /api/referral { code } → claim a referral (called once after a new user
// signs up via someone's link). Credits +BONUS minutes to BOTH sides.
export async function POST(req: NextRequest) {
  if (!supabaseConfigured()) return NextResponse.json({ error: "not configured" }, { status: 500 });
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "login" }, { status: 401 });
  const { code } = await req.json().catch(() => ({}));
  if (!code) return NextResponse.json({ ok: false });

  const admin = createAdminClient();
  const { data: me } = await admin.from("profiles").select("id, referred_by, bonus_minutes").eq("id", user.id).single();
  if (!me) return NextResponse.json({ ok: false });
  if (me.referred_by) return NextResponse.json({ ok: true, already: true }); // already referred → no double credit

  const { data: ref } = await admin.from("profiles").select("id, bonus_minutes").eq("ref_code", String(code)).single();
  if (!ref || ref.id === user.id) return NextResponse.json({ ok: false }); // invalid or self-referral

  // credit both sides
  await admin.from("profiles").update({ referred_by: ref.id, bonus_minutes: (me.bonus_minutes || 0) + BONUS }).eq("id", user.id);
  await admin.from("profiles").update({ bonus_minutes: (ref.bonus_minutes || 0) + BONUS }).eq("id", ref.id);

  return NextResponse.json({ ok: true, credited: BONUS });
}
