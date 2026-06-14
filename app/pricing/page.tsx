"use client";

import { useState } from "react";

type Plan = {
  id: string; name: string; tagline: string;
  priceMonthly: string;           // per-month price, monthly billing
  priceAnnual?: string;           // per-month price, when billed annually
  annualTotal?: string;           // full amount charged once per year
  period: string;
  tag?: string; highlight?: boolean; cta: string; features: string[];
};

const PLANS: Plan[] = [
  {
    id: "free", name: "Free", tagline: "Dùng thử miễn phí", priceMonthly: "0", period: "đ", cta: "Bắt đầu",
    features: ["30 phút dịch / tháng", "1 ngôn ngữ đích", "Tóm tắt cơ bản", "Lịch sử 7 ngày"],
  },
  {
    id: "pro", name: "Pro", tagline: "Cho cá nhân chuyên nghiệp",
    priceMonthly: "199.000", priceAnnual: "159.000", annualTotal: "1.910.000",
    period: "đ / tháng", tag: "Phổ biến nhất", highlight: true, cta: "Nâng cấp Pro",
    features: [
      "600 phút dịch / tháng (~10 giờ)",
      "Đa ngôn ngữ 60+ & chế độ song ngữ",
      "Tách giọng tự động (Speaker 1, 2, 3…)",
      "Tóm tắt AI đầy đủ + tải file",
      "Lịch sử không giới hạn",
    ],
  },
  {
    id: "business", name: "Business", tagline: "Cho đội nhóm & doanh nghiệp",
    priceMonthly: "599.000", priceAnnual: "479.000", annualTotal: "5.750.000",
    period: "đ / tháng", cta: "Nâng cấp Business",
    features: [
      "2.400 phút dịch / tháng (~40 giờ)",
      "Toàn bộ tính năng Pro",
      "Call Center mode",
      "5 tài khoản người dùng",
      "Từ điển riêng + hỗ trợ ưu tiên",
    ],
  },
  {
    id: "enterprise", name: "Enterprise", tagline: "Giải pháp theo nhu cầu",
    priceMonthly: "Liên hệ", period: "", cta: "Liên hệ",
    features: [
      "Phút dịch tuỳ chỉnh",
      "Nhiều người dùng + SSO",
      "Tuỳ chỉnh prompt & từ điển",
      "Dedicated support + SLA",
    ],
  },
];

const FAQ = [
  { q: "“Phút dịch” là gì?", a: "Số phút âm thanh được dịch trực tiếp hoặc tạo biên bản. Họp 30 phút = 30 phút dịch. Hạn mức làm mới mỗi tháng." },
  { q: "Đa ngôn ngữ và song ngữ khác gì?", a: "Đa ngôn ngữ: tự nhận diện rồi dịch sang 1 ngôn ngữ. Song ngữ: chọn 2 ngôn ngữ, nói tiếng nào ra tiếng còn lại." },
  { q: "Trả theo năm tiết kiệm bao nhiêu?", a: "Trả theo năm được giảm 20% so với trả tháng — tương đương được tặng hơn 2 tháng dùng miễn phí." },
  { q: "Đổi hoặc huỷ gói được không?", a: "Được. Nâng/hạ/huỷ bất cứ lúc nào, dùng đến hết chu kỳ đã trả." },
];

