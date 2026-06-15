// Server-rendered, crawlable marketing content for logged-out visitors.
// The app's hero lives inside an iframe (not indexable), so this gives search
// engines real text + internal links to rank for high-intent queries.

const FEATURES = [
  { h: "Live meeting translation", p: "Real-time bilingual subtitles while you meet — everyone reads along in their own language." },
  { h: "AI summary & minutes", p: "Automatic summary, action items, decisions and risks the moment the meeting ends." },
  { h: "Speaker separation", p: "Every speaker is detected and labelled, so you always know who said what." },
  { h: "Works where you meet", p: "Google Meet, Zoom, Microsoft Teams, YouTube — or in person with the Chrome extension." },
];

const FAQ = [
  { q: "How do I translate a Zoom or Google Meet call in real time?", a: "Open Flash Meet (or add the TransFlash Live Translate Chrome extension), start translating, and bilingual subtitles appear live during your Google Meet, Zoom or Microsoft Teams call." },
  { q: "What languages does Flash Meet support?", a: "Live translation across many languages including Vietnamese, English, Korean, Japanese and Chinese, with bilingual subtitles and AI summaries in the language you choose." },
  { q: "Does it summarize the meeting automatically?", a: "Yes. Flash Meet writes an AI summary, action items, decisions and minutes automatically from the transcript — no manual note-taking." },
  { q: "Is there a free version?", a: "Yes, you can start free. Pro and Business plans add more translation minutes and full AI meeting intelligence." },
];

export default function SeoLanding() {
  return (
    <section style={S.wrap} aria-label="About Flash Meet">
      <div style={S.inner}>
        <h1 style={S.h1}>Live meeting translation &amp; AI summaries</h1>
        <p style={S.lead}>
          Flash Meet translates your meetings in real time with bilingual subtitles and writes the
          AI summary, action items and minutes automatically. It works with Google Meet, Zoom,
          Microsoft Teams and YouTube — in Vietnamese, English, Korean and more.
        </p>
        <div style={S.cta}>
          <a href="/pricing" style={S.btnPri}>See pricing</a>
          <a href="/extension" style={S.btnGhost}>Get the Chrome extension</a>
        </div>

        <h2 style={S.h2}>Everything you need to understand every meeting</h2>
        <div style={S.grid}>
          {FEATURES.map((f) => (
            <div key={f.h} style={S.card}>
              <h3 style={S.h3}>{f.h}</h3>
              <p style={S.p}>{f.p}</p>
            </div>
          ))}
        </div>

        <h2 style={S.h2}>Translate the tools you already use</h2>
        <p style={S.p}>
          Flash Meet adds live translation and AI notes to{" "}
          <strong>Google Meet</strong>, <strong>Zoom</strong>, <strong>Microsoft Teams</strong> and{" "}
          <strong>YouTube</strong>, plus in-person conversations through the{" "}
          <a href="/extension" style={S.link}>TransFlash Live Translate Chrome extension</a>.
        </p>

        <h2 style={S.h2}>Frequently asked questions</h2>
        <div style={S.faq}>
          {FAQ.map((f) => (
            <div key={f.q} style={S.faqItem}>
              <h3 style={S.faqQ}>{f.q}</h3>
              <p style={S.p}>{f.a}</p>
            </div>
          ))}
        </div>

        <p style={S.foot}>
          Flash Meet is a <a href="https://transflash.app" style={S.link}>TransFlash</a> solution.{" "}
          <a href="/pricing" style={S.link}>Start free</a> ·{" "}
          <a href="/privacy" style={S.link}>Privacy</a> ·{" "}
          <a href="/terms" style={S.link}>Terms</a>
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
  lead: { fontSize: 16.5, color: "#48566f", lineHeight: 1.6, maxWidth: 720, margin: "0 0 22px" },
  cta: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 44 },
  btnPri: { fontSize: 14, fontWeight: 800, color: "#fff", background: "#1f6bff", borderRadius: 11, padding: "12px 20px", textDecoration: "none" },
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
