import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300; // allow long polling on hosts that support it

/**
 * POST /api/transcribe
 * Body: multipart/form-data with field "file" (audio blob)
 * Uploads to AssemblyAI, requests speaker_labels, polls until done,
 * returns a "Speaker 1: ... / Speaker 2: ..." transcript.
 *
 * Uses the server-side ASSEMBLYAI_API_KEY so the browser never sees it.
 */
export async function POST(req: NextRequest) {
  const key = process.env.ASSEMBLYAI_API_KEY;
  if (!key) return NextResponse.json({ error: "Server missing ASSEMBLYAI_API_KEY" }, { status: 500 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 });

  // 1) upload
  const up = await fetch("https://api.assemblyai.com/v2/upload", {
    method: "POST",
    headers: { authorization: key },
    body: Buffer.from(await file.arrayBuffer()),
  });
  const uj = await up.json();
  if (!up.ok) return NextResponse.json({ error: uj.error || "upload failed" }, { status: 502 });

  // 2) request transcript with diarization
  const cr = await fetch("https://api.assemblyai.com/v2/transcript", {
    method: "POST",
    headers: { authorization: key, "content-type": "application/json" },
    body: JSON.stringify({
      audio_url: uj.upload_url,
      speech_models: ["universal-2"],
      speaker_labels: true,
      language_detection: true,
    }),
  });
  const cj = await cr.json();
  if (!cr.ok) return NextResponse.json({ error: cj.error || "request failed" }, { status: 502 });

  // 3) poll
  for (let i = 0; i < 200; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const pr = await fetch(`https://api.assemblyai.com/v2/transcript/${cj.id}`, {
      headers: { authorization: key },
    });
    const pj = await pr.json();
    if (pj.status === "completed") {
      let text = pj.text || "";
      if (pj.utterances?.length) {
        const map: Record<string, string> = {};
        let n = 0;
        text = pj.utterances
          .map((u: any) => {
            if (!(u.speaker in map)) map[u.speaker] = "Speaker " + ++n;
            return `${map[u.speaker]}: ${u.text}`;
          })
          .join("\n");
      }
      return NextResponse.json({ transcript: text });
    }
    if (pj.status === "error") return NextResponse.json({ error: pj.error }, { status: 502 });
  }
  return NextResponse.json({ error: "timeout" }, { status: 504 });
}
