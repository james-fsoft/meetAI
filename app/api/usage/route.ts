import { NextRequest, NextResponse } from "next/server";
import { createClient as createServer, supabaseConfigured } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { userFromBearer } from "@/lib/auth-token";
import { usagePayload } from "@/lib/usage";

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

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const mkey = today.slice(0, 7);                       // YYYY-MM
  let secToday = prof.day_key === today ? (prof.seconds_today || 0) : 0;
  let secMonth = prof.month_key === mkey ? (prof.seconds_month || 0) : 0;

  if (seconds > 0 || prof.day_key !== today || prof.month_key !== mkey) {
    secToday += seconds; secMonth += seconds;
    await admin.from("profiles").update({
      seconds_today: secToday, day_key: today, seconds_month: secMonth, month_key: mkey,
    }).eq("id", userId);
  }

  return NextResponse.json(usagePayload(prof.plan || "free", secToday, secMonth, prof.bonus_minutes || 0));
}

export async function GET(req: NextRequest) { return handle(req, 0); }

export async function POST(req: NextRequest) {
  let sec = 0;
  try { const b = await req.json(); sec = Math.max(0, Math.min(120, parseInt(b.seconds, 10) || 0)); } catch {}
  return handle(req, sec);
}
