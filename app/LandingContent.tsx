"use client";

// Crawlable marketing content in EN / VI / KO. Used by /vi and /ko (fixed lang,
// SSR'd) and by HomeLanding (follows the user's selected language). Client
// component so it can be driven by the shared mr_lang state on the home page.
import OpenAppButton from "./OpenAppButton";
import { LANDING, type LandingLang } from "@/lib/landing-data";

export type { LandingLang };
export { landingFaq } from "@/lib/landing-data";

export default function LandingContent({ lang }: { lang: LandingLang }) {
  const d = LANDING[lang];
  return (
    <section style={S.wrap} aria-label="Flash Meet">
      <div style={S.inner}>
        <h1 style={S.h1}>{d.h1}</h1>
        <p style={S.lead}>{d.lead}</p>
        <div style={S.cta}>
          <OpenAppButton lang={lang} label={d.ctaApp} style={S.btnPri} />
          <a href="/pricing" style={S.btnGhost}>{d.ctaPrice}</a>
          <a href="/extension" style={S.btnGhost}>{d.ctaExt}</a>
        </div>

        <h2 style={S.h2}>{d.featTitle}</h2>
        <div style={S.grid}>
          {d.features.map((f) => (
            <div key={f.h} style={S.card}>
              <h3 style={S.h3}>{f.h}</h3>
              <p style={S.p}>{f.p}</p>
            </div>
          ))}
        </div>

        <h2 style={S.h2}>{d.platTitle}</h2>
        <p style={S.p}>
          {d.platLead} <a href="/extension" style={S.link}>{d.platLink}</a>{d.platSuffix}
        </p>

        <h2 style={S.h2}>{d.faqTitle}</h2>
        <div style={S.faq}>
          {d.faq.map((f) => (
            <div key={f.q} style={S.faqItem}>
              <h3 style={S.faqQ}>{f.q}</h3>
              <p style={S.p}>{f.a}</p>
            </div>
          ))}
        </div>

        <p style={S.foot}>
          {d.by}{" "}
          <a href="/blog" style={S.link}>{d.navBlog}</a> ·{" "}
          <a href="/pricing" style={S.link}>{d.ctaPrice}</a> ·{" "}
          <a href="/privacy" style={S.link}>{d.navPrivacy}</a> ·{" "}
          <a href="/terms" style={S.link}>{d.navTerms}</a>
        </p>
      </div>
    </section>
  );
}

const FONT = "'Inter',system-ui,-apple-system,sans-serif";
const S: Record<string, React.CSSProperties> = {
  wrap: { background: "#fff", borderTop: "1px solid #e7ebf3", padding: "56px 20px 64px", fontFamily: FONT, color: "#0a1124" },
  inner: { maxWidth: 920, margin: "0 auto" },
  h1: { fontSize: 30, fontWeight: 900, letterSpacing: "-.03em", lineHeight: 1.15, margin: "0 0 12px" },
  lead: { fontSize: 16.5, color: "#48566f", lineHeight: 1.6, maxWidth: 740, margin: "0 0 22px" },
  cta: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 44 },
  btnPri: { fontSize: 14, fontWeight: 800, color: "#fff", background: "#1f6bff", borderRadius: 11, padding: "12px 20px", textDecoration: "none", cursor: "pointer", border: "none", fontFamily: FONT },
  btnGhost: { fontSize: 14, fontWeight: 800, color: "#0a1124", background: "#fff", border: "1.5px solid #e3e8f2", borderRadius: 11, padding: "12px 20px", textDecoration: "none" },
  h2: { fontSize: 21, fontWeight: 900, letterSpacing: "-.02em", margin: "40px 0 18px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 },
  card: { background: "#f8faff", border: "1px solid #e7ebf3", borderRadius: 16, padding: "18px 18px 16px" },
  h3: { fontSize: 15.5, fontWeight: 800, letterSpacing: "-.01em", margin: "0 0 6px" },
  p: { fontSize: 14.5, color: "#48566f", lineHeight: 1.6, margin: 0 },
  link: { color: "#1f6bff", fontWeight: 700, textDecoration: "none" },
  faq: { display: "grid", gap: 14 },
  faqItem: { borderBottom: "1px solid #eef1f7", paddingBottom: 14 },
  faqQ: { fontSize: 15.5, fontWeight: 800, margin: "0 0 6px" },
  foot: { fontSize: 13.5, color: "#7b88a3", marginTop: 40, lineHeight: 1.8 },
};
