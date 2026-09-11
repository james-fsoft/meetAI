import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { createClient as createServer, supabaseConfigured } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BUCKET = "conference-sessions";
const MAX_SEGMENTS = 6000;
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

type Segment = {
  id: string;
  ts: number;
  speaker?: number | string | null;
  sourceLang?: string | null;
  original: string;
  translations?: Record<string, string>;
};

type ConferenceState = {
  id: string;
  ownerId: string;
  ownerEmail?: string | null;
  hostKeyHash: string;
  title: string;
  status: "ready" | "live" | "ended";
  createdAt: string;
  updatedAt: string;
  startedAt?: string | null;
  endedAt?: string | null;
  languages: string[];
  panelCount: number;
  transcript: Segment[];
  latest?: any;
  summaryMarkdown?: string;
  insights?: any;
  durationSec?: number;
};

function makeId() {
  let s = "FM-";
  for (let i = 0; i < 10; i++) {
    if (i === 4 || i === 8) s += "-";
    s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return s;
}
function makeHostKey() { return randomBytes(24).toString("base64url"); }
function hash(v: string) { return createHash("sha256").update(v).digest("hex"); }
function safeId(id: string) { return /^FM-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{2}$/.test(id); }
function filePath(id: string) { return `sessions/${id}.json`; }
function indexPath(uid: string) { return `users/${uid}.json`; }

async function ensureBucket() {
  const admin = createAdminClient();
  const { data } = await admin.storage.getBucket(BUCKET);
  if (!data) {
    const { error } = await admin.storage.createBucket(BUCKET, { public: false });
    if (error && !String(error.message || "").toLowerCase().includes("already")) throw error;
  }
  return admin;
}

async function readJson(path: string): Promise<any | null> {
  const admin = await ensureBucket();
  const { data, error } = await admin.storage.from(BUCKET).download(path);
  if (error || !data) return null;
  try { return JSON.parse(await data.text()); } catch { return null; }
}

async function writeJson(path: string, value: any) {
  const admin = await ensureBucket();
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  const { error } = await admin.storage.from(BUCKET).upload(path, bytes, {
    contentType: "application/json",
    upsert: true,
    cacheControl: "0",
  });
  if (error) throw error;
}

async function currentUser(req: NextRequest) {
  if (!supabaseConfigured()) return null;
  try {
    const sb = createServer();
    const { data: { user } } = await sb.auth.getUser();
    return user;
  } catch { return null; }
}

function publicState(s: ConferenceState) {
  const { hostKeyHash, ownerId, ownerEmail, ...rest } = s;
  return rest;
}

async function updateIndex(state: ConferenceState) {
  const path = indexPath(state.ownerId);
  const old = (await readJson(path)) || { sessions: [] };
  const item = {
    id: state.id,
    title: state.title,
    status: state.status,
    createdAt: state.createdAt,
    updatedAt: state.updatedAt,
    startedAt: state.startedAt || null,
    endedAt: state.endedAt || null,
    languages: state.languages,
    durationSec: state.durationSec || 0,
  };
  const sessions = [item, ...(old.sessions || []).filter((x: any) => x.id !== state.id)].slice(0, 100);
  await writeJson(path, { sessions });
}

export async function GET(req: NextRequest) {
  if (!supabaseConfigured()) return NextResponse.json({ error: "not configured" }, { status: 503 });
  const url = new URL(req.url);
  const action = url.searchParams.get("action");
  if (action === "list") {
    const user = await currentUser(req);
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const idx = (await readJson(indexPath(user.id))) || { sessions: [] };
    return NextResponse.json(idx);
  }

  const id = (url.searchParams.get("id") || "").toUpperCase();
  if (!safeId(id)) return NextResponse.json({ error: "Conference ID không hợp lệ" }, { status: 400 });
  const state = await readJson(filePath(id));
  if (!state) return NextResponse.json({ error: "Không tìm thấy hội nghị" }, { status: 404 });
  return NextResponse.json({ conference: publicState(state) });
}

export async function POST(req: NextRequest) {
  if (!supabaseConfigured()) return NextResponse.json({ error: "not configured" }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  const action = body.action;

  if (action === "create") {
    const user = await currentUser(req);
    if (!user) return NextResponse.json({ error: "Vui lòng đăng nhập để tạo Conference ID" }, { status: 401 });
    let id = makeId();
    for (let i = 0; i < 4; i++) {
      if (!(await readJson(filePath(id)))) break;
      id = makeId();
    }
    const hostKey = makeHostKey();
    const now = new Date().toISOString();
    const state: ConferenceState = {
      id,
      ownerId: user.id,
      ownerEmail: user.email,
      hostKeyHash: hash(hostKey),
      title: String(body.title || "Hội nghị Flash Meet").slice(0, 120),
      status: "ready",
      createdAt: now,
      updatedAt: now,
      startedAt: null,
      endedAt: null,
      languages: Array.isArray(body.languages) ? body.languages.slice(0, 3) : ["ko", "vi", "en"],
      panelCount: Number(body.panelCount) === 2 ? 2 : 3,
      transcript: [],
      durationSec: 0,
    };
    await writeJson(filePath(id), state);
    await updateIndex(state);
    return NextResponse.json({ id, hostKey, conference: publicState(state) });
  }

  if (action === "snapshot" || action === "end") {
    const id = String(body.id || "").toUpperCase();
    const hostKey = String(body.hostKey || "");
    if (!safeId(id) || !hostKey) return NextResponse.json({ error: "invalid host credentials" }, { status: 400 });
    const current = await readJson(filePath(id)) as ConferenceState | null;
    if (!current) return NextResponse.json({ error: "conference not found" }, { status: 404 });
    if (hash(hostKey) !== current.hostKeyHash) return NextResponse.json({ error: "forbidden" }, { status: 403 });

    const now = new Date().toISOString();
    const patch = body.state || {};
    const transcript = Array.isArray(patch.transcript)
      ? patch.transcript.slice(-MAX_SEGMENTS).map((x: any) => ({
          id: String(x.id || `${x.ts || Date.now()}-${Math.random()}`),
          ts: Number(x.ts || Date.now()),
          speaker: x.speaker ?? null,
          sourceLang: x.sourceLang ?? null,
          original: String(x.original || "").slice(0, 5000),
          translations: x.translations && typeof x.translations === "object" ? x.translations : {},
        }))
      : current.transcript;

    const next: ConferenceState = {
      ...current,
      title: String(patch.title || current.title).slice(0, 120),
      status: action === "end" ? "ended" : (patch.status === "live" ? "live" : current.status),
      updatedAt: now,
      startedAt: patch.startedAt || current.startedAt || (patch.status === "live" ? now : null),
      endedAt: action === "end" ? now : current.endedAt,
      languages: Array.isArray(patch.languages) ? patch.languages.slice(0, 3) : current.languages,
      panelCount: Number(patch.panelCount) === 2 ? 2 : Number(patch.panelCount) === 3 ? 3 : current.panelCount,
      transcript,
      latest: patch.latest ?? current.latest,
      summaryMarkdown: typeof patch.summaryMarkdown === "string" ? patch.summaryMarkdown.slice(0, 200000) : current.summaryMarkdown,
      insights: patch.insights ?? current.insights,
      durationSec: Math.max(0, Number(patch.durationSec ?? current.durationSec ?? 0)),
    };
    await writeJson(filePath(id), next);
    await updateIndex(next);
    return NextResponse.json({ ok: true, conference: publicState(next) });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
