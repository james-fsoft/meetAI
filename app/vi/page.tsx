import type { Metadata } from "next";
import LandingHeader from "../LandingHeader";
import LandingContent, { landingFaq } from "../LandingContent";

const LANGUAGES = { en: "/", vi: "/vi", ko: "/ko", "x-default": "/" };

export const metadata: Metadata = {
  title: "Dịch cuộc họp trực tiếp & tóm tắt AI",
  description:
    "Flash Meet dịch cuộc họp theo thời gian thực với phụ đề song ngữ và tự động tóm tắt, việc cần làm, biên bản bằng AI. Dùng với Google Meet, Zoom, Microsoft Teams và YouTube — tiếng Việt, Anh, Hàn.",
  alternates: { canonical: "/vi", languages: LANGUAGES },
  openGraph: {
    title: "Flash Meet — Dịch cuộc họp trực tiếp & tóm tắt AI",
    description: "Phụ đề song ngữ trực tiếp + tóm tắt AI cho Google Meet, Zoom, Teams và YouTube.",
    url: "https://meet.transflash.app/vi",
    locale: "vi_VN",
  },
};

export default function ViLanding() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingFaq("vi")) }} />
      <LandingHeader lang="vi" />
      <LandingContent lang="vi" />
    </>
  );
}
