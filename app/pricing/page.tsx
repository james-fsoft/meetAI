"use client";

import { useState, useEffect, Fragment } from "react";
import { useLang, type Lang } from "@/lib/use-lang";
import LangSwitch from "../LangSwitch";

// Plan identity only — prices live per-language (currency follows the language).
type PlanBase = { id: string; highlight?: boolean };
const PLANS: PlanBase[] = [
  { id: "free" },
  { id: "pro", highlight: true },
  { id: "business" },
  { id: "enterprise" },
];

type PlanText = {
  name: string; tagline: string; cta: string; tag?: string; features: string[];
  priceMonthly?: string; origMonthly?: string;
  priceAnnual?: string; origAnnual?: string; annualTotal?: string;
};
type Dict = {
  back: string; eyebrow: string; h1: string; sub: string;
  monthly: string; annual: string; period: string; contact: string;
  billedYear: (x: string) => string; busy: string; promo: string;
  usageTitle: string; reassure: string;
  trust: string[];
  refTitle: string; refSub: string; refCta: string; refCopied: string;
  refReward: string; refShareText: string; refCopyBtn: string; refShareMore: string; refYourLink: string;
  refBadge: string; refH1: string; refH2: string; refSubhead: string;
  refYouEarn: string; refFriendEarns: string; refMinutes: string;
  refShareTitle: string; refBottom: string; refStart: string; refLater: string;
  refProgram: string; refBannerH: string; refBannerSub: string; refInviteTeam: string;
  refUnlimited: string; refPerf: string; refInvited: string; refEarned: string; refUnitMin: string;
  hiwTitle: string; hiwSub: string; steps: { t: string; d: string }[];
  perfTitle: string; perfSuccess: string; perfEarned: string; perfRank: string; rankNew: string; refEmpty: string;
  faqTitle: string;
  plans: Record<string, PlanText>;
  faq: { q: string; a: string }[];
};

// "Comfortably covers ~X" — turns abstract minutes into relatable scenarios so
// users feel the quota is generous (and nudges heavier users up a tier).
const USAGE: Record<Lang, Record<string, string[]>> = {
  en: {
    free: ["≈ 1 × 30-min meeting", "or 30 min of video"],
    pro: ["≈ 33 × 30-min meetings / mo", "or ≈ 17 hrs of video & calls"],
    business: ["≈ 160 × 30-min meetings / mo", "or ≈ 80 hrs for the whole team"],
    enterprise: ["Scales to your needs — no real limit"],
  },
  vi: {
    free: ["≈ 1 buổi họp 30 phút", "hoặc 30 phút video"],
    pro: ["≈ 33 buổi họp 30 phút / tháng", "hoặc ≈ 17 giờ video & cuộc gọi"],
    business: ["≈ 160 buổi họp 30 phút / tháng", "hoặc ≈ 80 giờ cho cả team"],
    enterprise: ["Theo nhu cầu — gần như không giới hạn"],
  },
  ko: {
    free: ["≈ 30분 회의 1회", "또는 영상 30분"],
    pro: ["≈ 월 30분 회의 33회", "또는 ≈ 영상·통화 17시간"],
    business: ["≈ 월 30분 회의 160회", "또는 ≈ 팀 전체 80시간"],
    enterprise: ["필요에 맞게 — 사실상 무제한"],
  },
};

