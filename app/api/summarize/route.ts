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
  const { lang = "English", system } = body;
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

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          { role: "system", content: sys },
          { role: "user", content: transcript },
        ],
      }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) return NextResponse.json({ error: d.error?.message || "OpenAI error" }, { status: r.status });
    const summary = d.choices?.[0]?.message?.content?.trim();
    if (!summary) return NextResponse.json({ error: "Empty summary" }, { status: 502 });
    return NextResponse.json({ summary });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "network" }, { status: 500 });
  }
}
