// Server-rendered, crawlable marketing content in EN / VI / KO. Shared by the
// home page (English) and the localized landing pages (/vi, /ko) so each
// language has real indexable text and internal links.
import OpenAppButton from "./OpenAppButton";

export type LandingLang = "en" | "vi" | "ko";

type Dict = {
  h1: string; lead: string;
  ctaApp: string; ctaPrice: string; ctaExt: string;
  featTitle: string; features: { h: string; p: string }[];
  platTitle: string; platLead: string; platLink: string; platSuffix: string;
  faqTitle: string; faq: { q: string; a: string }[];
  by: string; navBlog: string; navPrivacy: string; navTerms: string;
};

const DICT: Record<LandingLang, Dict> = {
  en: {
    h1: "Live meeting translation & AI summaries",
    lead: "Flash Meet translates your meetings in real time with bilingual subtitles and writes the AI summary, action items and minutes automatically. It works with Google Meet, Zoom, Microsoft Teams and YouTube — in Vietnamese, English, Korean and more.",
    ctaApp: "Open the app", ctaPrice: "See pricing", ctaExt: "Get the Chrome extension",
    featTitle: "Everything you need to understand every meeting",
    features: [
      { h: "Live meeting translation", p: "Real-time bilingual subtitles while you meet — everyone reads along in their own language." },
      { h: "AI summary & minutes", p: "Automatic summary, action items, decisions and risks the moment the meeting ends." },
      { h: "Speaker separation", p: "Every speaker is detected and labelled, so you always know who said what." },
      { h: "Works where you meet", p: "Google Meet, Zoom, Microsoft Teams, YouTube — or in person with the Chrome extension." },
    ],
    platTitle: "Translate the tools you already use",
    platLead: "Flash Meet adds live translation and AI notes to Google Meet, Zoom, Microsoft Teams and YouTube — plus in-person conversations through the",
    platLink: "TransFlash Live Translate Chrome extension", platSuffix: ".",
    faqTitle: "Frequently asked questions",
    faq: [
      { q: "How do I translate a Zoom or Google Meet call in real time?", a: "Open Flash Meet or add the TransFlash Live Translate Chrome extension, start translating, and bilingual subtitles appear live during your Google Meet, Zoom or Microsoft Teams call." },
      { q: "What languages does Flash Meet support?", a: "Live translation across many languages including Vietnamese, English, Korean, Japanese and Chinese, with bilingual subtitles and AI summaries in the language you choose." },
      { q: "Does it summarize the meeting automatically?", a: "Yes. Flash Meet writes an AI summary, action items, decisions and minutes automatically from the transcript — no manual note-taking." },
      { q: "Is there a free version?", a: "Yes, you can start free. Pro and Business plans add more translation minutes and full AI meeting intelligence." },
    ],
    by: "Flash Meet is a TransFlash solution.", navBlog: "Blog", navPrivacy: "Privacy", navTerms: "Terms",
  },
  vi: {
    h1: "Dịch cuộc họp trực tiếp & tóm tắt AI",
    lead: "Flash Meet dịch cuộc họp của bạn theo thời gian thực với phụ đề song ngữ và tự động viết tóm tắt, việc cần làm, biên bản bằng AI. Hoạt động với Google Meet, Zoom, Microsoft Teams và YouTube — tiếng Việt, Anh, Hàn và nhiều hơn nữa.",
    ctaApp: "Mở ứng dụng", ctaPrice: "Xem bảng giá", ctaExt: "Cài tiện ích Chrome",
    featTitle: "Tất cả để bạn hiểu trọn mọi cuộc họp",
    features: [
      { h: "Dịch cuộc họp trực tiếp", p: "Phụ đề song ngữ ngay khi đang họp — ai cũng đọc được bằng ngôn ngữ của mình." },
      { h: "Tóm tắt & biên bản AI", p: "Tự động tóm tắt, việc cần làm, quyết định và rủi ro ngay khi họp xong." },
      { h: "Tách giọng người nói", p: "Tự nhận diện và gắn nhãn từng người — luôn biết ai nói gì." },
      { h: "Họp ở đâu cũng dùng được", p: "Google Meet, Zoom, Microsoft Teams, YouTube — hoặc gặp trực tiếp qua tiện ích Chrome." },
    ],
    platTitle: "Dịch ngay trên công cụ bạn đang dùng",
    platLead: "Flash Meet thêm dịch trực tiếp và ghi chú AI vào Google Meet, Zoom, Microsoft Teams và YouTube — và cả các cuộc trò chuyện trực tiếp qua",
    platLink: "tiện ích Chrome TransFlash Live Translate", platSuffix: ".",
    faqTitle: "Câu hỏi thường gặp",
    faq: [
      { q: "Làm sao dịch cuộc họp Zoom hay Google Meet theo thời gian thực?", a: "Mở Flash Meet hoặc cài tiện ích Chrome TransFlash Live Translate, bấm bắt đầu, phụ đề song ngữ sẽ hiện trực tiếp trong cuộc gọi Google Meet, Zoom hay Microsoft Teams." },
      { q: "Flash Meet hỗ trợ những ngôn ngữ nào?", a: "Dịch trực tiếp nhiều ngôn ngữ gồm Việt, Anh, Hàn, Nhật, Trung — phụ đề song ngữ và tóm tắt AI theo ngôn ngữ bạn chọn." },
      { q: "Có tự động tóm tắt cuộc họp không?", a: "Có. Flash Meet tự viết tóm tắt, việc cần làm, quyết định và biên bản từ bản ghi — không cần ghi chú thủ công." },
      { q: "Có bản miễn phí không?", a: "Có, bạn dùng thử miễn phí. Gói Pro và Business cho thêm phút dịch và đầy đủ tính năng AI." },
    ],
    by: "Flash Meet là một giải pháp của TransFlash.", navBlog: "Blog", navPrivacy: "Bảo mật", navTerms: "Điều khoản",
  },
  ko: {
    h1: "실시간 회의 번역 & AI 요약",
    lead: "Flash Meet은 이중 언어 자막으로 회의를 실시간 번역하고 AI 요약·액션 아이템·회의록을 자동 작성합니다. Google Meet, Zoom, Microsoft Teams, YouTube에서 작동하며 베트남어·영어·한국어 등을 지원합니다.",
    ctaApp: "앱 열기", ctaPrice: "요금제 보기", ctaExt: "Chrome 확장 설치",
    featTitle: "모든 회의를 이해하는 데 필요한 모든 것",
    features: [
      { h: "실시간 회의 번역", p: "회의 중 이중 언어 자막 — 모두가 자기 언어로 읽을 수 있습니다." },
      { h: "AI 요약 & 회의록", p: "회의가 끝나는 즉시 요약, 액션 아이템, 결정, 리스크를 자동 작성." },
      { h: "화자 분리", p: "화자를 자동으로 감지하고 라벨링 — 누가 무엇을 말했는지 항상 명확." },
      { h: "어디서 회의하든", p: "Google Meet, Zoom, Microsoft Teams, YouTube — 또는 Chrome 확장으로 대면 회의까지." },
    ],
    platTitle: "이미 쓰는 도구에서 바로 번역",
    platLead: "Flash Meet은 Google Meet, Zoom, Microsoft Teams, YouTube에 실시간 번역과 AI 노트를 더하고, 대면 대화는",
    platLink: "TransFlash Live Translate Chrome 확장", platSuffix: "으로 지원합니다.",
    faqTitle: "자주 묻는 질문",
    faq: [
      { q: "Zoom이나 Google Meet 통화를 실시간으로 어떻게 번역하나요?", a: "Flash Meet을 열거나 TransFlash Live Translate Chrome 확장을 설치하고 시작하면, Google Meet·Zoom·Microsoft Teams 통화 중 이중 언어 자막이 실시간으로 표시됩니다." },
      { q: "어떤 언어를 지원하나요?", a: "베트남어, 영어, 한국어, 일본어, 중국어 등 다양한 언어를 실시간 번역하며, 선택한 언어로 이중 자막과 AI 요약을 제공합니다." },
      { q: "회의를 자동으로 요약하나요?", a: "네. Flash Meet이 전사 내용을 바탕으로 요약, 액션 아이템, 결정, 회의록을 자동 작성합니다 — 수기 메모 불필요." },
      { q: "무료 버전이 있나요?", a: "네, 무료로 시작할 수 있습니다. Pro와 Business 요금제는 번역 시간과 전체 AI 기능을 추가합니다." },
    ],
    by: "Flash Meet은 TransFlash 솔루션입니다.", navBlog: "블로그", navPrivacy: "개인정보", navTerms: "이용약관",
  },
};

export function landingFaq(lang: LandingLang) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: DICT[lang].faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export default function LandingContent({ lang }: { lang: LandingLang }) {
  const d = DICT[lang];
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