const T: Record<Lang, Dict> = {
  en: {
    back: "← Back to app", eyebrow: "PRICING", h1: "Transparent pricing, no hidden fees",
    sub: "Every plan includes real-time translation minutes and AI summaries. Cancel anytime.",
    monthly: "Monthly", annual: "Annual", period: "/ mo", contact: "Contact",
    billedYear: (x) => `Billed ${x} / year`, busy: "Opening…", promo: "🎉 Launch offer — save 33%, limited time",
    usageTitle: "Comfortably covers", reassure: "💡 Quota resets every month · most users use only ~40% — you'll have plenty of room.",
    trust: ["✓ Cancel anytime", "✓ No hidden fees", "✓ Private — we don't sell data"],
    refTitle: "Invite friends — you both get 2 hours free",
    refSub: "Share your link. Every friend who signs up gives you both 120 free minutes (2 hours). No limit — invite 10 friends = 20 free hours.",
    refCta: "🎁 Invite & earn free hours", refCopied: "Copied!",
    refReward: "You both get 120 minutes (2 hours) free", refShareText: "I'm using Flash Meet for live meeting & video translation — grab 2 free hours here:",
    refCopyBtn: "Copy Link", refShareMore: "More…", refYourLink: "Your referral link",
    refBadge: "🎁 Referral Program", refH1: "Invite Friends.", refH2: "Earn More Free Minutes.",
    refSubhead: "Share Flash Meet with your network. Both of you receive 120 free translation minutes.",
    refYouEarn: "You Earn", refFriendEarns: "Friend Earns", refMinutes: "+120 Minutes",
    refShareTitle: "Share Instantly",
    refBottom: "Every successful signup gives both users +120 free translation minutes. Unlimited referrals — the more you share, the more you earn.",
    refStart: "Start Sharing", refLater: "Maybe Later",
    refProgram: "Referral Program", refBannerH: "Earn more translation minutes",
    refBannerSub: "Invite colleagues and expand your workspace. For every successful signup, you and they each receive +120 minutes.",
    refInviteTeam: "Invite Your Team", refUnlimited: "Unlimited referrals",
    refPerf: "Your referral performance", refInvited: "Invited", refEarned: "Earned", refUnitMin: "minutes",
    hiwTitle: "How it works", hiwSub: "Earn translation minutes by helping your team discover Flash Meet.",
    steps: [
      { t: "Invite a colleague", d: "Share your personal referral link." },
      { t: "They join", d: "They create a Flash Meet account." },
      { t: "Both earn", d: "You and your colleague each receive +120 translation minutes." },
      { t: "Repeat", d: "Unlimited successful referrals — keep earning." },
    ],
    perfTitle: "Your referral performance", perfSuccess: "Successful referrals", perfEarned: "Minutes earned",
    perfRank: "Referral rank", rankNew: "New", refEmpty: "You haven't invited anyone yet.",
    faqTitle: "Frequently asked questions",
    plans: {
      free: { name: "Free", tagline: "Free to try", cta: "Get started", priceMonthly: "$0",
        features: ["30 translation min / month", "1 target language", "Basic summary", "7-day history"] },
      pro: { name: "Pro", tagline: "For professionals", cta: "Upgrade to Pro", tag: "Most popular",
        priceMonthly: "$9.99", origMonthly: "$14.99", priceAnnual: "$7.99", origAnnual: "$11.99", annualTotal: "$95.99",
        features: ["1,000 translation min / month (~17 hrs)", "60+ languages & two-way mode", "Automatic speaker separation (Speaker 1, 2, 3…)", "Full AI summary + file download", "Unlimited history"] },
      business: { name: "Business", tagline: "For teams & businesses", cta: "Upgrade to Business",
        priceMonthly: "$29.99", origMonthly: "$44.99", priceAnnual: "$23.99", origAnnual: "$35.99", annualTotal: "$287.99",
        features: ["5,000 translation min / month (~83 hrs)", "Everything in Pro", "Call Center mode", "5 user accounts", "Custom glossary + priority support"] },
      enterprise: { name: "Enterprise", tagline: "Custom solution", cta: "Contact us",
        features: ["Custom translation minutes", "Multiple users + SSO", "Custom prompts & glossary", "Dedicated support + SLA"] },
    },
    faq: [
      { q: "What is a “translation minute”?", a: "Minutes of audio translated live or summarized. A 30-min meeting = 30 translation minutes. The quota resets every month." },
      { q: "Multi-language vs two-way?", a: "Multi-language: auto-detects any speech and translates into 1 language. Two-way: pick 2 languages — speak either and it shows the other." },
      { q: "How much does annual save?", a: "Annual billing is 20% cheaper than monthly — like getting 2+ months free." },
      { q: "What if I run out of minutes?", a: "Your quota resets at the start of each month — it's not a one-time pool. In practice most users only use ~40% of theirs. Need more? Upgrade anytime, effective instantly." },
      { q: "Can I change or cancel?", a: "Yes. Upgrade, downgrade or cancel anytime; you keep access until the paid period ends." },
    ],
  },
  vi: {
    back: "← Quay lại app", eyebrow: "BẢNG GIÁ", h1: "Giá minh bạch, không phí ẩn",
    sub: "Mọi gói đã gồm phút dịch real-time và tóm tắt AI. Huỷ bất cứ lúc nào.",
    monthly: "Theo tháng", annual: "Theo năm", period: "/ tháng", contact: "Liên hệ",
    billedYear: (x) => `Thanh toán ${x} / năm`, busy: "Đang mở…", promo: "🎉 Ưu đãi ra mắt — giảm 33%, có hạn",
    usageTitle: "Đủ dùng thoải mái cho", reassure: "💡 Hạn mức làm mới mỗi tháng · đa số người dùng chỉ dùng ~40% — bạn sẽ rất thoải mái.",
    trust: ["✓ Huỷ bất cứ lúc nào", "✓ Không phí ẩn", "✓ Bảo mật — không bán dữ liệu"],
    refTitle: "Mời bạn bè — cả hai cùng được tặng 2 giờ miễn phí",
    refSub: "Chia sẻ link của bạn. Mỗi người bạn đăng ký → cả hai +120 phút (2 giờ) miễn phí. Không giới hạn — mời 10 bạn = 20 giờ miễn phí.",
    refCta: "🎁 Mời bạn & nhận giờ miễn phí", refCopied: "Đã sao chép!",
    refReward: "Cả hai cùng nhận 120 phút (2 giờ) miễn phí", refShareText: "Mình đang dùng Flash Meet để dịch họp & video trực tiếp — vào link nhận 2 giờ miễn phí nhé:",
    refCopyBtn: "Sao chép link", refShareMore: "Khác…", refYourLink: "Link giới thiệu của bạn",
    refBadge: "🎁 Chương trình giới thiệu", refH1: "Mời bạn bè.", refH2: "Nhận thêm phút dịch.",
    refSubhead: "Chia sẻ Flash Meet với bạn bè & đồng nghiệp. Cả hai cùng nhận 120 phút dịch miễn phí.",
    refYouEarn: "Bạn nhận", refFriendEarns: "Bạn bè nhận", refMinutes: "+120 phút",
    refShareTitle: "Chia sẻ ngay",
    refBottom: "Mỗi lượt đăng ký thành công đều cộng +120 phút dịch miễn phí cho cả hai. Không giới hạn — chia sẻ càng nhiều, nhận càng nhiều.",
    refStart: "Bắt đầu chia sẻ", refLater: "Để sau",
    refProgram: "Chương trình giới thiệu", refBannerH: "Nhận thêm phút dịch",
    refBannerSub: "Mời đồng nghiệp & mở rộng không gian làm việc. Mỗi lượt đăng ký thành công, bạn và họ mỗi người nhận +120 phút.",
    refInviteTeam: "Mời nhóm của bạn", refUnlimited: "Không giới hạn lượt mời",
    refPerf: "Hiệu quả giới thiệu của bạn", refInvited: "Đã mời", refEarned: "Đã nhận", refUnitMin: "phút",
    hiwTitle: "Cách hoạt động", hiwSub: "Nhận phút dịch khi giúp nhóm của bạn biết đến Flash Meet.",
    steps: [
      { t: "Mời đồng nghiệp", d: "Chia sẻ link giới thiệu cá nhân của bạn." },
      { t: "Họ tham gia", d: "Họ tạo tài khoản Flash Meet." },
      { t: "Cả hai cùng nhận", d: "Bạn và đồng nghiệp mỗi người nhận +120 phút dịch." },
      { t: "Lặp lại", d: "Không giới hạn lượt giới thiệu thành công — nhận mãi." },
    ],
    perfTitle: "Hiệu quả giới thiệu của bạn", perfSuccess: "Giới thiệu thành công", perfEarned: "Phút đã nhận",
    perfRank: "Hạng giới thiệu", rankNew: "Mới", refEmpty: "Bạn chưa mời ai cả.",
    faqTitle: "Câu hỏi thường gặp",
    plans: {
      free: { name: "Free", tagline: "Dùng thử miễn phí", cta: "Bắt đầu", priceMonthly: "0đ",
        features: ["30 phút dịch / tháng", "1 ngôn ngữ đích", "Tóm tắt cơ bản", "Lịch sử 7 ngày"] },
      pro: { name: "Pro", tagline: "Cho cá nhân chuyên nghiệp", cta: "Nâng cấp Pro", tag: "Phổ biến nhất",
        priceMonthly: "249.000đ", origMonthly: "369.000đ", priceAnnual: "199.000đ", origAnnual: "295.000đ", annualTotal: "2.390.000đ",
        features: ["1.000 phút dịch / tháng (~17 giờ)", "Đa ngôn ngữ 60+ & chế độ song ngữ", "Tách giọng tự động (Speaker 1, 2, 3…)", "Tóm tắt AI đầy đủ + tải file", "Lịch sử không giới hạn"] },
      business: { name: "Business", tagline: "Cho đội nhóm & doanh nghiệp", cta: "Nâng cấp Business",
        priceMonthly: "749.000đ", origMonthly: "1.099.000đ", priceAnnual: "599.000đ", origAnnual: "879.000đ", annualTotal: "7.190.000đ",
        features: ["5.000 phút dịch / tháng (~83 giờ)", "Toàn bộ tính năng Pro", "Call Center mode", "5 tài khoản người dùng", "Từ điển riêng + hỗ trợ ưu tiên"] },
      enterprise: { name: "Enterprise", tagline: "Giải pháp theo nhu cầu", cta: "Liên hệ",
        features: ["Phút dịch tuỳ chỉnh", "Nhiều người dùng + SSO", "Tuỳ chỉnh prompt & từ điển", "Dedicated support + SLA"] },
    },
    faq: [
      { q: "“Phút dịch” là gì?", a: "Số phút âm thanh được dịch trực tiếp hoặc tạo biên bản. Họp 30 phút = 30 phút dịch. Hạn mức làm mới mỗi tháng." },
      { q: "Đa ngôn ngữ và song ngữ khác gì?", a: "Đa ngôn ngữ: tự nhận diện rồi dịch sang 1 ngôn ngữ. Song ngữ: chọn 2 ngôn ngữ, nói tiếng nào ra tiếng còn lại." },
      { q: "Trả theo năm tiết kiệm bao nhiêu?", a: "Trả theo năm được giảm 20% so với trả tháng — tương đương được tặng hơn 2 tháng dùng miễn phí." },
      { q: "Lỡ dùng hết phút thì sao?", a: "Hạn mức tự làm mới vào đầu mỗi tháng — không phải gói dùng 1 lần. Thực tế đa số người dùng chỉ dùng ~40% hạn mức. Cần thêm? Nâng cấp bất cứ lúc nào, hiệu lực ngay." },
      { q: "Đổi hoặc huỷ gói được không?", a: "Được. Nâng/hạ/huỷ bất cứ lúc nào, dùng đến hết chu kỳ đã thanh toán." },
    ],
  },
  ko: {
    back: "← 앱으로", eyebrow: "요금제", h1: "투명한 가격, 숨은 비용 없음",
    sub: "모든 요금제에 실시간 번역 시간과 AI 요약이 포함됩니다. 언제든 해지 가능합니다.",
    monthly: "월간", annual: "연간", period: "/ 월", contact: "문의",
    billedYear: (x) => `연 ${x} 청구`, busy: "여는 중…", promo: "🎉 출시 기념 — 33% 할인, 기간 한정",
    usageTitle: "여유롭게 사용 가능", reassure: "💡 한도는 매월 초기화 · 대부분 ~40%만 사용 — 충분히 여유롭습니다.",
    trust: ["✓ 언제든 해지", "✓ 숨은 비용 없음", "✓ 데이터 미판매"],
    refTitle: "친구 초대 — 둘 다 2시간 무료",
    refSub: "링크를 공유하세요. 친구가 가입할 때마다 둘 다 120분(2시간) 무료. 제한 없음 — 10명 초대 = 20시간 무료.",
    refCta: "🎁 초대하고 무료 시간 받기", refCopied: "복사됨!",
    refReward: "둘 다 120분(2시간) 무료 제공", refShareText: "Flash Meet으로 회의·영상을 실시간 번역하고 있어요. 이 링크로 2시간 무료 받으세요:",
    refCopyBtn: "링크 복사", refShareMore: "더보기…", refYourLink: "내 추천 링크",
    refBadge: "🎁 추천 프로그램", refH1: "친구를 초대하세요.", refH2: "무료 번역 시간을 더 받으세요.",
    refSubhead: "Flash Meet을 동료와 공유하세요. 둘 다 120분 무료 번역 시간을 받습니다.",
    refYouEarn: "내 보상", refFriendEarns: "친구 보상", refMinutes: "+120분",
    refShareTitle: "바로 공유",
    refBottom: "가입이 완료될 때마다 두 사람 모두 +120분 무료 번역 시간을 받습니다. 제한 없음 — 많이 공유할수록 많이 받습니다.",
    refStart: "공유 시작", refLater: "나중에",
    refProgram: "추천 프로그램", refBannerH: "번역 시간을 더 받으세요",
    refBannerSub: "동료를 초대하고 워크스페이스를 확장하세요. 가입이 완료될 때마다 본인과 친구 각각 +120분을 받습니다.",
    refInviteTeam: "팀 초대하기", refUnlimited: "무제한 추천",
    refPerf: "내 추천 실적", refInvited: "초대", refEarned: "획득", refUnitMin: "분",
    hiwTitle: "이용 방법", hiwSub: "팀이 Flash Meet을 알도록 도우며 번역 분을 받으세요.",
    steps: [
      { t: "동료 초대", d: "내 추천 링크를 공유하세요." },
      { t: "친구 가입", d: "Flash Meet 계정을 만듭니다." },
      { t: "둘 다 적립", d: "본인과 동료가 각각 +120 번역 분을 받습니다." },
      { t: "반복", d: "성공 추천 무제한 — 계속 적립." },
    ],
    perfTitle: "내 추천 실적", perfSuccess: "성공 추천", perfEarned: "획득 분",
    perfRank: "추천 등급", rankNew: "신규", refEmpty: "아직 초대한 사람이 없습니다.",
    faqTitle: "자주 묻는 질문",
    plans: {
      free: { name: "Free", tagline: "무료 체험", cta: "시작하기", priceMonthly: "₩0",
        features: ["월 30분 번역", "대상 언어 1개", "기본 요약", "7일 기록"] },
      pro: { name: "Pro", tagline: "전문가용", cta: "Pro 업그레이드", tag: "가장 인기",
        priceMonthly: "₩12,900", origMonthly: "₩18,900", priceAnnual: "₩9,900", origAnnual: "₩15,900", annualTotal: "₩119,000",
        features: ["월 1,000분 번역 (~17시간)", "60개 이상 언어 & 양방향 모드", "자동 화자 분리 (Speaker 1, 2, 3…)", "전체 AI 요약 + 파일 다운로드", "무제한 기록"] },
      business: { name: "Business", tagline: "팀 & 기업용", cta: "Business 업그레이드",
        priceMonthly: "₩38,900", origMonthly: "₩57,900", priceAnnual: "₩30,900", origAnnual: "₩45,900", annualTotal: "₩373,000",
        features: ["월 5,000분 번역 (~83시간)", "Pro의 모든 기능", "콜센터 모드", "사용자 계정 5개", "맞춤 사전 + 우선 지원"] },
      enterprise: { name: "Enterprise", tagline: "맞춤 솔루션", cta: "문의하기",
        features: ["맞춤 번역 시간", "다중 사용자 + SSO", "맞춤 프롬프트 & 사전", "전담 지원 + SLA"] },
    },
    faq: [
      { q: "“번역 분”이란?", a: "실시간으로 번역되거나 요약된 오디오의 분 수. 30분 회의 = 번역 30분. 매월 초기화됩니다." },
      { q: "다국어와 양방향의 차이?", a: "다국어: 모든 음성을 감지해 1개 언어로 번역. 양방향: 두 언어를 선택하면 어느 쪽을 말해도 반대 언어로 표시." },
      { q: "연간 결제는 얼마나 절약되나요?", a: "연간 결제는 월간보다 20% 저렴 — 2개월 이상 무료와 같습니다." },
      { q: "분을 다 쓰면 어떻게 되나요?", a: "한도는 매월 초에 초기화됩니다 — 일회성이 아닙니다. 실제로 대부분의 사용자는 한도의 ~40%만 사용합니다. 더 필요하면 언제든 업그레이드, 즉시 적용됩니다." },
      { q: "변경하거나 해지할 수 있나요?", a: "네. 언제든 업/다운그레이드 또는 해지할 수 있으며, 결제 기간 종료까지 이용됩니다." },
    ],
  },
};

