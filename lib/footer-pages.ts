import { PAGES_VI } from "./footer-pages-vi";
import { PAGES_EN } from "./footer-pages-en";
import { PAGES_KO } from "./footer-pages-ko";

export type Card = {
  title: string;
  text: string;
  href?: string;
  cta?: string;
  badge?: string;
};

export type Section = {
  title: string;
  intro?: string;
  cards?: Card[];
  bullets?: string[];
};

export type PageDef = {
  eyebrow: string;
  title: string;
  lead: string;
  actions?: { label: string; href: string; primary?: boolean }[];
  sections: Section[];
  note?: string;
};

export type FpLang = "vi" | "en" | "ko";
export const FP_LANGS: FpLang[] = ["vi", "en", "ko"];

const PAGES: Record<FpLang, Record<string, PageDef>> = {
  vi: PAGES_VI,
  en: PAGES_EN,
  ko: PAGES_KO,
};

/** Older or shorter spellings that should land on the same page. */
export const ALIASES: Record<string, string> = {
  "use-case": "use-cases",
  applications: "apps",
  application: "apps",
  help: "guide",
  documentation: "docs",
  video: "videos",
  "about-us": "about",
  career: "careers",
};

/** The pages that exist in all three languages, so their links can be prefixed. */
export const FP_SLUGS = [
  "features",
  "use-cases",
  "apps",
  "roadmap",
  "guide",
  "faq",
  "docs",
  "videos",
  "about",
  "careers",
  "contact",
] as const;

/** Vietnamese lives at /faq, the others at /en/faq and /ko/faq. */
export function fpPath(lang: FpLang, slug: string): string {
  return lang === "vi" ? "/" + slug : "/" + lang + "/" + slug;
}

/**
 * Keep a link inside the reader's language. Only the footer pages have
 * translated copies; /pricing, /privacy and the app carry their own switcher,
 * so they are left exactly as written.
 */
