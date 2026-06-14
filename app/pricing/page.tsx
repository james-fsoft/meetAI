"use client";

import { useState } from "react";
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
  priceMonthly?: string; priceAnnual?: string; annualTotal?: string;
};
type Dict = {
  back: string; eyebrow: string; h1: string; sub: string;
  monthly: string; annual: string; period: string; contact: string;
  billedYear: (x: string) => string; busy: string;
  trust: string[];
  refTitle: string; refSub: string; refCta: string;
  plans: Record<string, PlanText>;
  faq: { q: string; a: string }[];
};

const T: Record<Lang, Dict> = {
  en: {
    back: "← Back to app", eyebrow: "PRICING", h1: "Transparent pricing, no hidden fees",
    sub: "Every plan includes real-time translation minutes and AI summaries. Cancel anytime.",
    monthly: "Monthly", annual: "Annual", period: "/ mo", contact: "Contact",
    billedYear: (x) => `Billed ${x} / year`, busy: "Opening…",
    trust: ["✓ Cancel anytime", "✓ No hidden fees", "✓ Private — we don't sell data"],
    refTitle: "Invite friends — you both get 60 minutes",
    refSub: "Share your referral link. When a friend signs up, you both get 60 free translation minutes. No limit on invites.",
    refCta: "Get invite link →",
    plans: {
      free: { name: "Free", tagline: "Free to try", cta: "Get started", priceMonthly: "$0",
        features: ["30 translation min / month", "1 target language", "Basic summary", "7-day history"] },
      pro: { name: "Pro", tagline: "For professionals", cta: "Upgrade to Pro", tag: "Most popular",
        priceMonthly: "$7.99", priceAnnual: "$6.39", annualTotal: "$76.99",
        features: ["600 translation min / month (~10 hrs)", "60+ languages & two-way mode", "Automatic speaker separation (Speaker 1, 2, 3…)", "Full AI summary + file download", "Unlimited history"] },
      business: { name: "Business", tagline: "For teams & businesses", cta: "Upgrade to Business",
        priceMonthly: "$23.99", priceAnnual: "$19.19", annualTotal: "$229.99",
        features: ["2,400 translation min / month (~40 hrs)", "Everything in Pro", "Call Center mode", "5 user accounts", "Custom glossary + priority support"] },
      enterprise: { name: "Enterprise", tagline: "Custom solution", cta: "Contact us",
        features: ["Custom translation minutes", "Multiple users + SSO", "Custom prompts & glossary", "Dedicated support + SLA"] },
    },
    faq: [
      { q: "What is a “translation minute”?", a: "Minutes of audio translated live or summarized. A 30-min meeting = 30 translation minutes. The quota resets every month." },
      { q: "Multi-language vs two-way?", a: "Multi-language: auto-detects any speech and translates into 1 language. Two-way: pick 2 languages — speak either and it shows the other." },
      { q: "How much does annual save?", a: "Annual billing is 20% cheaper than monthly — like getting 2+ months free." },
      { q: "Can I change or cancel?", a: "Yes. Upgrade, downgrade or cancel anytime; you keep access until the paid period ends." },
    ],
  },
  vi: {
    back: "← Quay lại app", eyebrow: "BẢNG GIÁ", h1: "Giá minh bạch, không phí ẩn",
    sub: "Mọi gói đã gồm phút dịch real-time và tóm tắt AI. Huỷ bất cứ lúc nào.",
    monthly: "Theo tháng", annual: "Theo năm", period: "/ tháng", contact: "Liên hệ",
    billedYear: (x) => `Thanh toán ${x} / năm`, busy: "Đang mở…",
    trust: ["✓ Huỷ bất cứ lúc nào", "✓ Không phí ẩn", "✓ Bảo mật — không bán dữ liệu"],
    refTitle: "Mời bạn bè — cả hai cùng được tặng 60 phút",
    refSub: "Chia sẻ link giới thiệu của bạn. Khi bạn bè đăng ký, cả hai nhận thêm 60 phút dịch miễn phí. Không giới hạn số lượt mời.",
    refCta: "Lấy link mời →",
    plans: {
      free: { name: "Free", tagline: "Dùng thử miễn phí", cta: "Bắt đầu", priceMonthly: "0đ",
        features: ["30 phút dịch / tháng", "1 ngôn ngữ đích", "Tóm tắt cơ bản", "Lịch sử 7 ngày"] },
      pro: { name: "Pro", tagline: "Cho cá nhân chuyên nghiệp", cta: "Nâng cấp Pro", tag: "Phổ biến nhất",
        priceMonthly: "199.000đ", priceAnnual: "159.000đ", annualTotal: "1.910.000đ",
        features: ["600 phút dịch / tháng (~10 giờ)", "Đa ngôn ngữ 60+ & chế độ song ngữ", "Tách giọng tự động (Speaker 1, 2, 3…)", "Tóm tắt AI đầy đủ + tải file", "Lịch sử không giới hạn"] },
      business: { name: "Business", tagline: "Cho đội nhóm & doanh nghiệp", cta: "Nâng cấp Business",
        priceMonthly: "599.000đ", priceAnnual: "479.000đ", annualTotal: "5.750.000đ",
        features: ["2.400 phút dịch / tháng (~40 giờ)", "Toàn bộ tính năng Pro", "Call Center mode", "5 tài khoản người dùng", "Từ điển riêng + hỗ trợ ưu tiên"] },
      enterprise: { name: "Enterprise", tagline: "Giải pháp theo nhu cầu", cta: "Liên hệ",
        features: ["Phút dịch tuỳ chỉnh", "Nhiều người dùng + SSO", "Tuỳ chỉnh prompt & từ điển", "Dedicated support + SLA"] },
    },
    faq: [
      { q: "“Phút dịch” là gì?", a: "Số phút âm thanh được dịch trực tiếp hoặc tạo biên bản. Họp 30 phút = 30 phút dịch. Hạn mức làm mới mỗi tháng." },
      { q: "Đa ngôn ngữ và song ngữ khác gì?", a: "Đa ngôn ngữ: tự nhận diện rồi dịch sang 1 ngôn ngữ. Song ngữ: chọn 2 ngôn ngữ, nói tiếng nào ra tiếng còn lại." },
      { q: "Trả theo năm tiết kiệm bao nhiêu?", a: "Trả theo năm được giảm 20% so với trả tháng — tương đương được tặng hơn 2 tháng dùng miễn phí." },
      { q: "Đổi hoặc huỷ gói được không?", a: "Được. Nâng/hạ/huỷ bất cứ lúc nào, dùng đến hết chu kỳ đã thanh toán." },
    ],
  },
  ko: {
    back: "← 앱으로", eyebrow: "요금제", h1: "투명한 가격, 숨은 비용 없음",
    sub: "모든 요금제에 실시간 번역 시간과 AI 요약이 포함됩니다. 언제든 해지 가능합니다.",
    monthly: "월간", annual: "연간", period: "/ 월", contact: "문의",
    billedYear: (x) => `연 ${x} 청구`, busy: "여는 중…",
    trust: ["✓ 언제든 해지", "✓ 숨은 비용 없음", "✓ 데이터 미판매"],
    refTitle: "친구 초대 — 둘 다 60분 추가",
    refSub: "추천 링크를 공유하세요. 친구가 가입하면 둘 다 60분 무료 번역을 받습니다. 초대 횟수 제한 없음.",
    refCta: "초대 링크 받기 →",
    plans: {
      free: { name: "Free", tagline: "무료 체험", cta: "시작하기", priceMonthly: "₩0",
        features: ["월 30분 번역", "대상 언어 1개", "기본 요약", "7일 기록"] },
      pro: { name: "Pro", tagline: "전문가용", cta: "Pro 업그레이드", tag: "가장 인기",
        priceMonthly: "₩9,900", priceAnnual: "₩7,900", annualTotal: "₩94,900",
        features: ["월 600분 번역 (~10시간)", "60개 이상 언어 & 양방향 모드", "자동 화자 분리 (Speaker 1, 2, 3…)", "전체 AI 요약 + 파일 다운로드", "무제한 기록"] },
      business: { name: "Business", tagline: "팀 & 기업용", cta: "Business 업그레이드",
        priceMonthly: "₩29,900", priceAnnual: "₩23,900", annualTotal: "₩286,900",
        features: ["월 2,400분 번역 (~40시간)", "Pro의 모든 기능", "콜센터 모드", "사용자 계정 5개", "맞춤 사전 + 우선 지원"] },
      enterprise: { name: "Enterprise", tagline: "맞춤 솔루션", cta: "문의하기",
        features: ["맞춤 번역 시간", "다중 사용자 + SSO", "맞춤 프롬프트 & 사전", "전담 지원 + SLA"] },
    },
    faq: [
      { q: "“번역 분”이란?", a: "실시간으로 번역되거나 요약된 오디오의 분 수. 30분 회의 = 번역 30분. 매월 초기화됩니다." },
      { q: "다국어와 양방향의 차이?", a: "다국어: 모든 음성을 감지해 1개 언어로 번역. 양방향: 두 언어를 선택하면 어느 쪽을 말해도 반대 언어로 표시." },
      { q: "연간 결제는 얼마나 절약되나요?", a: "연간 결제는 월간보다 20% 저렴 — 2개월 이상 무료와 같습니다." },
      { q: "변경하거나 해지할 수 있나요?", a: "네. 언제든 업/다운그레이드 또는 해지할 수 있으며, 결제 기간 종료까지 이용됩니다." },
    ],
  },
};

