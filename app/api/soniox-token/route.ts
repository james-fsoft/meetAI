import { NextRequest, NextResponse } from "next/server";
import { userFromBearer } from "@/lib/auth-token";

/**
 * POST /api/soniox-token
 * Mints a short-lived Soniox temporary API key for the browser to open a
 * real-time WebSocket directly. The long-lived SONIOX_API_KEY never leaves
 * the server. Returns Soniox's response, which includes { api_key, expires_at }.
 *
 * Cost guardrails (defense-in-depth — the hard ceiling is your Soniox prepaid
 * balance with autopay OFF):
 *   - per-IP burst limit  (stops one client from spamming sessions)
 *   - global daily cap    (caps total trial sessions opened per day)
 * Tune via env: TRIAL_MAX_PER_MIN, TRIAL_DAILY_CAP.
 */

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

export async function POST(req: NextRequest) {
  const key = process.env.SONIOX_API_KEY;
  if (!key) return NextResponse.json({ error: "Server missing SONIOX_API_KEY" }, { status: 500 });

  // Signed-in paid plans skip the anonymous rate limits.
  const user = await userFromBearer(req);
  const paid = !!user && user.plan !== "free";

  if (!paid) {
    // global daily cap (resets at UTC midnight)
    const today = new Date().toISOString().slice(0, 10);
    if (today !== dayKey) { dayKey = today; dayCount = 0; }
    if (dayCount >= DAILY_CAP) {
      return NextResponse.json(
        { error: "Hệ thống dùng thử đang quá tải hôm nay. Vui lòng đăng nhập gói trả phí để tiếp tục." },
        { status: 429 }
      );
    }
    // per-IP burst limit
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

  if (!paid) dayCount++;
  return NextResponse.json(d);
}
