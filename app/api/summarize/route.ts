import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
// Long meetings can take a while to summarize — give the function room so it
// doesn't time out (the cause of intermittent "summary failed").
export const maxDuration = 60;

/**
 * POST /api/summarize
 * Body: { transcript: string, lang?: string }
 * Uses the server-side OPENAI_API_KEY so the browser never sees it.
 */
export async function POST(req: NextRequest) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return NextResponse.json({ error: "Server missing OPENAI_API_KEY" }, { status: 500 });

  const body = await req.json().catch(() => ({}));
  const { lang = "English", system, glossary = "" } = body;
  const wantStream = body.stream === true; // stream tokens so the UI fills in live (no "wait then dump" lag)
  // Cap the payload (a 3-hour transcript is huge); keep the most recent content.
  let transcript: string = typeof body.transcript === "string" ? body.transcript : "";
  if (transcript.length > 200000) transcript = transcript.slice(-200000);
  if (!transcript.trim()) return NextResponse.json({ error: "Missing transcript" }, { status: 400 });

  // The client sends a localized system prompt (Vietnamese / English / Korean).
  // Fall back to a default if none is provided.
  const sys =
    system ||
    `You are a professional meeting-minutes assistant. The transcript is labeled by speaker ` +
    `(Speaker 1, Speaker 2, …) — keep these exact labels. Write minutes in ${lang}, in Markdown ` +
    `with sections: ## Participants, ## Overview, ## Key points, ## Decisions, ## Action items, ## Open issues. ` +
    `Never invent anything not in the transcript.`;
  const sysFull = sys + (typeof glossary === "string" && glossary.trim() ? `

${glossary.slice(0, 6000)}` : "");

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        stream: wantStream,
        messages: [
          { role: "system", content: sysFull },
          { role: "user", content: transcript },
        ],
      }),
    });
    if (!r.ok) {
      const d = await r.json().catch(() => ({} as any));
      return NextResponse.json({ error: d.error?.message || "OpenAI error" }, { status: r.status });
    }

    // Streaming: parse OpenAI's SSE and forward just the text deltas as a plain
    // UTF-8 stream, so the client can append characters as they arrive.
    if (wantStream && r.body) {
      const upstream = r.body;
      const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          const reader = upstream.getReader();
          const decoder = new TextDecoder();
          const encoder = new TextEncoder();
          let buffer = "";
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });
              let nl: number;
              while ((nl = buffer.indexOf("\n")) >= 0) {
                const line = buffer.slice(0, nl).trim();
                buffer = buffer.slice(nl + 1);
                if (!line.startsWith("data:")) continue;
                const data = line.slice(5).trim();
                if (data === "[DONE]") { controller.close(); return; }
                try {
                  const j = JSON.parse(data);
                  const delta = j.choices?.[0]?.delta?.content;
                  if (delta) controller.enqueue(encoder.encode(delta));
                } catch {}
              }
            }
          } catch {}
          controller.close();
        },
      });
      return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache, no-transform", "X-Accel-Buffering": "no" },
      });
    }

    const d = await r.json().catch(() => ({}));
    const summary = d.choices?.[0]?.message?.content?.trim();
    if (!summary) return NextResponse.json({ error: "Empty summary" }, { status: 502 });
    return NextResponse.json({ summary });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "network" }, { status: 500 });
  }
}
