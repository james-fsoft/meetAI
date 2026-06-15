// Top bar for the localized landing pages (/vi, /ko). Brand + language links
// (real <a> URLs so crawlers follow them) + an "open app" CTA.
import OpenAppButton from "./OpenAppButton";
import type { LandingLang } from "./LandingContent";

const APP_LABEL: Record<LandingLang, string> = { en: "Open app", vi: "Mở ứng dụng", ko: "앱 열기" };
const LANGS: { code: LandingLang; href: string; label: string }[] = [
  { code: "en", href: "/", label: "EN" },
  { code: "vi", href: "/vi", label: "VI" },
  { code: "ko", href: "/ko", label: "KO" },
];

export default function LandingHeader({ lang }: { lang: LandingLang }) {
  return (
    <header style={S.bar}>
      <a href={lang === "en" ? "/" : `/${lang}`} style={S.brand} aria-label="Flash Meet">
        <svg viewBox="0 0 100 100" width="24" height="24" style={{ display: "block" }} aria-hidden="true">
          <path d="M22 8 H78 a16 16 0 0 1 16 16 V60 a16 16 0 0 1 -16 16 H50 l-20 18 v-18 H22 a16 16 0 0 1 -16 -16 V24 A16 16 0 0 1 22 8 Z" fill="#1f6bff" />
          <g fill="#fff"><rect x="26" y="38" width="7.5" height="12" rx="3.75" /><rect x="39" y="29" width="7.5" height="30" rx="3.75" /><rect x="52" y="22" width="7.5" height="44" rx="3.75" /><rect x="65" y="32" width="7.5" height="24" rx="3.75" /></g>
        </svg>
        <span>Flash Meet</span>
      </a>
      <span style={{ flex: 1 }} />
      <nav style={S.langs} aria-label="Language">
        {LANGS.map((l) => (
          <a key={l.code} href={l.href} style={l.code === lang ? S.langOn : S.lang} hrefLang={l.code}>{l.label}</a>
        ))}
      </nav>
      <OpenAppButton lang={lang} label={APP_LABEL[lang]} style={S.cta} />
    </header>
  );
}

const FONT = "'Inter',system-ui,-apple-system,sans-serif";
const S: Record<string, React.CSSProperties> = {
  bar: { display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: "1px solid #e7ebf3", fontFamily: FONT, background: "#fff", position: "sticky", top: 0, zIndex: 10 },
  brand: { display: "flex", alignItems: "center", gap: 9, textDecoration: "none", color: "#0a1124", fontWeight: 900, fontSize: 16, letterSpacing: "-.03em" },
  langs: { display: "flex", border: "1.5px solid #0a1124", borderRadius: 9, overflow: "hidden" },
  lang: { fontSize: 12, fontWeight: 800, color: "#0a1124", textDecoration: "none", padding: "6px 10px", background: "#fff" },
  langOn: { fontSize: 12, fontWeight: 800, color: "#fff", textDecoration: "none", padding: "6px 10px", background: "#0a1124" },
  cta: { fontSize: 13.5, fontWeight: 800, color: "#fff", background: "#1f6bff", borderRadius: 10, padding: "9px 16px", textDecoration: "none" },
};