export function localHref(lang: FpLang, href: string): string {
  if (lang === "vi" || !href.startsWith("/")) return href;
  const slug = href.slice(1).split(/[?#]/)[0];
  return (FP_SLUGS as readonly string[]).includes(slug) ? fpPath(lang, slug) : href;
}

export function resolveSlug(slug: string): string {
  return ALIASES[slug] || slug;
}

export function getPage(lang: FpLang, slug: string): PageDef | null {
  const key = resolveSlug(slug);
  return PAGES[lang][key] || null;
}

type Col = readonly (readonly [string, string])[];

/** The footer's own three columns, in each language. */
export const FOOTER: Record<FpLang, { product: Col; resources: Col; company: Col }> = {
  vi: {
    product: [
      ["Tính năng", "/features"],
      ["Use case", "/use-cases"],
      ["Bảng giá", "/pricing"],
      ["Ứng dụng", "/apps"],
      ["Lộ trình phát triển", "/roadmap"],
    ],
    resources: [
      ["Blog", "/blog"],
      ["Hướng dẫn sử dụng", "/guide"],
      ["Câu hỏi thường gặp", "/faq"],
      ["Tài liệu", "/docs"],
      ["Video", "/videos"],
    ],
    company: [
      ["Về chúng tôi", "/about"],
      ["Tuyển dụng", "/careers"],
      ["Liên hệ", "/contact"],
      ["Chính sách bảo mật", "/privacy"],
      ["Điều khoản sử dụng", "/terms"],
    ],
  },
  en: {
    product: [
      ["Features", "/features"],
      ["Use cases", "/use-cases"],
      ["Pricing", "/pricing"],
      ["Apps", "/apps"],
      ["Roadmap", "/roadmap"],
    ],
    resources: [
      ["Blog", "/blog"],
      ["User guide", "/guide"],
      ["FAQ", "/faq"],
      ["Docs", "/docs"],
      ["Video", "/videos"],
    ],
    company: [
      ["About us", "/about"],
      ["Careers", "/careers"],
      ["Contact", "/contact"],
      ["Privacy policy", "/privacy"],
      ["Terms of use", "/terms"],
    ],
  },
  ko: {
    product: [
      ["기능", "/features"],
      ["활용 사례", "/use-cases"],
      ["요금제", "/pricing"],
      ["앱", "/apps"],
      ["로드맵", "/roadmap"],
    ],
    resources: [
      ["블로그", "/blog"],
      ["사용 가이드", "/guide"],
      ["자주 묻는 질문", "/faq"],
      ["문서", "/docs"],
      ["영상", "/videos"],
    ],
    company: [
      ["회사 소개", "/about"],
      ["채용", "/careers"],
      ["문의", "/contact"],
      ["개인정보 처리방침", "/privacy"],
      ["이용약관", "/terms"],
    ],
  },
};

/** Everything around the content: header, footer and the closing call to action. */
export const FP_UI: Record<
  FpLang,
  {
    htmlLang: string;
    navAria: string;
    nav: readonly (readonly [string, string])[];
    openApp: string;
    tagline: string;
    socialAria: string;
    copyright: string;
    colProduct: string;
    colResources: string;
    colCompany: string;
    newsTitle: string;
    newsPlaceholder: string;
    newsBtnAria: string;
    newsConsent: string;
    langAria: string;
    learnMore: string;
    ctaKicker: string;
    ctaTitle: string;
    ctaText: string;
    ctaPrimary: string;
    ctaSecondary: string;
    homeAria: string;
  }
> = {
  vi: {
    htmlLang: "vi",
    navAria: "Điều hướng",
    nav: [
      ["Tính năng", "/features"],
      ["Use case", "/use-cases"],
      ["Bảng giá", "/pricing"],
      ["Tài liệu", "/docs"],
    ],
    openApp: "Mở ứng dụng",
    tagline: "Hiểu nhau, gần nhau hơn.",
    socialAria: "Mạng xã hội",
    copyright: "© 2026 Flash Meet. All rights reserved.",
    colProduct: "Sản phẩm",
    colResources: "Tài nguyên",
    colCompany: "Công ty",
    newsTitle: "Nhận tin tức mới nhất",
    newsPlaceholder: "Nhập email của bạn",
    newsBtnAria: "Đăng ký nhận tin",
    newsConsent: "Tôi đồng ý nhận thông tin từ Flash Meet.",
    langAria: "Ngôn ngữ",
    learnMore: "Tìm hiểu thêm",
    ctaKicker: "FLASH MEET",
    ctaTitle: "Sẵn sàng để thử trong một cuộc họp thật?",
    ctaText:
      "Mở Flash Meet ngay trên trình duyệt hoặc xem hướng dẫn nếu bạn muốn bắt đầu từng bước.",
    ctaPrimary: "Mở Flash Meet →",
    ctaSecondary: "Hướng dẫn sử dụng",
    homeAria: "Trang chủ Flash Meet",
  },
  en: {
    htmlLang: "en",
    navAria: "Navigation",
    nav: [
      ["Features", "/features"],
      ["Use cases", "/use-cases"],
      ["Pricing", "/pricing"],
      ["Docs", "/docs"],
    ],
    openApp: "Open the app",
    tagline: "Understand each other. Get closer.",
    socialAria: "Social",
    copyright: "© 2026 Flash Meet. All rights reserved.",
    colProduct: "Product",
    colResources: "Resources",
    colCompany: "Company",
    newsTitle: "Get the latest news",
    newsPlaceholder: "Enter your email",
    newsBtnAria: "Subscribe",
    newsConsent: "I agree to receive updates from Flash Meet.",
    langAria: "Language",
    learnMore: "Learn more",
    ctaKicker: "FLASH MEET",
    ctaTitle: "Ready to try it in a real meeting?",
    ctaText:
      "Open Flash Meet in your browser, or read the guide if you would rather take it step by step.",
    ctaPrimary: "Open Flash Meet →",
    ctaSecondary: "User guide",
    homeAria: "Flash Meet home",
  },
  ko: {
    htmlLang: "ko",
    navAria: "탐색",
    nav: [
      ["기능", "/features"],
      ["활용 사례", "/use-cases"],
      ["요금제", "/pricing"],
      ["문서", "/docs"],
    ],
    openApp: "앱 열기",
    tagline: "서로 이해하고, 더 가까워지세요.",
    socialAria: "소셜",
    copyright: "© 2026 Flash Meet. All rights reserved.",
    colProduct: "제품",
    colResources: "리소스",
    colCompany: "회사",
    newsTitle: "최신 소식 받기",
    newsPlaceholder: "이메일을 입력하세요",
    newsBtnAria: "구독",
    newsConsent: "Flash Meet 소식 수신에 동의합니다.",
    langAria: "언어",
    learnMore: "자세히 보기",
    ctaKicker: "FLASH MEET",
    ctaTitle: "실제 회의에서 바로 써 보시겠어요?",
    ctaText:
      "브라우저에서 Flash Meet을 열어 보세요. 단계별로 보고 싶다면 가이드를 읽어도 됩니다.",
    ctaPrimary: "Flash Meet 열기 →",
    ctaSecondary: "사용 가이드",
    homeAria: "Flash Meet 홈",
  },
};

export const LANG_LABEL: Record<FpLang, string> = {
  vi: "Tiếng Việt",
  en: "English",
  ko: "한국어",
};
