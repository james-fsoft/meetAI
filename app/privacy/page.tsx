"use client";

import LegalPage, { type LegalContent } from "../LegalPage";
import type { Lang } from "@/lib/use-lang";

const UPDATED = "13/06/2026";

const C: Record<Lang, LegalContent> = {
  en: {
    back: "← Back to app", title: "Privacy Policy", footHref: "/terms", footText: "Terms of Service →",
    meta: `Last updated: ${UPDATED} · Applies to **meet.transflash.app** (“Meeting AI”, “we”).`,
    intro: ["Meeting AI is a service for recording, transcribing, live-translating and summarizing meetings with AI. This policy describes the data we collect, how we use it, and your rights."],
    sections: [
      { h: "1. Data we collect", blocks: [{ ul: [
        "**Account:** your email address and display name when you sign in with Google.",
        "**Audio content:** audio you record or upload is processed to transcribe and translate.",
        "**Transcripts & summaries:** saved to your account history so you can review them later.",
        "**Usage data:** minutes used, plan, sign-in times — to operate the service and apply quotas.",
      ] }] },
      { h: "2. How we use data", blocks: [
        { ul: [
          "Provide features: transcription, live translation, speaker separation and summaries.",
          "Manage your account, plan and usage limits.",
          "Security, abuse prevention and service improvement.",
        ] },
        { p: "We do **not** sell your data to third parties." },
      ] },
      { h: "3. Third-party processors", blocks: [
        { p: "To provide the service we send the necessary minimum of data to:" },
        { ul: [
          "**Google** — sign-in (OAuth).",
          "**Soniox** — speech-to-text and live translation.",
          "**OpenAI** — generating meeting summaries.",
          "**Supabase** — authentication and storing profile/history.",
          "**Vercel** — application hosting infrastructure.",
          "**Lemon Squeezy** — payment processing (when you upgrade).",
        ] },
      ] },
      { h: "4. Storage & retention", blocks: [{ ul: [
        "Audio is processed for transcription/translation; we do not use your content to train models.",
        "Transcripts and summaries stay in your account history until you delete them (Free plan keeps 7 days).",
        "You can delete any meeting in the app at any time.",
      ] }] },
      { h: "5. Your rights", blocks: [{ p: "You may access, correct or request deletion of your personal data, and withdraw consent. To delete your whole account and data, contact **support@transflash.app**." }] },
      { h: "6. Security", blocks: [{ p: "Data is transmitted over encrypted connections (HTTPS/WSS). Provider API keys are kept server-side and never exposed to the browser. Still, no system is perfectly secure." }] },
      { h: "7. Cookies", blocks: [{ p: "We use essential cookies to keep you signed in. No advertising cookies." }] },
      { h: "8. Children", blocks: [{ p: "The service is not intended for anyone under 16." }] },
      { h: "9. Changes", blocks: [{ p: "We may update this policy. The new version will be posted on this page with its date." }] },
      { h: "10. Contact", blocks: [{ p: "Any privacy questions: **support@transflash.app**" }] },
    ],
  },
  vi: {
    back: "← Về app", title: "Chính sách bảo mật", footHref: "/terms", footText: "Điều khoản dịch vụ →",
    meta: `Cập nhật lần cuối: ${UPDATED} · Áp dụng cho **meet.transflash.app** (“Meeting AI”, “chúng tôi”).`,
    intro: ["Meeting AI là dịch vụ ghi âm, phiên âm, dịch trực tiếp và tóm tắt cuộc họp bằng AI. Chính sách này mô tả dữ liệu chúng tôi thu thập, cách sử dụng và quyền của bạn."],
    sections: [
      { h: "1. Dữ liệu chúng tôi thu thập", blocks: [{ ul: [
        "**Tài khoản:** địa chỉ email và tên hiển thị khi bạn đăng nhập bằng Google.",
        "**Nội dung âm thanh:** âm thanh bạn ghi/tải lên được xử lý để phiên âm và dịch.",
        "**Bản ghi & tóm tắt:** transcript và bản tóm tắt được lưu vào lịch sử tài khoản của bạn để bạn xem lại.",
        "**Dữ liệu sử dụng:** số phút đã dùng, gói dịch vụ, thời điểm đăng nhập — để vận hành và áp hạn mức.",
      ] }] },
      { h: "2. Cách chúng tôi sử dụng dữ liệu", blocks: [
        { ul: [
          "Cung cấp tính năng: phiên âm, dịch trực tiếp, tách giọng nói và tóm tắt.",
          "Quản lý tài khoản, gói dịch vụ và hạn mức sử dụng.",
          "Bảo mật, chống lạm dụng và cải thiện chất lượng dịch vụ.",
        ] },
        { p: "Chúng tôi **không bán** dữ liệu của bạn cho bên thứ ba." },
      ] },
      { h: "3. Bên thứ ba xử lý dữ liệu", blocks: [
        { p: "Để cung cấp dịch vụ, chúng tôi gửi một phần dữ liệu cần thiết tới các nhà cung cấp sau:" },
        { ul: [
          "**Google** — đăng nhập (OAuth).",
          "**Soniox** — chuyển giọng nói thành văn bản và dịch trực tiếp.",
          "**OpenAI** — tạo bản tóm tắt cuộc họp.",
          "**Supabase** — xác thực và lưu trữ hồ sơ/lịch sử.",
          "**Vercel** — hạ tầng lưu trữ ứng dụng.",
          "**Lemon Squeezy** — xử lý thanh toán (khi bạn nâng cấp gói).",
        ] },
      ] },
      { h: "4. Lưu trữ & thời gian giữ dữ liệu", blocks: [{ ul: [
        "Âm thanh được xử lý để phiên âm/dịch; chúng tôi không dùng nội dung của bạn để huấn luyện mô hình.",
        "Transcript và tóm tắt lưu trong lịch sử tài khoản cho đến khi bạn xóa (gói Free giữ 7 ngày).",
        "Bạn có thể xóa từng cuộc họp trong app bất cứ lúc nào.",
      ] }] },
      { h: "5. Quyền của bạn", blocks: [{ p: "Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa dữ liệu cá nhân, và rút lại sự đồng ý. Để xóa toàn bộ tài khoản và dữ liệu, liên hệ **support@transflash.app**." }] },
      { h: "6. Bảo mật", blocks: [{ p: "Dữ liệu được truyền qua kết nối mã hóa (HTTPS/WSS). Khóa API của nhà cung cấp được giữ phía máy chủ, không lộ ra trình duyệt. Tuy vậy, không hệ thống nào an toàn tuyệt đối." }] },
      { h: "7. Cookie", blocks: [{ p: "Chúng tôi dùng cookie cần thiết để duy trì phiên đăng nhập. Không dùng cookie quảng cáo." }] },
      { h: "8. Trẻ em", blocks: [{ p: "Dịch vụ không dành cho người dưới 16 tuổi." }] },
      { h: "9. Thay đổi chính sách", blocks: [{ p: "Chúng tôi có thể cập nhật chính sách này. Bản mới sẽ đăng tại trang này kèm ngày cập nhật." }] },
      { h: "10. Liên hệ", blocks: [{ p: "Mọi câu hỏi về bảo mật: **support@transflash.app**" }] },
    ],
  },
  ko: {
    back: "← 앱으로", title: "개인정보처리방침", footHref: "/terms", footText: "이용약관 →",
    meta: `최종 업데이트: ${UPDATED} · 적용 대상 **meet.transflash.app** (“Meeting AI”, “당사”).`,
    intro: ["Meeting AI는 AI로 회의를 녹음·전사·실시간 번역·요약하는 서비스입니다. 본 방침은 당사가 수집하는 데이터, 이용 방법, 사용자의 권리를 설명합니다."],
    sections: [
      { h: "1. 수집하는 데이터", blocks: [{ ul: [
        "**계정:** Google 로그인 시 이메일 주소와 표시 이름.",
        "**오디오 콘텐츠:** 녹음/업로드한 오디오는 전사 및 번역을 위해 처리됩니다.",
        "**전사본 & 요약:** 나중에 다시 볼 수 있도록 계정 기록에 저장됩니다.",
        "**사용 데이터:** 사용 분 수, 요금제, 로그인 시각 — 서비스 운영 및 한도 적용을 위해.",
      ] }] },
      { h: "2. 데이터 이용 방법", blocks: [
        { ul: [
          "기능 제공: 전사, 실시간 번역, 화자 분리, 요약.",
          "계정, 요금제, 사용 한도 관리.",
          "보안, 남용 방지, 서비스 개선.",
        ] },
        { p: "당사는 사용자의 데이터를 제3자에게 **판매하지 않습니다**." },
      ] },
      { h: "3. 제3자 처리업체", blocks: [
        { p: "서비스 제공을 위해 필요한 최소한의 데이터를 다음 업체에 전송합니다:" },
        { ul: [
          "**Google** — 로그인(OAuth).",
          "**Soniox** — 음성-텍스트 변환 및 실시간 번역.",
          "**OpenAI** — 회의 요약 생성.",
          "**Supabase** — 인증 및 프로필/기록 저장.",
          "**Vercel** — 애플리케이션 호스팅 인프라.",
          "**Lemon Squeezy** — 결제 처리(업그레이드 시).",
        ] },
      ] },
      { h: "4. 저장 & 보관", blocks: [{ ul: [
        "오디오는 전사/번역을 위해 처리되며, 콘텐츠를 모델 학습에 사용하지 않습니다.",
        "전사본과 요약은 삭제 전까지 계정 기록에 보관됩니다(Free 요금제는 7일).",
        "앱에서 언제든 개별 회의를 삭제할 수 있습니다.",
      ] }] },
      { h: "5. 사용자의 권리", blocks: [{ p: "개인정보의 열람·정정·삭제를 요청하고 동의를 철회할 수 있습니다. 계정과 데이터 전체 삭제는 **support@transflash.app** 으로 문의하세요." }] },
      { h: "6. 보안", blocks: [{ p: "데이터는 암호화 연결(HTTPS/WSS)로 전송됩니다. 제공업체 API 키는 서버 측에 보관되며 브라우저에 노출되지 않습니다. 다만 완벽히 안전한 시스템은 없습니다." }] },
      { h: "7. 쿠키", blocks: [{ p: "로그인 유지를 위한 필수 쿠키만 사용합니다. 광고 쿠키는 사용하지 않습니다." }] },
      { h: "8. 아동", blocks: [{ p: "본 서비스는 만 16세 미만을 대상으로 하지 않습니다." }] },
      { h: "9. 방침 변경", blocks: [{ p: "본 방침은 변경될 수 있으며, 새 버전은 날짜와 함께 본 페이지에 게시됩니다." }] },
      { h: "10. 문의", blocks: [{ p: "개인정보 관련 문의: **support@transflash.app**" }] },
    ],
  },
};

export default function Privacy() {
  return <LegalPage pick={(lang) => C[lang]} />;
}
