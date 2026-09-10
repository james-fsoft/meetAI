import type { NextRequest } from "next/server";
import { createClient as createServer } from "@/lib/supabase-server";
import { userFromBearer } from "@/lib/auth-token";

// Identify the caller via Bearer token (extension) or session cookie (web app).
export async function requestUserId(req: NextRequest): Promise<string | null> {
  const u = await userFromBearer(req);
  if (u) return u.id;
  try {
    const sb = createServer();
    const { data: { user } } = await sb.auth.getUser();
    return user?.id ?? null;
  } catch { return null; }
}

// The meetings table is created by supabase/meetings-schema.sql. Until that has
// been run, PostgREST answers with one of these codes — surface it clearly so
// the dashboard can say "cloud storage not enabled" instead of a generic error.
export function isMissingTable(err: { code?: string; message?: string } | null | undefined) {
  if (!err) return false;
  return err.code === "42P01" || err.code === "PGRST205" || /relation .*meetings.* does not exist/i.test(err.message || "");
}

// Light columns for calendar/list views; the detail view also loads transcript + live.
export const LIST_COLS = "id,client_id,title,summary,started_at,duration_sec,updated_at";
export const FULL_COLS = LIST_COLS + ",transcript,live";

const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");

// Validates + caps one meeting coming from the browser. Returns null if unusable.
export function cleanMeeting(raw: any, userId: string) {
  if (!raw || typeof raw !== "object") return null;
  const clientId = Number(raw.client_id);
  if (!Number.isFinite(clientId) || clientId <= 0) return null;

  const transcript = str(raw.transcript, 500_000);
  const summary = str(raw.summary, 100_000);
  const live = Array.isArray(raw.live)
    ? raw.live.slice(-5000).map((p: any) => ({
        src: str(p?.src, 4000),
        tgt: str(p?.tgt, 4000),
        spk: typeof p?.spk === "number" ? p.spk : null,
      }))
    : [];
  if (!transcript.trim() && !summary.trim() && !live.length) return null;

  const started = new Date(Number(raw.started_at) || raw.started_at || clientId);
  return {
    user_id: userId,
    client_id: Math.floor(clientId),
    title: str(raw.title, 200).trim(),
    summary,
    transcript,
    live,
    started_at: isNaN(started.getTime()) ? new Date(clientId).toISOString() : started.toISOString(),
    duration_sec: Math.max(0, Math.min(86_400, Math.round(Number(raw.duration_sec) || 0))),
    updated_at: new Date().toISOString(),
  };
}