type QrInfo = { id: string; amount: number; content: string; confirmHours: number;
  bank: { name: string; account: string; holder: string }; qrUrl: string };

export default function Pricing() {
  const [busy, setBusy] = useState("");
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [lang, setLang] = useLang();
  const t = T[lang];

  // Vietnamese bank-transfer (VietQR) flow
  const [qr, setQr] = useState<QrInfo | null>(null);
  const [qrBusy, setQrBusy] = useState(false);
  const [qrDone, setQrDone] = useState(false);
  const fmtVnd = (n: number) => n.toLocaleString("vi-VN") + "đ";

  async function payVietQR(planId: string) {
    setQrBusy(true);
    try {
      const r = await fetch("/api/bank-payment", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", plan: planId, billing }),
      });
      const d = await r.json();
      if (r.status === 401) { location.href = "/login"; return; }
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
          return (
            <div key={p.id} style={{ ...S.card, ...(p.highlight ? S.cardHi : {}) }}>
              {tx.tag && <div style={S.tag}>{tx.tag}</div>}
              <div style={S.name}>{tx.name}</div>
              <div style={S.tagline}>{tx.tagline}</div>
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
            </div>
          );
        })}
      </section>

      <div style={S.trust}>
        {t.trust.map((x, i) => (
          <span key={x} style={{ display: "inline-flex", gap: 10 }}>
            {i > 0 && <span style={S.dot}>·</span>}{x}
          </span>
        ))}
      </div>

      <section style={S.refBox}>
        <div style={S.refIcon}>🎁</div>
        <div style={{ flex: 1 }}>
          <div style={S.refTitle}>{t.refTitle}</div>
          <div style={S.refSub}>{t.refSub}</div>
        </div>
        <a href="/" style={S.refCta}>{t.refCta}</a>
      </section>

      <section style={S.faqWrap}>
        {t.faq.map((f) => (
          <div key={f.q} style={S.faqItem}>
            <div style={S.faqQ}>{f.q}</div>
            <div style={S.faqA}>{f.a}</div>
          </div>
        ))}
      </section>

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
  priceRow: { display: "flex", alignItems: "baseline", gap: 5, margin: "8px 0 2px", flexWrap: "wrap" },
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
  trust: { display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 30,
    fontSize: 13, color: "#5b6b8c", fontWeight: 600 },
  dot: { color: "#cdd5e4" },
  refBox: { display: "flex", alignItems: "center", gap: 16, maxWidth: 860, margin: "34px auto 0",
    background: "linear-gradient(135deg,#eef4ff,#f7faff)", border: "1px solid #d9e6ff", borderRadius: 18, padding: "20px 22px", flexWrap: "wrap" },
  refIcon: { fontSize: 30 },
  refTitle: { fontSize: 16, fontWeight: 800, letterSpacing: "-.01em", marginBottom: 4 },
  refSub: { fontSize: 12.5, color: "#5b6b8c", lineHeight: 1.55, fontWeight: 500 },
  refCta: { fontSize: 13.5, fontWeight: 800, color: "#fff", background: "#1f6bff", textDecoration: "none",
    padding: "11px 18px", borderRadius: 11, whiteSpace: "nowrap" },
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
};
