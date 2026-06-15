import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Plans",
  description:
    "Flash Meet pricing — start free, then Pro and Business plans for unlimited live meeting translation, AI summaries and minutes. Invite friends and earn free translation minutes.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Flash Meet Pricing — Live meeting translation & AI summaries",
    description:
      "Start free. Pro and Business plans for unlimited live meeting translation, bilingual subtitles and AI meeting summaries.",
    url: "https://meet.transflash.app/pricing",
  },
};

// Visible FAQ on this page → eligible for FAQ rich results in search.
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Which apps does Flash Meet work with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Flash Meet works with Google Meet, Zoom, Microsoft Teams and YouTube, plus any audio on your screen or microphone via the TransFlash Live Translate Chrome extension.",
      },
    },
    {
      "@type": "Question",
      name: "What languages can it translate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It supports live translation across many languages including Vietnamese, English, Korean, Japanese and Chinese, with bilingual subtitles during the meeting.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a free plan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can start free with daily and monthly translation minutes, then upgrade to Pro or Business for more minutes and full AI meeting intelligence.",
      },
    },
    {
      "@type": "Question",
      name: "Does it summarize meetings automatically?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Flash Meet writes an AI summary, action items, decisions and minutes automatically from the transcript, in the language you choose.",
      },
    },
  ],
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      {children}
    </>
  );
}
