"use client";

import { useLang, type Lang } from "@/lib/use-lang";
import LangSwitch from "../LangSwitch";

const STORE_URL = "https://chromewebstore.google.com/detail/fnaffendjnopgpfehgoocdegbffakofl";

const T: Record<Lang, any> = {
  en: {
    back: "← Back to app", badge: "Browser Extension",
    h1: "Translate any meeting, right in your browser",
    sub: "Add Flash Meet to your browser for live translated subtitles on Google Meet, Zoom, Teams and YouTube — with automatic speaker separation and AI summaries.",
    add: "Get it free", works: "Works with", browsers: "Available for Chrome, Edge, Brave, Opera & Arc",
    installTitle: "Install in 30 seconds",
    install: [
      { t: "Get the extension", d: "Open the store and click “Add”, then confirm. Works on Chrome, Edge, Brave and other Chromium browsers." },
      { t: "Pin it", d: "Click the puzzle ⧉ icon in the toolbar and pin Flash Meet." },
      { t: "Sign in", d: "Open the popup and sign in with Google for more minutes." },
    ],
    useTitle: "How to use",
    use: [
      { t: "Open a meeting or video", d: "Go to Google Meet, Zoom, Teams or any YouTube video." },
      { t: "Choose language & mode", d: "Pick your target language — one-way or two-way (bilingual)." },
      { t: "Click Start", d: "Live subtitles appear in a movable, resizable overlay." },
      { t: "Stop & summarize", d: "Get an AI summary and download the full transcript." },
    ],
    note: "Tip: sign in to unlock more translation minutes and keep your plan in sync.",
  },
  vi: {
    back: "← Quay lại app", badge: "Tiện ích trình duyệt",
    h1: "Dịch mọi cuộc họp, ngay trên trình duyệt",
    sub: "Thêm Flash Meet vào trình duyệt để có phụ đề dịch trực tiếp trên Google Meet, Zoom, Teams và YouTube — tự tách giọng từng người và tóm tắt bằng AI.",
    add: "Cài miễn phí", works: "Hoạt động với", browsers: "Dùng được trên Chrome, Edge, Brave, Opera & Arc",
    installTitle: "Cài trong 30 giây",
    install: [
      { t: "Cài tiện ích", d: "Mở store, bấm “Thêm” rồi xác nhận. Dùng được trên Chrome, Edge, Brave và các trình duyệt Chromium khác." },
      { t: "Ghim tiện ích", d: "Bấm biểu tượng mảnh ghép ⧉ trên thanh công cụ rồi ghim Flash Meet." },
      { t: "Đăng nhập", d: "Mở popup và đăng nhập Google để có thêm phút dịch." },
    ],
    useTitle: "Cách sử dụng",
    use: [
      { t: "Mở cuộc họp hoặc video", d: "Vào Google Meet, Zoom, Teams hoặc bất kỳ video YouTube nào." },
      { t: "Chọn ngôn ngữ & chế độ", d: "Chọn ngôn ngữ đích — 1 chiều hoặc song ngữ." },
      { t: "Bấm Bắt đầu", d: "Phụ đề trực tiếp hiện trong khung kéo & chỉnh kích thước được." },
      { t: "Dừng & tóm tắt", d: "Nhận bản tóm tắt AI và tải toàn bộ transcript." },
    ],
    note: "Mẹo: đăng nhập để mở khoá thêm phút dịch và đồng bộ gói của bạn.",
  },
  ko: {
    back: "← 앱으로", badge: "브라우저 확장 프로그램",
    h1: "브라우저에서 바로 모든 회의를 번역하세요",
    sub: "Flash Meet을 브라우저에 추가하면 Google Meet·Zoom·Teams·YouTube에서 실시간 번역 자막을 — 자동 화자 분리와 AI 요약과 함께 — 받을 수 있습니다.",
    add: "무료 설치", works: "지원", browsers: "Chrome, Edge, Brave, Opera, Arc 지원",
    installTitle: "30초 설치",
    install: [
      { t: "확장 프로그램 설치", d: "스토어에서 “추가”를 클릭하고 확인하세요. Chrome·Edge·Brave 등 Chromium 브라우저에서 작동합니다." },
      { t: "고정하기", d: "툴바의 퍼즐 ⧉ 아이콘을 클릭해 Flash Meet을 고정하세요." },
      { t: "로그인", d: "팝업을 열고 Google로 로그인하면 더 많은 분을 받습니다." },
    ],
    useTitle: "사용 방법",
    use: [
      { t: "회의·영상 열기", d: "Google Meet, Zoom, Teams 또는 YouTube 영상을 엽니다." },
      { t: "언어 & 모드 선택", d: "대상 언어를 선택 — 단방향 또는 양방향." },
      { t: "시작 클릭", d: "실시간 자막이 이동·크기 조절 가능한 오버레이로 표시됩니다." },
      { t: "중지 & 요약", d: "AI 요약을 받고 전체 기록을 다운로드하세요." },
    ],
    note: "팁: 로그인하면 더 많은 번역 분이 열리고 요금제가 동기화됩니다.",
  },
};