export default function Pricing() {
  const [busy, setBusy] = useState("");
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  async function choose(plan: Plan) {
    if (plan.id === "free") { location.href = "/"; return; }
    if (plan.id === "enterprise") { location.href = "mailto:support@transflash.app?subject=Meeting AI Enterprise"; return; }
    setBusy(plan.id);
    try {
      const r = await fetch(`/api/checkout?plan=${plan.id}&billing=${billing}`, { method: "POST" });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Chưa thể thanh toán");
      if (d.url) { location.href = d.url; return; }
      throw new Error("Thiếu liên kết thanh toán");
    } catch (e: any) {
      alert(e.message + "\n\n(Thanh toán sẽ được kích hoạt sau khi cấu hình Lemon Squeezy.)");
      setBusy("");
    }
  }

  function priceOf(p: Plan) {
    if (p.id === "free" || p.id === "enterprise") return p.priceMonthly;
    return billing === "annual" && p.priceAnnual ? p.priceAnnual : p.priceMonthly;
  }

  return (
    <main style={S.wrap}>
      <a href="/" style={S.back}>← Quay lại app</a>

      <header style={S.head}>
        <span style={S.eyebrow}>BẢNG GIÁ</span>
        <h1 style={S.h1}>Giá minh bạch, không phí ẩn</h1>
        <p style={S.sub}>Mọi gói đã gồm phút dịch real-time và tóm tắt AI. Huỷ bất cứ lúc nào.</p>
      </header>

      {/* monthly / annual toggle */}
      <div style={S.billRow}>
        <button
          onClick={() => setBilling("monthly")}
          style={{ ...S.billBtn, ...(billing === "monthly" ? S.billOn : {}) }}
        >Theo tháng</button>
        <button
          onClick={() => setBilling("annual")}
          style={{ ...S.billBtn, ...(billing === "annual" ? S.billOn : {}) }}
        >Theo năm <span style={S.save}>-20%</span></button>
      </div>

      <section style={S.grid}>
        {PLANS.map((p) => (
          <div key={p.id} style={{ ...S.card, ...(p.highlight ? S.cardHi : {}) }}>
            {p.tag && <div style={S.tag}>{p.tag}</div>}
            <div style={S.name}>{p.name}</div>
            <div style={S.tagline}>{p.tagline}</div>
            <div style={S.priceRow}>
              <span style={S.price}>{priceOf(p)}</span>
              {p.period && <span style={S.period}>{p.period}</span>}
            </div>
            <div style={S.annualNote}>
              {billing === "annual" && p.annualTotal
                ? `Thanh toán ${p.annualTotal}đ/năm`
                : " "}
            </div>
            <button
              onClick={() => choose(p)}
              disabled={busy === p.id}
              style={{ ...S.cta, ...(p.highlight ? S.ctaHi : {}) }}
            >
              {busy === p.id ? "Đang mở…" : p.cta}
            </button>
            <ul style={S.feats}>
              {p.features.map((f) => (
                <li key={f} style={S.feat}><span style={S.check}>✓</span><span>{f}</span></li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <div style={S.trust}>
        <span>✓ Huỷ bất cứ lúc nào</span>
        <span style={S.dot}>·</span>
        <span>✓ Không phí ẩn</span>
        <span style={S.dot}>·</span>
        <span>✓ Bảo mật — không bán dữ liệu</span>
      </div>

      {/* referral */}
      <section style={S.refBox}>
        <div style={S.refIcon}>🎁</div>
        <div style={{ flex: 1 }}>
          <div style={S.refTitle}>Mời bạn bè — cả hai cùng được tặng 60 phút</div>
          <div style={S.refSub}>
            Chia sẻ link giới thiệu của bạn. Khi bạn bè đăng ký, cả hai nhận thêm 60 phút dịch miễn phí.
            Không giới hạn số lượt mời.
          </div>
        </div>
        <a href="/" style={S.refCta}>Lấy link mời →</a>
      </section>

      <section style={S.faqWrap}>
        {FAQ.map((f) => (
          <div key={f.q} style={S.faqItem}>
            <div style={S.faqQ}>{f.q}</div>
            <div style={S.faqA}>{f.a}</div>
          </div>
        ))}
      </section>
    </main>
  );
}

const FONT = "'Inter',system-ui,-apple-system,sans-serif";
const S: Record<string, React.CSSProperties> = {
  wrap: { minHeight: "100vh", padding: "30px 22px 70px", fontFamily: FONT, color: "#0a1124",
    background: "radial-gradient(1100px 560px at 50% -12%,rgba(31,107,255,.10),transparent 62%),#fbfcfe",
    WebkitFontSmoothing: "antialiased" },
  back: { display: "inline-block", fontSize: 13, fontWeight: 600, color: "#5b6b8c", textDecoration: "none", marginBottom: 18 },
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
};