type QrInfo = { id: string; amount: number; content: string; confirmHours: number;
  bank: { name: string; account: string; holder: string }; qrUrl: string };

// Premium referral modal styles (Stripe/Linear-inspired). Class-based so :hover
// and keyframe entrance work (inline styles can't). CSS animation stands in for
// Framer Motion: opacity 0→1, scale .95→1, 0.25s.
const REF_CSS = `
@keyframes refFade{from{opacity:0}to{opacity:1}}
@keyframes refIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
@keyframes refPulse{0%{transform:scale(1)}50%{transform:scale(1.05)}100%{transform:scale(1)}}
.ref-overlay{position:fixed;inset:0;background:rgba(15,23,42,.45);backdrop-filter:blur(5px);display:grid;place-items:center;padding:18px;z-index:60;animation:refFade .2s ease}
.ref-modal{position:relative;width:100%;max-width:560px;background:#fff;border-radius:24px;padding:32px;box-shadow:0 20px 60px rgba(15,23,42,.12);font-family:'Inter',system-ui,-apple-system,sans-serif;max-height:94vh;overflow-y:auto;animation:refIn .25s cubic-bezier(.16,1,.3,1)}
.ref-x{position:absolute;top:20px;right:20px;width:32px;height:32px;border:none;background:#f1f5f9;border-radius:9px;color:#64748b;cursor:pointer;display:grid;place-items:center;transition:.15s}
.ref-x:hover{background:#e2e8f0;color:#0f172a}
.ref-badge{display:inline-block;background:#2563eb;color:#fff;font-size:12px;font-weight:600;letter-spacing:.01em;padding:6px 13px;border-radius:20px}
.ref-h{font-size:32px;font-weight:700;line-height:1.15;letter-spacing:-.02em;color:#0f172a;margin:18px 0 0}
.ref-sub{font-size:15px;line-height:1.6;color:#64748b;margin:12px 0 0;font-weight:450}
.ref-reward{display:flex;align-items:stretch;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:18px 22px;margin:22px 0 0}
.ref-rcol{flex:1;text-align:center}
.ref-rlabel{font-size:12.5px;font-weight:600;color:#64748b;margin-bottom:5px}
.ref-rval{font-size:21px;font-weight:700;color:#2563eb;letter-spacing:-.01em}
.ref-rdiv{width:1px;background:#e2e8f0;margin:2px 18px}
.ref-linklabel{font-size:12.5px;font-weight:600;color:#475569;margin:24px 0 8px}
.ref-linkrow{display:flex;gap:10px}
.ref-input{flex:1;min-width:0;height:56px;border:1px solid #cbd5e1;border-radius:14px;background:#f8fafc;padding:0 16px;font-family:inherit;font-size:14px;color:#334155;outline:none;transition:.15s}
.ref-input:focus{border-color:#93b4f5;background:#fff}
.ref-copy{height:56px;border:none;border-radius:14px;background:linear-gradient(135deg,#2563eb,#3b82f6);color:#fff;font-family:inherit;font-size:14px;font-weight:700;padding:0 22px;cursor:pointer;white-space:nowrap;transition:.18s;box-shadow:0 4px 14px rgba(37,99,235,.28)}
.ref-copy:hover{box-shadow:0 8px 24px rgba(37,99,235,.45)}
.ref-copy.ok{animation:refPulse .3s ease}
.ref-sharetitle{font-size:12.5px;font-weight:600;color:#475569;margin:24px 0 10px}
.ref-shares{display:flex;gap:10px}
.ref-ic{flex:1;height:50px;border:1px solid #e2e8f0;border-radius:12px;background:#fff;color:#475569;cursor:pointer;display:grid;place-items:center;transition:.16s}
.ref-ic:hover{border-color:#2563eb;color:#2563eb;background:#f8faff;transform:translateY(-1px)}
.ref-ic svg{width:19px;height:19px;fill:currentColor;display:block}
.ref-divider{height:1px;background:#eef2f7;margin:26px 0 0}
.ref-bottom{font-size:13px;line-height:1.6;color:#64748b;margin:18px 0 0;text-align:center}
.ref-cta{display:flex;align-items:center;gap:12px;margin:22px 0 0}
.ref-later{border:none;background:none;color:#64748b;font-family:inherit;font-size:14px;font-weight:600;padding:13px 18px;border-radius:12px;cursor:pointer;transition:.15s}
.ref-later:hover{background:#f1f5f9;color:#0f172a}
.ref-start{flex:1;border:none;border-radius:14px;background:linear-gradient(135deg,#2563eb,#3b82f6);color:#fff;font-family:inherit;font-size:15px;font-weight:700;padding:15px;cursor:pointer;box-shadow:0 6px 18px rgba(37,99,235,.3);transition:.18s}
.ref-start:hover{box-shadow:0 12px 30px rgba(37,99,235,.45);transform:translateY(-1px)}
@media(max-width:560px){.ref-modal{padding:24px}.ref-h{font-size:26px}}
`;

