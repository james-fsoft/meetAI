import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/translate
 * Body: { to: string, src: string, context?: string, fast?: boolean, glossary?: string }
 * glossary → the caller's personal dictionary (see lib/glossary.ts), so names keep their spelling.
 * fast → a lower-latency model for live, still-changing drafts (OPENAI_FAST_MODEL, default gpt-4o-mini).
 * Real-time interpreter for the live-translation feature.
 * Uses the server-side OPENAI_API_KEY. Returns: { translation: string }
 */
export async function POST(req: NextRequest) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return NextResponse.json({ error: "Server missing OPENAI_API_KEY" }, { status: 500 });

  const { to, src, context = "", fast = false, glossary = "" } = await req.json();
  if (!src) return NextResponse.json({ error: "Missing src" }, { status: 400 });

  const sys =
    `You are a professional real-time meeting interpreter. The source language may be anything — ` +
    `auto-detect it. Translate the speaker's line into natural, fluent ${to} as a human interpreter ` +
    `would — convey meaning, not word-for-word. Fix obvious speech-recognition errors from context. ` +
    `Keep it concise. Output ONLY the ${to} translation: no quotes, no notes, no original text.` +
    (typeof glossary === "string" && glossary.trim() ? `

${glossary.slice(0, 6000)}` : "");
  const user =
    (context ? `Recent context (for flow only, do NOT re-translate it):\n${context}\n\n` : "") +
    `Translate this line:\n${src}`;

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: fast ? (process.env.OPENAI_FAST_MODEL || "gpt-4o-mini") : "gpt-4o",
      temperature: 0.3,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
    }),
  });
  const d = await r.json();
  if (!r.ok) return NextResponse.json({ error: d.error?.message || "OpenAI error" }, { status: r.status });
  return NextResponse.json({ translation: d.choices[0].message.content.trim() });
}
