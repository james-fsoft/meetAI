// Landing copy in EN / VI / KO + the FAQ JSON-LD builder. Plain module (no
// "use client") so both server components (for SSR/JSON-LD) and the client
// LandingContent can import it.

export type LandingLang = "en" | "vi" | "ko";

export type LandingDict = {
  h1: string; lead: string;
  ctaApp: string; ctaPrice: string; ctaExt: string;
  featTitle: string; features: { h: string; p: string }[];
  platTitle: string; platLead: string; platLink: string; platSuffix: string;
  faqTitle: string; faq: { q: string; a: string }[];
  by: string; navBlog: string; navPrivacy: string; navTerms: string;
};

export const LANDING: Record<LandingLang, LandingDict> = {
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
    mainEntity: LANDING[lang].faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
