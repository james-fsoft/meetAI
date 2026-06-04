import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/summarize
 * Body: { transcript: string, lang?: string }
 * Uses the server-side OPENAI_API_KEY so the browser never sees it.
 *
 * Phase 3 will also enforce auth + usage limits here.
 */
export async function POST(req: NextRequest) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return NextResponse.json({ error: "Server missing OPENAI_API_KEY" }, { status: 500 });

  const { transcript, lang = "English", system } = await req.json();
  if (!transcript) return NextResponse.json({ error: "Missing transcript" }, { status: 400 });

  // The client sends a localized system prompt (Vietnamese / English / Korean).
  // Fall back to a default if none is provided.
  const sys =
    system ||
    `You are a professional meeting-minutes assistant. The transcript is labeled by speaker ` +
    `(Speaker 1, Speaker 2, …) — keep these exact labels. Write minutes in ${lang}, in Markdown ` +
    `with sections: ## Participants, ## Overview, ## Key points, ## Decisions, ## Action items, ## Open issues. ` +
    `Never invent anything not in the transcript.`;

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
  const d = await r.json();
  if (!r.ok) return NextResponse.json({ error: d.error?.message || "OpenAI error" }, { status: r.status });
  return NextResponse.json({ summary: d.choices[0].message.content.trim() });
}