export default function ExtensionGuide() {
  const [lang, setLang] = useLang();
  const t = T[lang];

  return (
    <main style={S.wrap}>
      <style>{CSS}</style>
      <div style={S.top}>
        <a href="/" style={S.back}>{t.back}</a>
        <LangSwitch lang={lang} onChange={setLang} />
      </div>

      <section style={S.hero}>
        <div style={S.logo}>
          <svg width="56" height="56" viewBox="0 0 100 100" aria-hidden="true">
            <path d="M22 8 H78 a16 16 0 0 1 16 16 V60 a16 16 0 0 1 -16 16 H50 l-20 18 v-18 H22 a16 16 0 0 1 -16 -16 V24 A16 16 0 0 1 22 8 Z" fill="#1f6bff" />
            <g fill="#fff"><rect x="26" y="38" width="7.5" height="12" rx="3.75" /><rect x="39" y="29" width="7.5" height="30" rx="3.75" /><rect x="52" y="22" width="7.5" height="44" rx="3.75" /><rect x="65" y="32" width="7.5" height="24" rx="3.75" /></g>
          </svg>
        </div>
        <span style={S.badge}>{t.badge}</span>
        <h1 style={S.h1}>{t.h1}</h1>
        <p style={S.sub}>{t.sub}</p>
        <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className="ext-cta">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4a2 2 0 0 0-2 2v3.8h1.4a2.3 2.3 0 0 1 0 4.4H2V19a2 2 0 0 0 2 2h3.8v-1.4a2.3 2.3 0 0 1 4.4 0V21H17a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5z" /></svg>
          {t.add}
        </a>
        <div style={S.works}>{t.works}: <b>Google Meet · Zoom · Teams · YouTube</b></div>
        <div style={S.browsers}>🧩 {t.browsers}</div>
      </section>

      <Steps title={t.installTitle} items={t.install} />
      <Steps title={t.useTitle} items={t.use} />

      <p style={S.note}>{t.note}</p>
    </main>
  );
}

function Steps({ title, items }: { title: string; items: { t: string; d: string }[] }) {
  return (
    <section style={S.stepsWrap}>
      <h2 style={S.stepsTitle}>{title}</h2>
      <div className="ext-steps">
        {items.map((s, i) => (
          <div key={i} className="ext-card">
            <div className="ext-num">{i + 1}</div>
            <div className="ext-t">{s.t}</div>
            <div className="ext-d">{s.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

const CSS = `
.ext-cta{display:inline-flex;align-items:center;gap:10px;height:54px;padding:0 28px;border-radius:14px;
  background:linear-gradient(135deg,#2563eb,#3b82f6);color:#fff;font-family:'Inter',system-ui,sans-serif;font-size:16px;font-weight:800;
  text-decoration:none;box-shadow:0 8px 22px rgba(37,99,235,.32);transition:.18s;margin-top:6px}
.ext-cta:hover{transform:translateY(-2px);box-shadow:0 14px 34px rgba(37,99,235,.48)}
.ext-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}
.ext-card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:22px 20px;transition:.18s}
.ext-card:hover{transform:translateY(-3px);box-shadow:0 16px 32px -22px rgba(15,23,42,.32);border-color:#cdd9ec}
.ext-num{width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,#2563eb,#3b82f6);color:#fff;font-size:14px;font-weight:800;display:grid;place-items:center;margin-bottom:13px;box-shadow:0 4px 12px rgba(37,99,235,.3)}
.ext-t{font-size:15px;font-weight:700;color:#0f172a;letter-spacing:-.01em}
.ext-d{font-size:13px;line-height:1.55;color:#64748b;margin-top:5px}
`;

const FONT = "'Inter',system-ui,-apple-system,sans-serif";
const S: Record<string, React.CSSProperties> = {
  wrap: { minHeight: "100vh", padding: "24px 20px 70px", fontFamily: FONT, color: "#0a1124",
    background: "radial-gradient(1100px 560px at 50% -12%,rgba(31,107,255,.10),transparent 62%),#fbfcfe" },
  top: { display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1000, margin: "0 auto" },
  back: { fontSize: 13, fontWeight: 700, color: "#5b6b8c", textDecoration: "none" },
  hero: { textAlign: "center", maxWidth: 680, margin: "14px auto 0" },
  logo: { display: "flex", justifyContent: "center", marginBottom: 16 },
  badge: { display: "inline-block", fontSize: 12, fontWeight: 700, color: "#1f6bff", background: "#eff6ff", border: "1px solid #d9e6ff", borderRadius: 30, padding: "5px 13px" },
  h1: { fontSize: 38, fontWeight: 900, letterSpacing: "-.04em", lineHeight: 1.08, margin: "16px 0 0" },
  sub: { fontSize: 15.5, color: "#5b6b8c", lineHeight: 1.6, margin: "14px auto 22px", maxWidth: 600, fontWeight: 500 },
  works: { fontSize: 13, color: "#7b88a3", marginTop: 18, fontWeight: 500 },
  browsers: { fontSize: 12.5, color: "#9aa6bd", marginTop: 7, fontWeight: 600 },
  stepsWrap: { maxWidth: 1000, margin: "48px auto 0" },
  stepsTitle: { fontSize: 22, fontWeight: 800, letterSpacing: "-.02em", textAlign: "center", marginBottom: 22 },
  note: { maxWidth: 680, margin: "40px auto 0", textAlign: "center", fontSize: 13.5, fontWeight: 600, color: "#5b6b8c",
    background: "#fff", border: "1px solid #e7ebf3", borderRadius: 12, padding: "13px 18px", lineHeight: 1.55 },
};
