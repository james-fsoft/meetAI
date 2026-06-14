"use client";

import LegalPage, { type LegalContent } from "../LegalPage";
import type { Lang } from "@/lib/use-lang";

const UPDATED = "13/06/2026";

const C: Record<Lang, LegalContent> = {
  en: {
    back: "← Back to app", title: "Terms of Service", footHref: "/privacy", footText: "Privacy Policy →",
    meta: `Last updated: ${UPDATED} · Applies to **meet.transflash.app** (“Meeting AI”).`,
    sections: [
      { h: "1. Acceptance", blocks: [{ p: "By accessing or using Meeting AI, you agree to these terms. If you do not agree, please do not use the service." }] },
      { h: "2. Service description", blocks: [{ p: "Meeting AI provides transcription, multi-language live translation, speaker separation and AI meeting summaries. The service may change, be upgraded, or have features paused over time." }] },
      { h: "3. Accounts", blocks: [{ p: "You sign in with Google and are responsible for activity in your account. Please keep your device and session secure." }] },
      { h: "4. Plans & payment", blocks: [{ ul: [
        "Paid plans are billed monthly, processed via Lemon Squeezy.",
        "You can upgrade, downgrade or cancel anytime; your current plan stays active until the paid period ends.",
        "Each plan has a “translation minutes” quota; once exceeded, live translation pauses until the next cycle.",
      ] }] },
      { h: "5. Acceptable use & recording consent", blocks: [{ p: "**Important:** You are responsible for complying with recording and privacy laws in your jurisdiction. Before recording or translating a meeting, you must **notify and obtain consent from participants** as required by applicable law. You may not use the service for any unlawful purpose, unauthorized surveillance, or to infringe others' rights." }] },
      { h: "6. Content ownership", blocks: [{ p: "Content you create (audio, transcripts, summaries) belongs to you. You grant us the right to process it solely to provide the service." }] },
      { h: "7. Accuracy disclaimer", blocks: [{ p: "AI-generated transcription, translation and summaries may contain errors and are **not guaranteed to be perfectly accurate**. Please verify before relying on them for important decisions. The service is provided “as-is”, without warranties." }] },
      { h: "8. Limitation of liability", blocks: [{ p: "To the extent permitted by law, Meeting AI is not liable for indirect, incidental or consequential damages arising from use of the service." }] },
      { h: "9. Suspension & termination", blocks: [{ p: "We may suspend or terminate access if you violate these terms or abuse the service." }] },
      { h: "10. Changes", blocks: [{ p: "These terms may be updated; the new version is posted on this page with its date. Continued use means you accept the new version." }] },
      { h: "11. Contact", blocks: [{ p: "Questions about these terms: **support@transflash.app**" }] },
    ],
  },
  vi: {
    back: "← Về app", title: "Điều khoản dịch vụ", footHref: "/privacy", footText: "Chính sách bảo mật →",
    meta: `Cập nhật lần cuối: ${UPDATED} · Áp dụng cho **meet.transflash.app** (“Meeting AI”).`,
    sections: [
      { h: "1. Chấp nhận điều khoản", blocks: [{ p: "Khi truy cập hoặc sử dụng Meeting AI, bạn đồng ý với các điều khoản này. Nếu không đồng ý, vui lòng không sử dụng dịch vụ." }] },
      { h: "2. Mô tả dịch vụ", blocks: [{ p: "Meeting AI cung cấp phiên âm, dịch trực tiếp đa ngôn ngữ, tách giọng nói và tóm tắt cuộc họp bằng AI. Dịch vụ có thể thay đổi, nâng cấp hoặc tạm ngừng tính năng theo thời gian." }] },
      { h: "3. Tài khoản", blocks: [{ p: "Bạn đăng nhập bằng Google và chịu trách nhiệm cho hoạt động trong tài khoản của mình. Vui lòng giữ an toàn cho thiết bị và phiên đăng nhập." }] },
      { h: "4. Gói dịch vụ & thanh toán", blocks: [{ ul: [
        "Các gói trả phí tính theo tháng, xử lý qua Lemon Squeezy.",
        "Bạn có thể nâng, hạ hoặc huỷ gói bất cứ lúc nào; gói hiện tại dùng đến hết chu kỳ đã thanh toán.",
        "Mỗi gói có hạn mức “phút dịch”; vượt hạn mức, tính năng dịch trực tiếp tạm dừng tới kỳ sau.",
      ] }] },
      { h: "5. Sử dụng hợp lệ & sự đồng ý ghi âm", blocks: [{ p: "**Quan trọng:** Bạn chịu trách nhiệm tuân thủ pháp luật về ghi âm và quyền riêng tư tại khu vực của mình. Trước khi ghi âm hoặc dịch một cuộc họp, bạn phải **thông báo và xin phép những người tham gia** theo quy định pháp luật hiện hành. Bạn không được dùng dịch vụ cho mục đích bất hợp pháp, theo dõi trái phép hoặc xâm phạm quyền của người khác." }] },
      { h: "6. Sở hữu nội dung", blocks: [{ p: "Nội dung bạn tạo ra (âm thanh, transcript, tóm tắt) thuộc về bạn. Bạn cấp cho chúng tôi quyền xử lý nội dung đó chỉ nhằm cung cấp dịch vụ." }] },
      { h: "7. Miễn trừ về độ chính xác", blocks: [{ p: "Phiên âm, dịch và tóm tắt do AI tạo ra có thể có sai sót và **không đảm bảo chính xác tuyệt đối**. Vui lòng tự kiểm chứng trước khi dùng cho quyết định quan trọng. Dịch vụ cung cấp “nguyên trạng” (as-is), không kèm bảo đảm." }] },
      { h: "8. Giới hạn trách nhiệm", blocks: [{ p: "Trong phạm vi pháp luật cho phép, Meeting AI không chịu trách nhiệm cho các thiệt hại gián tiếp, ngẫu nhiên hoặc hệ quả phát sinh từ việc sử dụng dịch vụ." }] },
      { h: "9. Tạm ngừng & chấm dứt", blocks: [{ p: "Chúng tôi có thể tạm ngừng hoặc chấm dứt quyền truy cập nếu bạn vi phạm điều khoản hoặc lạm dụng dịch vụ." }] },
      { h: "10. Thay đổi điều khoản", blocks: [{ p: "Điều khoản có thể được cập nhật; bản mới đăng tại trang này kèm ngày cập nhật. Việc tiếp tục sử dụng đồng nghĩa bạn chấp nhận bản mới." }] },
      { h: "11. Liên hệ", blocks: [{ p: "Câu hỏi về điều khoản: **support@transflash.app**" }] },
    ],
  },
  ko: {
    back: "← 앱으로", title: "이용약관", footHref: "/privacy", footText: "개인정보처리방침 →",
    meta: `최종 업데이트: ${UPDATED} · 적용 대상 **meet.transflash.app** (“Meeting AI”).`,
    sections: [
      { h: "1. 약관 동의", blocks: [{ p: "Meeting AI에 접속하거나 이용함으로써 본 약관에 동의하게 됩니다. 동의하지 않으면 서비스를 이용하지 마십시오." }] },
      { h: "2. 서비스 설명", blocks: [{ p: "Meeting AI는 전사, 다국어 실시간 번역, 화자 분리, AI 회의 요약을 제공합니다. 서비스는 시간이 지남에 따라 변경·개선되거나 기능이 중단될 수 있습니다." }] },
      { h: "3. 계정", blocks: [{ p: "Google로 로그인하며, 계정 내 활동에 대한 책임은 사용자에게 있습니다. 기기와 세션을 안전하게 관리하세요." }] },
      { h: "4. 요금제 & 결제", blocks: [{ ul: [
        "유료 요금제는 월 단위로 청구되며 Lemon Squeezy를 통해 처리됩니다.",
        "언제든 업/다운그레이드 또는 해지할 수 있으며, 현재 요금제는 결제 기간 종료까지 유지됩니다.",
        "각 요금제에는 “번역 분” 한도가 있으며, 초과 시 다음 주기까지 실시간 번역이 일시 중지됩니다.",
      ] }] },
      { h: "5. 적절한 사용 & 녹음 동의", blocks: [{ p: "**중요:** 사용자는 해당 지역의 녹음 및 개인정보 보호 법규를 준수할 책임이 있습니다. 회의를 녹음하거나 번역하기 전에 관련 법률에 따라 **참가자에게 알리고 동의를 받아야** 합니다. 불법적 목적, 무단 감시, 타인의 권리 침해에 서비스를 사용할 수 없습니다." }] },
      { h: "6. 콘텐츠 소유권", blocks: [{ p: "사용자가 생성한 콘텐츠(오디오, 전사본, 요약)는 사용자에게 귀속됩니다. 사용자는 서비스 제공 목적으로만 이를 처리할 권리를 당사에 부여합니다." }] },
      { h: "7. 정확성 면책", blocks: [{ p: "AI가 생성한 전사·번역·요약에는 오류가 있을 수 있으며 **완벽한 정확성을 보장하지 않습니다**. 중요한 결정에 사용하기 전에 직접 확인하세요. 서비스는 어떠한 보증 없이 “있는 그대로” 제공됩니다." }] },
      { h: "8. 책임의 제한", blocks: [{ p: "법이 허용하는 범위 내에서 Meeting AI는 서비스 이용으로 인한 간접적·부수적·결과적 손해에 대해 책임지지 않습니다." }] },
      { h: "9. 정지 & 종료", blocks: [{ p: "약관 위반 또는 서비스 남용 시 접근을 정지하거나 종료할 수 있습니다." }] },
      { h: "10. 약관 변경", blocks: [{ p: "본 약관은 변경될 수 있으며, 새 버전은 날짜와 함께 본 페이지에 게시됩니다. 계속 이용하면 새 버전에 동의하는 것으로 간주됩니다." }] },
      { h: "11. 문의", blocks: [{ p: "약관 관련 문의: **support@transflash.app**" }] },
    ],
  },
};

export default function Terms() {
  return <LegalPage pick={(lang) => C[lang]} />;
}
