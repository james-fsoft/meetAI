import { NextRequest, NextResponse } from "next/server";
import { userFromBearer } from "@/lib/auth-token";
import { createClient as createServer, supabaseConfigured } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { hasQuota } from "@/lib/usage";

/**
 * POST /api/soniox-token
 * Mints a short-lived Soniox temporary API key for the browser to open a
 * real-time WebSocket directly. The long-lived SONIOX_API_KEY never leaves
 * the server. Returns Soniox's response, which includes { api_key, expires_at }.
 *
 * Cost guardrails (defense-in-depth — the hard ceiling is your Soniox prepaid
 * balance with autopay OFF):
 *   - signed-in users: HARD per-user quota check (day + month) before issuing a
 *     token. Over quota → 403, no token. Re-checked on every reconnect.
 *   - anonymous users: per-IP burst limit + global daily cap (trial brakes).
 * Tune via env: TRIAL_MAX_PER_MIN, TRIAL_DAILY_CAP.
 */

export const dynamic = "force-dynamic";

const WINDOW_MS = 60_000;
const MAX_PER_MIN = Number(process.env.TRIAL_MAX_PER_MIN || 5);
const DAILY_CAP = Number(process.env.TRIAL_DAILY_CAP || 800);

// In-memory counters (per serverless instance). Good enough as a brake;
// the real ceiling is the Soniox balance.
const hits = new Map<string, number[]>();
let dayKey = "";
let dayCount = 0;

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0] : "") || req.headers.get("x-real-ip") || "unknown";
}

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

export async function POST(req: NextRequest) {
  const key = process.env.SONIOX_API_KEY;
  if (!key) return NextResponse.json({ error: "Server missing SONIOX_API_KEY" }, { status: 500 });

  const userId = supabaseConfigured() ? await getUserId(req) : null;

  if (userId) {
    // Signed-in: enforce the per-user quota server-side (hard ceiling).
    try {
      const admin = createAdminClient();
      const { data: prof } = await admin.from("profiles")
        .select("plan, seconds_today, day_key, seconds_month, month_key").eq("id", userId).single();
      const plan = prof?.plan || "free";
      const today = new Date().toISOString().slice(0, 10);
      const mkey = today.slice(0, 7);
      const secToday = prof?.day_key === today ? (prof.seconds_today || 0) : 0;
      const secMonth = prof?.month_key === mkey ? (prof.seconds_month || 0) : 0;
      if (!hasQuota(plan, secToday, secMonth)) {
        return NextResponse.json(
          { error: "Bạn đã dùng hết hạn mức dịch của gói. Nâng cấp gói hoặc đợi kỳ sau.", code: "quota_exceeded" },
          { status: 403 }
        );
      }
    } catch {
      // Transient profile-lookup error → don't hard-block; the metering loop and
      // the next reconnect's check still bound any overage.
    }
    // Signed-in users skip the anonymous IP/daily brakes.
  } else {
    // Anonymous: trial brakes (the 3-minute trial itself is enforced client-side).
    const today = new Date().toISOString().slice(0, 10);
    if (today !== dayKey) { dayKey = today; dayCount = 0; }
    if (dayCount >= DAILY_CAP) {
      return NextResponse.json(
        { error: "Hệ thống dùng thử đang quá tải hôm nay. Vui lòng đăng nhập gói trả phí để tiếp tục." },
        { status: 429 }
      );
    }
    const ip = clientIp(req);
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_PER_MIN) {
      return NextResponse.json({ error: "Quá nhiều yêu cầu, thử lại sau ít phút." }, { status: 429 });
    }
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 5000) hits.clear(); // opportunistic cleanup
  }

  const r = await fetch("https://api.soniox.com/v1/auth/temporary-api-key", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ usage_type: "transcribe_websocket", expires_in_seconds: 600 }),
  });
  const d = await r.json();
  if (!r.ok) return NextResponse.json({ error: d.message || d.error || "Soniox error" }, { status: r.status });

  if (!userId) dayCount++;
  return NextResponse.json(d);
}