// Premium referral banner (Stripe/Linear/Notion-style enterprise card).
const REFBANNER_CSS = `
@keyframes refbIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.refb{max-width:1160px;margin:36px auto 0;background:#fff;border:1px solid #e2e8f0;border-radius:20px;padding:28px;
  box-shadow:0 1px 2px rgba(15,23,42,.04),0 10px 30px -22px rgba(15,23,42,.25);
  display:flex;align-items:center;gap:30px;flex-wrap:wrap;font-family:'Inter',system-ui,sans-serif;animation:refbIn .3s ease}
.refb-left{flex:1;min-width:280px}
.refb-badge{display:inline-block;background:#eff6ff;color:#2563eb;font-size:12px;font-weight:600;padding:5px 12px;border-radius:20px}
.refb-h{font-size:27px;font-weight:700;letter-spacing:-.02em;color:#0f172a;margin:14px 0 0;line-height:1.2}
.refb-sub{font-size:14px;line-height:1.6;color:#64748b;margin:9px 0 0;max-width:480px;font-weight:450}
.refb-metrics{display:flex;gap:14px}
.refb-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:16px 24px;text-align:center;min-width:124px;transition:.18s}
.refb-card:hover{transform:scale(1.02);box-shadow:0 12px 26px -18px rgba(15,23,42,.3);border-color:#cdd9ec}
.refb-clabel{font-size:12px;font-weight:600;color:#64748b}
.refb-cval{font-size:38px;font-weight:800;letter-spacing:-.03em;line-height:1.1;margin:3px 0 1px;
  background:linear-gradient(135deg,#2563eb,#3b82f6);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:#2563eb}
.refb-cunit{font-size:11px;font-weight:600;color:#94a3b8}
.refb-right{display:flex;flex-direction:column;gap:8px;min-width:172px}
.refb-cta{height:52px;border:none;border-radius:13px;background:linear-gradient(135deg,#2563eb,#3b82f6);color:#fff;
  font-family:inherit;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 6px 18px rgba(37,99,235,.28);transition:.18s}
.refb-cta:hover{transform:translateY(-2px);box-shadow:0 14px 32px rgba(37,99,235,.45)}
.refb-mut{font-size:12.5px;color:#94a3b8;text-align:center;font-weight:500}
.refb-stats{max-width:1160px;margin:14px auto 0;display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:0 6px;
  font-family:'Inter',system-ui,sans-serif;font-size:13px;color:#64748b;font-weight:500}
.refb-perf{font-weight:700;color:#475569}
.refb-stats b{color:#0f172a;font-weight:800}
.refb-dot{color:#cbd5e1}
@media(max-width:560px){.refb{padding:22px}.refb-h{font-size:23px}.refb-metrics{width:100%}.refb-card{flex:1}.refb-right{width:100%}}

/* How it works */
.hiw-wrap{max-width:1160px;margin:52px auto 0;font-family:'Inter',system-ui,sans-serif;animation:refbIn .3s ease}
.hiw-head{text-align:center;margin-bottom:26px}
.hiw-title{font-size:24px;font-weight:800;letter-spacing:-.02em;color:#0f172a}
.hiw-sub{font-size:14.5px;color:#64748b;margin-top:8px}
.hiw{display:flex;align-items:stretch;justify-content:center}
.hiw-card{flex:1;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:22px 20px;transition:.18s}
.hiw-card:hover{box-shadow:0 16px 32px -22px rgba(15,23,42,.32);transform:translateY(-3px);border-color:#cdd9ec}
.hiw-num{width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,#2563eb,#3b82f6);color:#fff;font-size:14px;font-weight:800;display:grid;place-items:center;margin-bottom:14px;box-shadow:0 4px 12px rgba(37,99,235,.3)}
.hiw-t{font-size:15px;font-weight:700;color:#0f172a;letter-spacing:-.01em}
.hiw-d{font-size:13px;line-height:1.55;color:#64748b;margin-top:5px}
.hiw-arrow{display:flex;align-items:center;color:#cbd5e1;font-size:24px;font-weight:400;padding:0 10px;flex:0 0 auto}
@media(max-width:760px){.hiw{flex-direction:column}.hiw-arrow{transform:rotate(90deg);justify-content:center;padding:4px 0}}

/* Referral performance */
.perf-wrap{max-width:1160px;margin:52px auto 0;font-family:'Inter',system-ui,sans-serif;animation:refbIn .3s ease}
.perf-title{font-size:24px;font-weight:800;letter-spacing:-.02em;color:#0f172a;text-align:center;margin-bottom:24px}
.perf-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.perf-card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:24px 18px;text-align:center;transition:.18s}
.perf-card:hover{box-shadow:0 16px 32px -22px rgba(15,23,42,.32);transform:translateY(-3px);border-color:#cdd9ec}
.perf-k{font-size:12.5px;font-weight:600;color:#64748b}
.perf-v{font-size:36px;font-weight:800;letter-spacing:-.03em;color:#0f172a;margin-top:6px;line-height:1.1}
.perf-v.grad{background:linear-gradient(135deg,#2563eb,#3b82f6);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:#2563eb}
.perf-empty{text-align:center;margin:20px 0 0}
.perf-empty p{font-size:14px;color:#64748b;margin:0 0 12px}
.perf-cta{height:48px;padding:0 28px;display:inline-block}
@media(max-width:760px){.perf-grid{grid-template-columns:repeat(2,1fr)}}

/* Compact FAQ accordion */
.faq2{max-width:760px;margin:52px auto 0;font-family:'Inter',system-ui,sans-serif}
.faq2-title{font-size:20px;font-weight:800;letter-spacing:-.02em;color:#0f172a;text-align:center;margin-bottom:18px}
.faq2 details{background:#fff;border:1px solid #e7ebf3;border-radius:12px;margin-bottom:8px;overflow:hidden}
.faq2 details[open]{border-color:#d6e0f0;box-shadow:0 10px 26px -22px rgba(15,23,42,.3)}
.faq2 summary{list-style:none;cursor:pointer;padding:15px 18px;font-size:14px;font-weight:700;color:#0f172a;display:flex;justify-content:space-between;align-items:center;gap:14px}
.faq2 summary::-webkit-details-marker{display:none}
.faq2 summary::after{content:"+";color:#94a3b8;font-size:19px;font-weight:500;line-height:1}
.faq2 details[open] summary::after{content:"\\2013"}
.faq2 .a{padding:0 18px 16px;font-size:13.5px;line-height:1.65;color:#64748b}
`;

