import type { Metadata } from "next";
import "./globals.css";

const SITE = "https://meet.transflash.app";
const TITLE = "Flash Meet — Live Meeting Translation & AI Summaries";
const DESC =
  "Flash Meet translates your meetings live with bilingual subtitles and writes the AI summary, action items and minutes automatically. Works with Google Meet, Zoom, Microsoft Teams and YouTube — Vietnamese, English, Korean and more.";

// Multilingual, high-intent keywords (what people actually type when they need this).
const KEYWORDS = [
  // English
  "live meeting translation", "real-time meeting translator", "translate Zoom meeting",
  "translate Google Meet", "translate Microsoft Teams meeting", "bilingual subtitles meeting",
  "AI meeting summary", "AI meeting minutes", "meeting transcription translator",
  "live interpreter app", "speaker separation transcription", "real-time subtitles",
  // Tiếng Việt
  "dịch cuộc họp trực tiếp", "phiên dịch cuộc họp online", "dịch Zoom Google Meet real-time",
  "phụ đề song ngữ cuộc họp", "tóm tắt cuộc họp AI", "ghi biên bản cuộc họp tự động",
  "phần mềm dịch cuộc họp", "dịch trực tiếp cuộc họp tiếng Hàn",
  // 한국어
  "회의 실시간 번역", "줌 구글미트 통역", "회의 자막 번역", "AI 회의 요약", "회의록 자동 작성",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: TITLE, template: "%s — Flash Meet" },
  description: DESC,
  applicationName: "Flash Meet",
  keywords: KEYWORDS,
  authors: [{ name: "TransFlash", url: "https://transflash.app" }],
  creator: "TransFlash",
  publisher: "TransFlash",
  category: "productivity",
  icons: { icon: "/icon.svg" },
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: SITE,
    siteName: "Flash Meet",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Flash Meet — live meeting translation & AI summaries" }],
    locale: "en_US",
    alternateLocale: ["vi_VN", "ko_KR"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/og.png"],
  },
};

// Structured data so search engines understand the product (rich results eligible).
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#org`,
      name: "TransFlash",
      url: "https://transflash.app",
      logo: `${SITE}/email-logo.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "Flash Meet",
      description: DESC,
      publisher: { "@id": `${SITE}/#org` },
      inLanguage: ["en", "vi", "ko"],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE}/#app`,
      name: "Flash Meet",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, Chrome",
      url: SITE,
      description: DESC,
      inLanguage: ["en", "vi", "ko"],
      featureList: [
        "Live meeting translation with bilingual subtitles",
        "Automatic AI summary, action items and minutes",
        "Speaker separation",
        "Works with Google Meet, Zoom, Microsoft Teams and YouTube",
        "Chrome extension for in-meeting live translation",
      ],
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": `${SITE}/#org` },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
