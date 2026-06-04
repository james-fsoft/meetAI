import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 120;

/**
 * POST /api/transcribe-openai
 * Body: multipart/form-data with field "file" (audio blob) and optional "model".
 * Proxies to OpenAI's audio transcription endpoint using the server-side key.
 * Used for the Whisper fallback (no AssemblyAI) and the live multi-speaker mode.
 * Returns: { text: string }
 */
export async function POST(req: NextRequest) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return NextResponse.json({ error: "Server missing OPENAI_API_KEY" }, { status: 500 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 });
  const model = (form.get("model") as string) || "whisper-1";

  const fd = new FormData();
  fd.append("file", file, file.name || "audio.webm");
  fd.append("model", model);

  const r = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: fd,
  });
  const d = await r.json();
  if (!r.ok) return NextResponse.json({ error: d.error?.message || "OpenAI error" }, { status: r.status });
  return NextResponse.json({ text: (d.text || "").trim() });
}