export default function Pricing() {
  const [busy, setBusy] = useState("");
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [lang, setLang] = useLang();
  const t = T[lang];

  // Vietnamese bank-transfer (VietQR) flow
  const [qr, setQr] = useState<QrInfo | null>(null);
  const [qrBusy, setQrBusy] = useState(false);
  const [qrDone, setQrDone] = useState(false);
  const [invite, setInvite] = useState<{ link: string; bonus: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [refData, setRefData] = useState<{ link?: string; stats?: { invited: number; earned: number } } | null>(null);
  const fmtVnd = (n: number) => n.toLocaleString("vi-VN") + "đ";

  useEffect(() => {
    fetch("/api/referral").then((r) => (r.ok ? r.json() : null)).then((d) => { if (d) setRefData(d); }).catch(() => {});
    // Returning from login via "Invite Your Team"? Re-open the invite popup so the
    // flow continues seamlessly instead of dumping the user back on the page.
    if (new URLSearchParams(location.search).get("invite") === "1") {
      getInvite();
      window.history.replaceState({}, "", "/pricing");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function payVietQR(planId: string) {
    setQrBusy(true);
    try {
      const r = await fetch("/api/bank-payment", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", plan: planId, billing }),
      });
      const d = await r.json();
      if (r.status === 401) { location.href = "/login?next=" + encodeURIComponent("/pricing"); return; }
      if (!r.ok) throw new Error(d.error || "Không tạo được đơn");
      setQrDone(false); setQr(d);
    } catch (e: any) {
      alert(e.message);
    } finally { setQrBusy(false); }
  }
  async function confirmTransferred() {
    if (!qr) return;
    setQrBusy(true);
    try {
      await fetch("/api/bank-payment", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submitted", id: qr.id }),
      });
      setQrDone(true);
    } finally { setQrBusy(false); }
  }
  function copyContent() { if (qr) navigator.clipboard?.writeText(qr.content).catch(() => {}); }

  async function getInvite() {
    try {
      const r = await fetch("/api/referral");
      if (r.status === 401) { location.href = "/login?next=" + encodeURIComponent("/pricing?invite=1"); return; }
      const d = await r.json();
      if (d.link) { setCopied(false); setInvite({ link: d.link, bonus: d.bonus || 120 }); }
    } catch { /* ignore */ }
  }
  function copyInvite() {
    if (!invite) return;
    navigator.clipboard?.writeText(invite.link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }).catch(() => {});
  }
  function shareTo(net: string) {
    if (!invite) return;
    const e = encodeURIComponent, link = invite.link, text = t.refShareText;
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${e(link)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${e(link)}`,
      x: `https://twitter.com/intent/tweet?text=${e(text)}&url=${e(link)}`,
      telegram: `https://t.me/share/url?url=${e(link)}&text=${e(text)}`,
      whatsapp: `https://wa.me/?text=${e(text + " " + link)}`,
      email: `mailto:?subject=${e("Flash Meet")}&body=${e(text + "\n" + link)}`,
    };
    if (urls[net]) window.open(urls[net], "_blank", "noopener,noreferrer");
  }
  async function shareNative() {
    if (!invite) return;
    try { if ((navigator as any).share) await (navigator as any).share({ title: "Flash Meet", text: t.refShareText, url: invite.link }); else copyInvite(); } catch { /* cancelled */ }
  }

  async function choose(p: PlanBase) {
    if (p.id === "free") { location.href = "/"; return; }
    if (p.id === "enterprise") { location.href = "mailto:support@transflash.app?subject=Flash Meet Enterprise"; return; }
    setBusy(p.id);
    try {
      const r = await fetch(`/api/checkout?plan=${p.id}&billing=${billing}`, { method: "POST" });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Checkout unavailable");
      if (d.url) { location.href = d.url; return; }
      throw new Error("Missing checkout link");
    } catch (e: any) {
      alert(e.message + "\n\n(Payment activates once Lemon Squeezy is configured.)");
      setBusy("");
    }
  }

  return (
    <main style={S.wrap}>
      <div style={S.topRow}>
        <a href="/" style={S.back}>{t.back}</a>
        <LangSwitch lang={lang} onChange={setLang} />
      </div>

      <header style={S.head}>
        <span style={S.eyebrow}>{t.eyebrow}</span>
        <h1 style={S.h1}>{t.h1}</h1>
        <p style={S.sub}>{t.sub}</p>
      </header>

      <div style={S.promo}>{t.promo}</div>

      <div style={S.billRow}>
        <button onClick={() => setBilling("monthly")} style={{ ...S.billBtn, ...(billing === "monthly" ? S.billOn : {}) }}>{t.monthly}</button>
        <button onClick={() => setBilling("annual")} style={{ ...S.billBtn, ...(billing === "annual" ? S.billOn : {}) }}>
          {t.annual} <span style={S.save}>-20%</span>
        </button>
      </div>

      <section style={S.grid}>
        {PLANS.map((p) => {
          const tx = t.plans[p.id];
          const isPaid = p.id === "pro" || p.id === "business";
          const price = p.id === "enterprise"
            ? t.contact
            : (billing === "annual" && tx.priceAnnual ? tx.priceAnnual : tx.priceMonthly);
          const orig = billing === "annual" ? tx.origAnnual : tx.origMonthly;
          return (
            <div key={p.id} style={{ ...S.card, ...(p.highlight ? S.cardHi : {}) }}>
              {tx.tag && <div style={S.tag}>{tx.tag}</div>}
              <div style={S.name}>{tx.name}</div>
              <div style={S.tagline}>{tx.tagline}</div>
              {isPaid && orig && <div style={S.origRow}><span style={S.orig}>{orig}</span><span style={S.off}>-33%</span></div>}
              <div style={S.priceRow}>
                <span style={S.price}>{price}</span>
                {isPaid && <span style={S.period}>{t.period}</span>}
              </div>
              <div style={S.annualNote}>
                {billing === "annual" && isPaid && tx.annualTotal ? t.billedYear(tx.annualTotal) : " "}
              </div>
              <button onClick={() => choose(p)} disabled={busy === p.id} style={{ ...S.cta, ...(p.highlight ? S.ctaHi : {}) }}>
                {busy === p.id ? t.busy : tx.cta}
              </button>
              {lang === "vi" && isPaid && (
                <button onClick={() => payVietQR(p.id)} disabled={qrBusy} style={S.qrBtn}>
                  🏦 Chuyển khoản QR ngân hàng
                </button>
              )}
              <ul style={S.feats}>
                {tx.features.map((f) => (
                  <li key={f} style={S.feat}><span style={S.check}>✓</span><span>{f}</span></li>
                ))}
              </ul>
              {USAGE[lang][p.id] && (
                <div style={{ ...S.usageBox, ...(p.highlight ? S.usageBoxHi : {}) }}>
                  <div style={S.usageHd}>⏱ {t.usageTitle}</div>
                  {USAGE[lang][p.id].map((u) => (
                    <div key={u} style={S.usageRow}>{u}</div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>

      <div style={S.reassure}>{t.reassure}</div>

      <div style={S.trust}>
        {t.trust.map((x, i) => (
          <span key={x} style={{ display: "inline-flex", gap: 10 }}>
            {i > 0 && <span style={S.dot}>·</span>}{x}
          </span>
        ))}
      </div>

      <style>{REFBANNER_CSS}</style>
      <div className="refb">
        <div className="refb-left">
          <span className="refb-badge">{t.refProgram}</span>
          <div className="refb-h">{t.refBannerH}</div>
          <p className="refb-sub">{t.refBannerSub}</p>
        </div>
        <div className="refb-metrics">
          <div className="refb-card">
            <div className="refb-clabel">{t.refYouEarn}</div>
            <div className="refb-cval">+120</div>
            <div className="refb-cunit">{t.refUnitMin}</div>
          </div>
          <div className="refb-card">
            <div className="refb-clabel">{t.refFriendEarns}</div>
            <div className="refb-cval">+120</div>
            <div className="refb-cunit">{t.refUnitMin}</div>
          </div>
        </div>
        <div className="refb-right">
          <button className="refb-cta" onClick={getInvite}>{t.refInviteTeam}</button>
          <div className="refb-mut">{t.refUnlimited}</div>
        </div>
      </div>
      <section className="hiw-wrap">
        <div className="hiw-head">
          <div className="hiw-title">{t.hiwTitle}</div>
          <div className="hiw-sub">{t.hiwSub}</div>
        </div>
        <div className="hiw">
          {t.steps.map((s, i) => (
            <Fragment key={i}>
              <div className="hiw-card">
                <div className="hiw-num">{i + 1}</div>
                <div className="hiw-t">{s.t}</div>
                <div className="hiw-d">{s.d}</div>
              </div>
              {i < t.steps.length - 1 && <div className="hiw-arrow">›</div>}
            </Fragment>
          ))}
        </div>
      </section>

      {(() => {
        const invited = refData?.stats?.invited ?? 0;
        const earned = refData?.stats?.earned ?? 0;
        const rankName = invited >= 10 ? "Platinum" : invited >= 6 ? "Gold" : invited >= 3 ? "Silver" : invited >= 1 ? "Bronze" : t.rankNew;
        return (
          <section className="perf-wrap">
            <div className="perf-title">{t.perfTitle}</div>
            <div className="perf-grid">
              <div className="perf-card"><div className="perf-k">{t.refInvited}</div><div className="perf-v">{invited}</div></div>
              <div className="perf-card"><div className="perf-k">{t.perfSuccess}</div><div className="perf-v">{invited}</div></div>
              <div className="perf-card"><div className="perf-k">{t.perfEarned}</div><div className="perf-v grad">{earned.toLocaleString()}</div></div>
              <div className="perf-card"><div className="perf-k">{t.perfRank}</div><div className="perf-v">{rankName}</div></div>
            </div>
            {invited === 0 && (
              <div className="perf-empty">
                <p>{t.refEmpty}</p>
                <button className="refb-cta perf-cta" onClick={getInvite}>{t.refInviteTeam}</button>
              </div>
            )}
          </section>
        );
      })()}

      <section className="faq2">
        <div className="faq2-title">{t.faqTitle}</div>
        {t.faq.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <div className="a">{f.a}</div>
          </details>
        ))}
      </section>

      {invite && (
        <>
          <style>{REF_CSS}</style>
          <div className="ref-overlay" onClick={() => setInvite(null)}>
            <div className="ref-modal" onClick={(e) => e.stopPropagation()}>
              <button className="ref-x" onClick={() => setInvite(null)} aria-label="Close">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
              <span className="ref-badge">{t.refBadge}</span>
              <h2 className="ref-h">{t.refH1}<br />{t.refH2}</h2>
              <p className="ref-sub">{t.refSubhead}</p>

              <div className="ref-reward">
                <div className="ref-rcol"><div className="ref-rlabel">{t.refYouEarn}</div><div className="ref-rval">{t.refMinutes}</div></div>
                <div className="ref-rdiv" />
                <div className="ref-rcol"><div className="ref-rlabel">{t.refFriendEarns}</div><div className="ref-rval">{t.refMinutes}</div></div>
              </div>

              <div className="ref-linklabel">{t.refYourLink}</div>
              <div className="ref-linkrow">
                <input className="ref-input" readOnly value={invite.link} onFocus={(e) => e.currentTarget.select()} />
                <button className={"ref-copy" + (copied ? " ok" : "")} onClick={copyInvite}>{copied ? "✓ " + t.refCopied : t.refCopyBtn}</button>
              </div>

              <div className="ref-sharetitle">{t.refShareTitle}</div>
              <div className="ref-shares">
                <button className="ref-ic" title="Facebook" onClick={() => shareTo("facebook")}><svg viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" /></svg></button>
                <button className="ref-ic" title="LinkedIn" onClick={() => shareTo("linkedin")}><svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" /></svg></button>
                <button className="ref-ic" title="X" onClick={() => shareTo("x")}><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg></button>
                <button className="ref-ic" title="Telegram" onClick={() => shareTo("telegram")}><svg viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg></button>
                <button className="ref-ic" title="WhatsApp" onClick={() => shareTo("whatsapp")}><svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg></button>
                <button className="ref-ic" title="Email" onClick={() => shareTo("email")}><svg viewBox="0 0 24 24"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" /></svg></button>
              </div>

              <div className="ref-divider" />
              <p className="ref-bottom">{t.refBottom}</p>
              <div className="ref-cta">
                <button className="ref-later" onClick={() => setInvite(null)}>{t.refLater}</button>
                <button className="ref-start" onClick={shareNative}>{t.refStart}</button>
              </div>
            </div>
          </div>
        </>
      )}

      {qr && (
        <div style={S.modalWrap} onClick={() => setQr(null)}>
          <div style={S.modal} onClick={(e) => e.stopPropagation()}>
            <button style={S.modalX} onClick={() => setQr(null)}>×</button>
            {!qrDone ? (
              <>
                <div style={S.modalTitle}>Chuyển khoản QR ngân hàng</div>
                <p style={S.modalSub}>Quét mã bằng app ngân hàng — số tiền & nội dung đã điền sẵn.</p>
                <img src={qr.qrUrl} alt="VietQR" style={S.qrImg} />
                <div style={S.bankBox}>
                  <Row label="Ngân hàng" value={qr.bank.name} />
                  <Row label="Số tài khoản" value={qr.bank.account} />
                  <Row label="Chủ tài khoản" value={qr.bank.holder} />
                  <Row label="Số tiền" value={fmtVnd(qr.amount)} strong />
                  <div style={S.contentRow}>
                    <div>
                      <div style={S.bankLabel}>Nội dung chuyển khoản</div>
                      <div style={S.contentCode}>{qr.content}</div>
                    </div>
                    <button style={S.copyBtn} onClick={copyContent}>Copy</button>
                  </div>
                </div>
                <p style={S.warn}>⚠ Chuyển <b>đúng số tiền</b> và <b>đúng nội dung</b> để được xác nhận tự động nhanh nhất.</p>
                <button style={S.modalCta} onClick={confirmTransferred} disabled={qrBusy}>
                  {qrBusy ? "Đang gửi…" : "Tôi đã chuyển khoản"}
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <div style={{ fontSize: 44, marginBottom: 10 }}>✅</div>
                <div style={S.modalTitle}>Đã ghi nhận yêu cầu!</div>
                <p style={S.modalSub}>
                  Admin sẽ kiểm tra và kích hoạt gói cho bạn <b>trong vòng {qr.confirmHours} giờ</b>.
                  Một email xác nhận đã được gửi tới bạn.
                </p>
                <button style={S.modalCta} onClick={() => setQr(null)}>Đóng</button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={S.bankRow}>
      <span style={S.bankLabel}>{label}</span>
      <span style={{ fontWeight: strong ? 900 : 700, fontSize: strong ? 16 : 14 }}>{value}</span>
    </div>
  );
}

const FONT = "'Inter',system-ui,-apple-system,sans-serif";
const S: Record<string, React.CSSProperties> = {
  wrap: { minHeight: "100vh", padding: "20px 22px 70px", fontFamily: FONT, color: "#0a1124",
    background: "radial-gradient(1100px 560px at 50% -12%,rgba(31,107,255,.10),transparent 62%),#fbfcfe",
    WebkitFontSmoothing: "antialiased" },
  topRow: { display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1160, margin: "0 auto 8px" },
  back: { display: "inline-block", fontSize: 13, fontWeight: 600, color: "#5b6b8c", textDecoration: "none" },
  head: { textAlign: "center", maxWidth: 620, margin: "10px auto 22px" },
  eyebrow: { display: "inline-block", fontSize: 11.5, fontWeight: 800, letterSpacing: ".14em", color: "#1f6bff",
    background: "#eef4ff", border: "1px solid #d9e6ff", borderRadius: 30, padding: "5px 13px", marginBottom: 16 },
  h1: { fontSize: 40, fontWeight: 900, letterSpacing: "-.045em", lineHeight: 1.05, marginBottom: 14 },
  sub: { fontSize: 15.5, color: "#5b6b8c", lineHeight: 1.6, fontWeight: 500 },
  billRow: { display: "flex", justifyContent: "center", gap: 6, background: "#eef1f7", border: "1px solid #e3e8f2",
    borderRadius: 30, padding: 4, width: "fit-content", margin: "0 auto 34px" },
  billBtn: { border: "none", background: "transparent", cursor: "pointer", fontFamily: FONT, fontSize: 13.5,
    fontWeight: 800, color: "#5b6b8c", padding: "9px 20px", borderRadius: 26, transition: ".15s",
    display: "inline-flex", alignItems: "center", gap: 7 },
  billOn: { background: "#fff", color: "#0a1124", boxShadow: "0 4px 12px -4px rgba(10,17,36,.25)" },
  save: { fontSize: 10.5, fontWeight: 800, color: "#16a34a", background: "#e7f8ee", borderRadius: 20, padding: "2px 7px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(248px,1fr))", gap: 16, maxWidth: 1160, margin: "0 auto" },
  card: { position: "relative", background: "#fff", border: "1px solid #e7ebf3", borderRadius: 20, padding: "28px 24px",
    boxShadow: "0 16px 40px -30px rgba(10,17,36,.4)", display: "flex", flexDirection: "column", transition: ".2s" },
  cardHi: { border: "1.5px solid #1f6bff", boxShadow: "0 30px 60px -28px rgba(31,107,255,.45)", transform: "translateY(-6px)" },
  tag: { position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap",
    background: "linear-gradient(135deg,#3b82f6,#1f4fff)", color: "#fff", fontSize: 11, fontWeight: 800,
    letterSpacing: ".02em", padding: "5px 14px", borderRadius: 30, boxShadow: "0 8px 18px -6px rgba(31,79,255,.6)" },
  name: { fontSize: 19, fontWeight: 800, letterSpacing: "-.02em" },
  tagline: { fontSize: 12.5, color: "#7b88a3", marginTop: 4, minHeight: 32, lineHeight: 1.4, fontWeight: 500 },
  promo: { display: "block", margin: "0 auto 18px", textAlign: "center", width: "fit-content", maxWidth: "92%",
    fontSize: 13, fontWeight: 800, color: "#b45309", background: "linear-gradient(135deg,#fff7ed,#fffbeb)",
    border: "1px solid #fcd9a8", borderRadius: 30, padding: "8px 18px" },
  origRow: { display: "flex", alignItems: "center", gap: 8, marginTop: 8 },
  orig: { fontSize: 16, color: "#9aa6bd", fontWeight: 700, textDecoration: "line-through" },
  off: { fontSize: 11, fontWeight: 800, color: "#16a34a", background: "#e7f8ee", borderRadius: 20, padding: "2px 8px" },
  priceRow: { display: "flex", alignItems: "baseline", gap: 5, margin: "2px 0 2px", flexWrap: "wrap" },
  price: { fontSize: 32, fontWeight: 900, letterSpacing: "-.04em" },
  period: { fontSize: 13.5, color: "#9aa6bd", fontWeight: 600 },
  annualNote: { fontSize: 11.5, color: "#16a34a", fontWeight: 700, minHeight: 17, marginBottom: 14 },
  cta: { width: "100%", border: "1.5px solid #e3e8f2", background: "#fff", color: "#0a1124", cursor: "pointer",
    fontFamily: FONT, fontSize: 14.5, fontWeight: 800, padding: "13px", borderRadius: 12, marginBottom: 20, transition: ".15s" },
  ctaHi: { background: "linear-gradient(135deg,#3b82f6,#1f4fff)", color: "#fff", border: "1.5px solid transparent",
    boxShadow: "0 12px 26px -10px rgba(31,79,255,.6)" },
  feats: { listStyle: "none", display: "flex", flexDirection: "column", gap: 11 },
  feat: { fontSize: 13.5, color: "#2a3550", display: "flex", alignItems: "flex-start", gap: 9, lineHeight: 1.5, fontWeight: 500 },
  check: { color: "#16a34a", fontWeight: 900, flexShrink: 0, fontSize: 13 },
  usageBox: { marginTop: 16, padding: "12px 14px", background: "#f7faff", border: "1px solid #e6eef9", borderRadius: 12 },
  usageBoxHi: { background: "#eef4ff", border: "1px solid #d6e4ff" },
  usageHd: { fontSize: 11, fontWeight: 800, color: "#1f6bff", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 7 },
  usageRow: { fontSize: 13, color: "#33405c", fontWeight: 600, lineHeight: 1.65 },
  reassure: { maxWidth: 680, margin: "26px auto 0", textAlign: "center", fontSize: 13.5, fontWeight: 600,
    color: "#5b6b8c", background: "#fff", border: "1px solid #e7ebf3", borderRadius: 12, padding: "12px 18px", lineHeight: 1.55 },
  trust: { display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 30,
    fontSize: 13, color: "#5b6b8c", fontWeight: 600 },
  dot: { color: "#cdd5e4" },
  refBox: { display: "flex", alignItems: "center", gap: 16, maxWidth: 860, margin: "34px auto 0",
    background: "linear-gradient(135deg,#eef4ff,#f7faff)", border: "1px solid #d9e6ff", borderRadius: 18, padding: "20px 22px", flexWrap: "wrap" },
  refIcon: { fontSize: 30 },
  refTitle: { fontSize: 16, fontWeight: 800, letterSpacing: "-.01em", marginBottom: 4 },
  refSub: { fontSize: 12.5, color: "#5b6b8c", lineHeight: 1.55, fontWeight: 500 },
  refCta: { fontSize: 13.5, fontWeight: 800, color: "#fff", background: "#1f6bff", textDecoration: "none",
    padding: "11px 18px", borderRadius: 11, whiteSpace: "nowrap", border: "none", cursor: "pointer", fontFamily: FONT },
  faqWrap: { maxWidth: 860, margin: "30px auto 0", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 12 },
  faqItem: { background: "#fff", border: "1px solid #e7ebf3", borderRadius: 14, padding: "16px 18px" },
  faqQ: { fontSize: 13.5, fontWeight: 800, marginBottom: 6, letterSpacing: "-.01em" },
  faqA: { fontSize: 12.5, color: "#6b7690", lineHeight: 1.6, fontWeight: 500 },
  qrBtn: { width: "100%", border: "1.5px solid #d3e0fb", background: "#f4f8ff", color: "#1f4fff", cursor: "pointer",
    fontFamily: FONT, fontSize: 13, fontWeight: 800, padding: "10px", borderRadius: 11, marginTop: -8, marginBottom: 20 },
  modalWrap: { position: "fixed", inset: 0, background: "rgba(10,17,36,.55)", display: "grid", placeItems: "center",
    padding: 18, zIndex: 50, backdropFilter: "blur(3px)" },
  modal: { position: "relative", width: "100%", maxWidth: 380, background: "#fff", borderRadius: 20,
    padding: "26px 24px", boxShadow: "0 40px 80px -20px rgba(10,17,36,.5)", maxHeight: "92vh", overflowY: "auto" },
  modalX: { position: "absolute", top: 12, right: 14, border: "none", background: "none", fontSize: 24,
    color: "#9aa6bd", cursor: "pointer", lineHeight: 1, fontWeight: 700 },
  modalTitle: { fontSize: 18, fontWeight: 900, letterSpacing: "-.02em", marginBottom: 4 },
  modalSub: { fontSize: 13, color: "#5b6b8c", lineHeight: 1.55, marginBottom: 16 },
  qrImg: { display: "block", width: 200, height: 200, margin: "0 auto 16px", border: "1px solid #e7ebf3", borderRadius: 14 },
  bankBox: { background: "#f7faff", border: "1px solid #e3e8f2", borderRadius: 14, padding: "12px 14px", marginBottom: 14 },
  bankRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid #eef2f9" },
  bankLabel: { fontSize: 12, color: "#7b88a3", fontWeight: 600 },
  contentRow: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 9 },
  contentCode: { fontFamily: "'Space Mono',monospace", fontSize: 15, fontWeight: 800, color: "#1f4fff", letterSpacing: ".01em" },
  copyBtn: { border: "1px solid #d3e0fb", background: "#fff", color: "#1f4fff", cursor: "pointer", fontFamily: FONT,
    fontSize: 12, fontWeight: 800, padding: "7px 12px", borderRadius: 9 },
  warn: { fontSize: 12, color: "#b45309", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10,
    padding: "9px 12px", lineHeight: 1.5, marginBottom: 16 },
  modalCta: { width: "100%", border: "none", background: "linear-gradient(135deg,#3b82f6,#1f4fff)", color: "#fff",
    cursor: "pointer", fontFamily: FONT, fontSize: 14.5, fontWeight: 800, padding: "13px", borderRadius: 12,
    boxShadow: "0 12px 26px -10px rgba(31,79,255,.6)" },
  // referral modal
  invGift: { fontSize: 40, textAlign: "center", marginBottom: 4 },
  invReward: { textAlign: "center", fontSize: 13.5, fontWeight: 800, color: "#16a34a", background: "#e7f8ee",
    border: "1px solid #bcebcd", borderRadius: 30, padding: "8px 14px", margin: "10px auto 18px", width: "fit-content" },
  invLinkLabel: { fontSize: 12, fontWeight: 700, color: "#7b88a3", marginBottom: 7 },
  invLinkRow: { display: "flex", gap: 8, marginBottom: 16 },
  invInput: { flex: 1, minWidth: 0, border: "1px solid #e3e8f2", borderRadius: 10, padding: "11px 12px",
    fontFamily: FONT, fontSize: 13, color: "#33405c", background: "#f7faff", outline: "none" },
  invCopy: { border: "none", background: "#1f6bff", color: "#fff", cursor: "pointer", fontFamily: FONT,
    fontSize: 13, fontWeight: 800, padding: "0 16px", borderRadius: 10, whiteSpace: "nowrap" },
  invCopyOk: { background: "#16a34a" },
  shareGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 },
  shareBtn: { border: "none", color: "#fff", cursor: "pointer", fontFamily: FONT, fontSize: 12.5, fontWeight: 800,
    padding: "10px 6px", borderRadius: 10 },
  invNote: { fontSize: 12, color: "#7b88a3", lineHeight: 1.55, marginTop: 16, textAlign: "center" },
};
