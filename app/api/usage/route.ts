import { NextRequest, NextResponse } from "next/server";
import { createClient as createServer, supabaseConfigured } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { userFromBearer } from "@/lib/auth-token";
import { usagePayload, planLimits } from "@/lib/usage";

export const dynamic = "force-dynamic";

// Identify the caller via Bearer token (extension) or session cookie (web app).
async function getUserId(req: NextRequest): Promise<string | null> {
  const u = await userFromBearer(req);
  if (u) return u.id;
  try {
    const sb = createServer();
    const { data: { user } } = await sb.auth.getUser();
    return user?.id ?? null;
  } catch { return null; }
}

async function handle(req: NextRequest, seconds: number) {
  if (!supabaseConfigured()) return NextResponse.json({ error: "not configured" }, { status: 500 });
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data: prof } = await admin.from("profiles")
    .select("plan, seconds_today, day_key, seconds_month, month_key, bonus_minutes").eq("id", userId).single();
  if (!prof) return NextResponse.json({ error: "no profile" }, { status: 404 });

  const plan = prof.plan || "free";
  const lim = planLimits(plan);
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const mkey = today.slice(0, 7);                       // YYYY-MM
  const prevToday = prof.day_key === today ? (prof.seconds_today || 0) : 0;
  const prevMonth = prof.month_key === mkey ? (prof.seconds_month || 0) : 0;
  let secToday = prevToday, secMonth = prevMonth, bonus = Math.max(0, prof.bonus_minutes || 0);

  if (seconds > 0 || prof.day_key !== today || prof.month_key !== mkey) {
    secToday = prevToday + seconds;
    secMonth = prevMonth + seconds;
    // Minutes used beyond the monthly plan quota are drawn from the one-time bonus pool.
    if (seconds > 0 && lim.month != null && bonus > 0) {
      const planSec = lim.month * 60;
      const roomLeft = Math.max(0, planSec - prevMonth);
      const overSec = Math.max(0, seconds - roomLeft);
      if (overSec > 0) bonus = Math.max(0, bonus - Math.ceil(overSec / 60));
    }
    await admin.from("profiles").update({
      seconds_today: secToday, day_key: today, seconds_month: secMonth, month_key: mkey, bonus_minutes: bonus,
    }).eq("id", userId);
  }

  return NextResponse.json(usagePayload(plan, secToday, secMonth, bonus));
}

export async function GET(req: NextRequest) { return handle(req, 0); }

export async function POST(req: NextRequest) {
  let sec = 0;
  try { const b = await req.json(); sec = Math.max(0, Math.min(120, parseInt(b.seconds, 10) || 0)); } catch {}
  return handle(req, sec);
}
