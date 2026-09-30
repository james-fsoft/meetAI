import type { Metadata } from "next";
import ConceptFrame from "../../ConceptFrame";

const LANGUAGES = { en: "/conference", vi: "/vi/conference", ko: "/ko/conference", "x-default": "/conference" };

export const metadata: Metadata = {
  title: '컨퍼런스·대형 행사',
  description: '행사장 전체를 위한 실시간 번역 자막: 발표 화면의 큰 자막, 슬라이드 위 자막 창, 그리고 청중이 휴대폰으로 볼 수 있는 QR 코드.',
  alternates: { canonical: '/ko/conference', languages: LANGUAGES },
  openGraph: { title: '컨퍼런스·대형 행사 — Flash Meet', description: '행사장 전체를 위한 실시간 번역 자막: 발표 화면의 큰 자막, 슬라이드 위 자막 창, 그리고 청중이 휴대폰으로 볼 수 있는 QR 코드.', url: "https://meet.transflash.app" + '/ko/conference', locale: 'ko_KR' },
};

export default function ConferenceKo() {
  return <ConceptFrame src='/concept-conference-ko.html' title='컨퍼런스·대형 행사 — Flash Meet' />;
}
