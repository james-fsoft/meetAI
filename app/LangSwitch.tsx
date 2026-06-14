"use client";

import type { Lang } from "@/lib/use-lang";

const LABEL: Record<Lang, string> = { en: "EN", vi: "VI", ko: "KO" };
const ORDER: Lang[] = ["en", "vi", "ko"];

/** Small EN/VI/KO pill switcher for standalone pages. */
export default function LangSwitch({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div style={wrap}>
      {ORDER.map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          style={{ ...btn, ...(l === lang ? on : {}) }}
        >{LABEL[l]}</button>
      ))}
    </div>
  );
}

const wrap: React.CSSProperties = {
  display: "inline-flex", gap: 2, background: "#eef1f7", border: "1px solid #e3e8f2",
  borderRadius: 20, padding: 3,
};
const btn: React.CSSProperties = {
  border: "none", background: "transparent", cursor: "pointer", fontFamily: "'Inter',system-ui,sans-serif",
  fontSize: 11.5, fontWeight: 800, color: "#7b88a3", padding: "5px 11px", borderRadius: 16, transition: ".12s",
};
const on: React.CSSProperties = {
  background: "#fff", color: "#0a1124", boxShadow: "0 2px 6px -2px rgba(10,17,36,.25)",
};
