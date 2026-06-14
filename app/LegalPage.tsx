"use client";

import { useLang } from "@/lib/use-lang";
import LangSwitch from "./LangSwitch";

export type Block = { p: string } | { ul: string[] };
export type Section = { h: string; blocks: Block[] };
export type LegalContent = {
  back: string; title: string; meta: string;
  intro?: string[];
  sections: Section[];
  footHref: string; footText: string;
};

/** Render **bold** spans inside legal text. */
function rich(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <b key={i}>{part.slice(2, -2)}</b>
      : <span key={i}>{part}</span>
  );
}

export default function LegalPage({ pick }: { pick: (lang: "en" | "vi" | "ko") => LegalContent }) {
  const [lang, setLang] = useLang();
  const c = pick(lang);

  return (
    <main style={S.wrap}>
      <div style={S.box}>
        <div style={S.topRow}>
          <a href="/" style={S.back}>{c.back}</a>
          <LangSwitch lang={lang} onChange={setLang} />
        </div>
        <h1 style={S.h1}>{c.title}</h1>
        <p style={S.meta}>{rich(c.meta)}</p>

        {c.intro?.map((p, i) => <p key={i} style={S.p}>{rich(p)}</p>)}

        {c.sections.map((s) => (
          <div key={s.h}>
            <h2 style={S.h2}>{s.h}</h2>
            {s.blocks.map((b, i) =>
              "p" in b
                ? <p key={i} style={S.p}>{rich(b.p)}</p>
                : <ul key={i} style={S.ul}>{b.ul.map((li, j) => <li key={j}>{rich(li)}</li>)}</ul>
            )}
          </div>
        ))}

        <p style={S.foot}><a href={c.footHref} style={S.link}>{c.footText}</a></p>
      </div>
    </main>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap: { minHeight: "100vh", background: "#f5f7fc", padding: "40px 20px 70px", fontFamily: "'Inter',system-ui,sans-serif", color: "#0a1124" },
  box: { maxWidth: 760, margin: "0 auto", background: "#fff", border: "1px solid #e3e8f2", borderRadius: 18, padding: "30px 40px 38px", boxShadow: "0 20px 50px -36px rgba(10,17,36,.4)" },
  topRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  back: { fontSize: 13, fontWeight: 700, color: "#5b6b8c", textDecoration: "none" },
  h1: { fontSize: 30, fontWeight: 900, letterSpacing: "-.03em", margin: "10px 0 6px" },
  meta: { fontSize: 13, color: "#9aa6bd", marginBottom: 22, lineHeight: 1.5 },
  h2: { fontSize: 17, fontWeight: 800, margin: "26px 0 8px" },
  p: { fontSize: 14.5, color: "#33405c", lineHeight: 1.7, margin: "0 0 8px" },
  ul: { fontSize: 14.5, color: "#33405c", lineHeight: 1.7, paddingLeft: 20, margin: "0 0 8px" },
  foot: { marginTop: 30, paddingTop: 18, borderTop: "1px solid #e3e8f2" },
  link: { color: "#1f6bff", fontWeight: 700, textDecoration: "none", fontSize: 14 },
};
