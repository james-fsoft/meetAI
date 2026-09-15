/**
 * Personal dictionary (glossary) shared by the API routes, the dictionary page
 * and the live engines.
 *
 * What it is for: speech recognition mis-hears names ("SotaTek" → "sota tech")
 * and translation happily translates brand names. Soniox accepts a `context`
 * object with `terms` (words to expect) and `translation_terms` (how a term must
 * come out in the translation), so every entry here is turned into exactly that
 * and sent with the live stream. The same entries are given to the summary /
 * insights prompts so the minutes keep the right spelling.
 */

export type Kind = "person" | "company" | "product" | "term" | "acronym";
export const KINDS: Kind[] = ["person", "company", "product", "term", "acronym"];
export const LANGS = ["vi", "en", "ko", "ja", "zh"] as const;

export type Term = {
  client_id: string;
  term: string;
  kind: Kind;
  display: string;
  aliases: string[];
  langs: string[]; // [] = every language
  note: string;
  keep_original: boolean;
  active: boolean;
  updated_at?: string;
};

// Soniox: "Maximum 8,000 tokens (~10,000 characters)" for the whole context object.
const CONTEXT_CHARS = 9000;
const MAX_ENTRIES = 400;

const str = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");
const list = (v: unknown, max: number, each: number) =>
  Array.isArray(v) ? [...new Set(v.map((x) => str(x, each)).filter(Boolean))].slice(0, max) : [];

/** Validate + cap one entry coming from the browser. Returns null if unusable. */
export function cleanTerm(raw: any, userId: string) {
  if (!raw || typeof raw !== "object") return null;
  const term = str(raw.term, 120);
  if (!term) return null;
  const clientId = str(raw.client_id, 64) || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const kind = KINDS.includes(raw.kind) ? (raw.kind as Kind) : "term";
  return {
    user_id: userId,
    client_id: clientId,
    term,
    kind,
    display: str(raw.display, 120) || term,
    aliases: list(raw.aliases, 20, 120).filter((a) => a.toLowerCase() !== term.toLowerCase()),
    langs: list(raw.langs, 5, 5).filter((l) => (LANGS as readonly string[]).includes(l)),
    note: str(raw.note, 500),
    keep_original: raw.keep_original !== false,
    active: raw.active !== false,
    updated_at: new Date().toISOString(),
  };
}

export function rowToTerm(row: any): Term {
  return {
    client_id: String(row.client_id),
    term: row.term || "",
    kind: KINDS.includes(row.kind) ? row.kind : "term",
    display: row.display || row.term || "",
    aliases: Array.isArray(row.aliases) ? row.aliases : [],
    langs: Array.isArray(row.langs) ? row.langs : [],
    note: row.note || "",
    keep_original: row.keep_original !== false,
    active: row.active !== false,
    updated_at: row.updated_at || undefined,
  };
}

export const GLOSSARY_COLS = "client_id,term,kind,display,aliases,langs,note,keep_original,active,updated_at";

// Same shape of check as lib/meetings.ts: the table is created by hand in Supabase.
export function isMissingGlossary(err: { code?: string; message?: string } | null | undefined) {
  if (!err) return false;
  return err.code === "42P01" || err.code === "PGRST205" || /relation .*glossary.* does not exist/i.test(err.message || "");
}

/** Entries that apply to a caption/translation in `lang` (an entry with no language applies to all). */
export function termsFor(terms: Term[], lang?: string) {
  return terms.filter((t) => t.active && t.term && (!lang || !t.langs.length || t.langs.includes(lang)));
}

/**
 * Soniox `context` for the real-time websocket config:
 *   terms              — spellings the model should expect
 *   translation_terms  — how a term must appear in the translation
 * Kept under the documented ~10k character budget.
 */
export function buildContext(terms: Term[], lang?: string) {
  const use = termsFor(terms, lang).slice(0, MAX_ENTRIES);
  const words: string[] = [];
  const pairs: { source: string; target: string }[] = [];
  for (const t of use) {
    const display = t.display || t.term;
    for (const w of [display, t.term, ...t.aliases]) if (w && !words.includes(w)) words.push(w);
    // every variant should read as the preferred spelling; keep_original also pins it across languages
    for (const a of t.aliases) if (a !== display) pairs.push({ source: a, target: display });
    if (t.keep_original && t.term !== display) pairs.push({ source: t.term, target: display });
    else if (t.keep_original) pairs.push({ source: display, target: display });
  }
  const ctx: { terms?: string[]; translation_terms?: { source: string; target: string }[] } = {};
  if (words.length) ctx.terms = words;
  if (pairs.length) ctx.translation_terms = pairs;
  // trim from the end until it fits the budget
  while (JSON.stringify(ctx).length > CONTEXT_CHARS && (ctx.translation_terms?.length || ctx.terms?.length)) {
    if (ctx.translation_terms?.length) ctx.translation_terms.pop();
    else ctx.terms?.pop();
  }
  return ctx.terms?.length || ctx.translation_terms?.length ? ctx : null;
}

/** Wording for the GPT prompts (summary, insights, translation). */
export function glossaryPrompt(terms: Term[], lang?: string) {
  const use = termsFor(terms, lang).slice(0, MAX_ENTRIES);
  if (!use.length) return "";
  const spell = use.map((t) => (t.display || t.term) + (t.aliases.length ? ` (also heard as: ${t.aliases.join(", ")})` : ""));
  const keep = use.filter((t) => t.keep_original).map((t) => t.display || t.term);
  let out = `Names and terms from the user's dictionary — always write them exactly like this:\n${spell.join("\n")}`;
  if (keep.length) out += `\nNever translate or re-spell these: ${keep.join(", ")}.`;
  return out.slice(0, CONTEXT_CHARS);
}
