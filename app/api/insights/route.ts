import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/insights { transcript }
 * Live "meeting intelligence" extraction during a session — summary, action
 * items, decisions and risks. Returns structured JSON for the AI panel.
 */
export async function POST(req: NextRequest) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return NextResponse.json({ summary: [], actionItems: [], decisions: [], risks: [] });

  const body = await req.json().catch(() => ({}));
  const tx = (body.transcript || "").trim();
  const summaryOnly = !!body.summaryOnly; // free plan → cheaper, summary only
  // Desired output language (e.g. "Vietnamese"). Empty → follow the transcript.
  const lang = typeof body.lang === "string" ? body.lang.trim() : "";
  if (tx.length < 60) return NextResponse.json({ summary: [], actionItems: [], decisions: [], risks: [] });

  // For bilingual meetings this forces a single, consistent output language.
  const langRule = lang
    ? `Write ALL values in ${lang}, even if the meeting is spoken in other or mixed languages. Translate into ${lang} as needed.`
    : `Write values in the transcript's main language.`;

  const sys = summaryOnly
    ? `You are an AI meeting assistant analysing a LIVE, possibly multilingual transcript labelled by speaker (Speaker 1, 2, …).
Reply ONLY as compact JSON: {"summary": string[]} — 2-4 very short bullet points of what is being discussed. ${langRule} Never invent anything. If nothing yet, use an empty array.`
    : `You are an AI meeting assistant analysing a LIVE, possibly multilingual transcript labelled by speaker (Speaker 1, 2, …).
Extract meeting intelligence so far. Reply ONLY as compact JSON with this exact shape:
{"summary": string[], "actionItems": [{"who": string, "task": string}], "decisions": string[], "risks": string[]}
Rules: summary = 2-4 very short bullet points of what is being discussed. actionItems = tasks someone must do (who = speaker label or name, task = short). decisions = concrete decisions made. risks = open issues / blockers / things to follow up.
Each item is ONE short line. ${langRule} Never invent anything not in the transcript. If a category has nothing yet, use an empty array.`;

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini", temperature: 0.2, response_format: { type: "json_object" },
        messages: [{ role: "system", content: sys }, { role: "user", content: tx.slice(-9000) }],
      }),
    });
    const d = await r.json();
    if (!r.ok) return NextResponse.json({ error: d.error?.message || "openai" }, { status: 502 });
    let out: any = {};
    try { out = JSON.parse(d.choices?.[0]?.message?.content || "{}"); } catch {}
    const arr = (x: any, n: number) => (Array.isArray(x) ? x.slice(0, n) : []);
    return NextResponse.json({
      summary: arr(out.summary, 5),
      actionItems: arr(out.actionItems, 8).filter((a: any) => a && a.task),
      decisions: arr(out.decisions, 6),
      risks: arr(out.risks, 6),
    });
  } catch {
    return NextResponse.json({ error: "network" }, { status: 500 });
  }
}
