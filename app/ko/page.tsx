import type { Metadata } from "next";
import LandingHeader from "../LandingHeader";
import LandingContent from "../LandingContent";
import { landingFaq } from "@/lib/landing-data";

const LANGUAGES = { en: "/", vi: "/vi", ko: "/ko", "x-default": "/" };

export const metadata: Metadata = {
  title: "실시간 회의 번역 & AI 요약",
  description:
    "Flash Meet은 이중 언어 자막으로 회의를 실시간 번역하고 AI 요약·액션 아이템·회의록을 자동 작성합니다. Google Meet, Zoom, Microsoft Teams, YouTube에서 작동 — 베트남어·영어·한국어.",
  alternates: { canonical: "/ko", languages: LANGUAGES },
  openGraph: {
    title: "Flash Meet — 실시간 회의 번역 & AI 요약",
    description: "Google Meet, Zoom, Teams, YouTube를 위한 실시간 이중 자막 + AI 요약.",
    url: "https://meet.transflash.app/ko",
    locale: "ko_KR",
  },
};

export default function KoLanding() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingFaq("ko")) }} />
      <LandingHeader lang="ko" />
      <LandingContent lang="ko" />
    </>
  );
}
