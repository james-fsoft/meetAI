import { NextResponse } from "next/server";

/**
 * POST /api/soniox-token
 * Mints a short-lived Soniox temporary API key for the browser to open a
 * real-time WebSocket directly. The long-lived SONIOX_API_KEY never leaves
 * the server. Returns Soniox's response, which includes { api_key, expires_at }.
 */
export async function POST() {
  const key = process.env.SONIOX_API_KEY;
  if (!key) return NextResponse.json({ error: "Server missing SONIOX_API_KEY" }, { status: 500 });

  const r = await fetch("https://api.soniox.com/v1/auth/temporary-api-key", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ usage_type: "transcribe_websocket", expires_in_seconds: 300 }),
  });
  const d = await r.json();
  if (!r.ok) return NextResponse.json({ error: d.message || d.error || "Soniox error" }, { status: r.status });
  return NextResponse.json(d);
}
