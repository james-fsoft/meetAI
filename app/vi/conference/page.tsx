import type { Metadata } from "next";
import ConceptFrame from "../../ConceptFrame";

const LANGUAGES = { en: "/conference", vi: "/vi/conference", ko: "/ko/conference", "x-default": "/conference" };

export const metadata: Metadata = {
  title: 'Hội nghị, sự kiện lớn',
  description: 'Phụ đề dịch trực tiếp cho cả khán phòng: chữ lớn trên màn chiếu, khung nổi đè lên slide và mã QR để khán giả đọc trên điện thoại.',
  alternates: { canonical: '/vi/conference', languages: LANGUAGES },
  openGraph: { title: 'Hội nghị, sự kiện lớn — Flash Meet', description: 'Phụ đề dịch trực tiếp cho cả khán phòng: chữ lớn trên màn chiếu, khung nổi đè lên slide và mã QR để khán giả đọc trên điện thoại.', url: "https://meet.transflash.app" + '/vi/conference', locale: 'vi_VN' },
};

export default function ConferenceVi() {
  return <ConceptFrame src='/concept-conference.html' title='Hội nghị, sự kiện lớn — Flash Meet' />;
}
