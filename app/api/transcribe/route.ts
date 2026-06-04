import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300; // allow long polling on hosts that support it

const SONIOX = "https://api.soniox.com/v1";

/**
 * POST /api/transcribe
 * Body: multipart/form-data with field "file" (audio blob).
 * Uses Soniox async transcription (model stt-async-v4) with speaker diarization,
 * then returns a "Speaker 1: ... / Speaker 2: ..." transcript.
 * Uses the server-side SONIOX_API_KEY so the browser never sees it.
 */
export async function POST(req: NextRequest) {
  const key = process.env.SONIOX_API_KEY;
  if (!key) return NextResponse.json({ error: "Server missing SONIOX_API_KEY" }, { status: 500 });
  const auth = { Authorization: `Bearer ${key}` };

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 });

  // 1) upload the file
  const upForm = new FormData();
  upForm.append("file", file, file.name || "audio.webm");
  const up = await fetch(`${SONIOX}/files`, { method: "POST", headers: auth, body: upForm });
  const uj = await up.json();
  if (!up.ok) return NextResponse.json({ error: uj.message || "upload failed" }, { status: 502 });

  // 2) create the transcription with diarization
  const cr = await fetch(`${SONIOX}/transcriptions`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({
      file_id: uj.id,
      model: "stt-async-v4",
      enable_speaker_diarization: true,
    }),
  });
  const cj = await cr.json();
  if (!cr.ok) return NextResponse.json({ error: cj.message || "request failed" }, { status: 502 });
  const id = cj.id;

  // 3) poll until done
  for (let i = 0; i < 200; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const pr = await fetch(`${SONIOX}/transcriptions/${id}`, { headers: auth });
    const pj = await pr.json();
    if (pj.status === "completed") {
      const tr = await fetch(`${SONIOX}/transcriptions/${id}/transcript`, { headers: auth });
      const tj = await tr.json();
      // clean up the stored file + transcription (best-effort)
      fetch(`${SONIOX}/files/${uj.id}`, { method: "DELETE", headers: auth }).catch(() => {});
      fetch(`${SONIOX}/transcriptions/${id}`, { method: "DELETE", headers: auth }).catch(() => {});
      return NextResponse.json({ transcript: tokensToText(tj.tokens || []) });
    }
    if (pj.status === "error") {
      return NextResponse.json({ error: pj.error_message || "transcription error" }, { status: 502 });
    }
  }
  return NextResponse.json({ error: "timeout" }, { status: 504 });
}

// Group consecutive tokens by speaker into "Speaker N: text" lines.
function tokensToText(tokens: any[]): string {
  const map: Record<string, string> = {};
  let n = 0;
  const lines: string[] = [];
  let curSpk: string | null = null;
  let buf = "";
  const flush = () => {
    if (!buf.trim()) { buf = ""; return; }
    const label = curSpk != null ? (map[curSpk] || (map[curSpk] = "Speaker " + ++n)) + ": " : "";
    lines.push(label + buf.trim());
    buf = "";
  };
  for (const tk of tokens) {
    if (tk.text == null) continue;
    const spk = tk.speaker != null ? String(tk.speaker) : null;
    if (spk !== curSpk) { flush(); curSpk = spk; }
    buf += tk.text;
  }
  flush();
  return lines.join("\n");
}
