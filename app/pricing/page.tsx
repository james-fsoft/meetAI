"use client";

import { useState } from "react";

type Plan = {
  id: string; name: string; tagline: string; price: string; period: string;
  tag?: string; highlight?: boolean; cta: string; features: string[];
};

const PLANS: Plan[] = [
  {
    id: "free", name: "Free", tagline: "Dùng thử cá nhân", price: "0đ", period: "miễn phí", cta: "Bắt đầu",
    features: [
      "30 phút dịch / tháng (~nửa giờ họp)",
      "1 ngôn ngữ đích (chọn 1 ngôn ngữ để dịch sang)",
      "Tóm tắt rút gọn sau cuộc họp",
      "Lưu lịch sử 7 ngày",
      "1 người dùng",
    ],
  },
  {
    id: "pro", name: "Pro", tagline: "Cá nhân & freelancer dùng thường xuyên",
    price: "199.000đ", period: "/ tháng", tag: "Phổ biến", highlight: true, cta: "Nâng cấp Pro",
    features: [
      "600 phút dịch / tháng (~10 giờ họp)",
      "Dịch đa ngôn ngữ 60+ — tự nhận diện tiếng nói",
      "Chế độ song ngữ (nói tiếng nào ra tiếng kia)",
      "Tách giọng tự động — Speaker 1, 2, 3…",
      "Tóm tắt AI đầy đủ: biên bản, quyết định, việc cần làm",
      "Lịch sử không giới hạn + tải transcript & tóm tắt",
    ],
  },
  {
    id: "business", name: "Business", tagline: "Đội nhóm & doanh nghiệp",
    price: "599.000đ", period: "/ tháng", cta: "Nâng cấp Business",
    features: [
      "2.400 phút dịch / tháng (~40 giờ họp)",
      "Bao gồm toàn bộ tính năng gói Pro",
      "Call Center mode (màn hình tổng đài + form tự điền)",
      "5 tài khoản người dùng",
      "Từ điển chuyên ngành riêng (1 bộ thuật ngữ)",
      "Hỗ trợ ưu tiên qua email",
    ],
  },
  {
    id: "enterprise", name: "Enterprise", tagline: "Tổ chức lớn, nhu cầu riêng",
    price: "Liên hệ", period: "tuỳ chỉnh", cta: "Liên hệ",
    features: [
      "Số phút dịch tuỳ chỉnh theo nhu cầu",
      "Nhiều người dùng + đăng nhập SSO",
      "Nhiều bộ từ điển chuyên ngành",
      "Tuỳ chỉnh prompt tóm tắt theo quy trình của bạn",
      "Hỗ trợ riêng (dedicated) + cam kết SLA",
    ],
  },
];

const FAQ = [
  { q: '“Phút dịch” là gì?', a: "Là số phút âm thanh được dịch trực tiếp hoặc chuyển thành biên bản. Ví dụ 1 cuộc họp 30 phút = 30 phút dịch. Hạn mức làm mới mỗi tháng." },
  { q: "Dịch đa ngôn ngữ & song ngữ khác nhau thế nào?", a: "Đa ngôn ngữ: hệ thống tự nhận diện tiếng đang nói rồi dịch sang 1 ngôn ngữ bạn chọn. Song ngữ: chọn 2 ngôn ngữ, ai nói tiếng nào sẽ ra tiếng còn lại — hợp cho hội thoại 2 bên." },
  { q: "Tách giọng (speaker) hoạt động ra sao?", a: "Khi nhiều người nói, hệ thống tự gán nhãn Speaker 1, 2, 3… để biết ai nói câu nào, giúp biên bản rõ ràng." },
  { q: "Có thể đổi hoặc huỷ gói không?", a: "Có. Thanh toán theo tháng, nâng/hạ hoặc huỷ bất cứ lúc nào; gói hiện tại dùng hết chu kỳ đã trả." },
  { q: "Vượt hạn mức phút thì sao?", a: "Tính năng dịch trực tiếp tạm dừng tới kỳ sau, hoặc bạn nâng gói. Gói phút lẻ (mua thêm) sắp ra mắt." },
];

export default function Pricing() {
  const [busy, setBusy] = useState("");

  async function choose(plan: Plan) {
    if (plan.id === "free") { location.href = "/"; return; }
    if (plan.id === "enterprise") { location.href = "mailto:sales@transflash.app?subject=Meeting AI Enterprise"; return; }
    setBusy(plan.id);
    try {
      const r = await fetch(`/api/checkout?plan=${plan.id}`, { method: "POST" });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Chưa thể thanh toán");
      if (d.url) { location.href = d.url; return; }
      throw new Error("Thiếu liên kết thanh toán");
    } catch (e: any) {
      alert(e.message + "\n\n(Thanh toán sẽ được kích hoạt sau khi cấu hình Lemon Squeezy.)");
      setBusy("");
    }
  }

  return (
    <main style={S.wrap}>
      <header style={S.head}>
        <a href="/" style={S.back}>← Quay lại app</a>
        <h1 style={S.h1}>Chọn gói phù hợp</h1>
        <p style={S.sub}>Thanh toán theo tháng, huỷ bất cứ lúc nào. Giá đã gồm phút dịch real-time và tóm tắt AI — không phí ẩn.</p>
      </header>

      <section style={S.grid}>
        {PLANS.map((p) => (
          <div key={p.id} style={{ ...S.card, ...(p.highlight ? S.cardHi : {}) }}>
            {p.tag && <div style={S.tag}>{p.tag}</div>}
            <div style={S.name}>{p.name}</div>
            <div style={S.tagline}>{p.tagline}</div>
            <div style={S.priceRow}>
              <span style={S.price}>{p.price}</span>
              <span style={S.period}>{p.period}</span>
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

      <section style={S.faqWrap}>
        <h2 style={S.faqH}>Giải thích nhanh</h2>
        <div style={S.faqGrid}>
          {FAQ.map((f) => (
            <div key={f.q} style={S.faqItem}>
              <div style={S.faqQ}>{f.q}</div>
              <div style={S.faqA}>{f.a}</div>
            </div>
          ))}
        </div>
        <p style={S.note}>Mọi gói đều bảo mật — âm thanh được xử lý để dịch/tóm tắt, không bán cho bên thứ ba.</p>
      </section>
    </main>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap: { minHeight: "100vh", padding: "48px 22px 70px", fontFamily: "'Inter',system-ui,sans-serif",
    background: "radial-gradient(1000px 520px at 50% -10%,rgba(31,107,255,.08),transparent 60%),#f5f7fc", color: "#0a1124" },
  head: { textAlign: "center", maxWidth: 680, margin: "0 auto 40px", position: "relative" },
  back: { position: "absolute", left: 0, top: 4, fontSize: 13, fontWeight: 600, color: "#5b6b8c", textDecoration: "none" },
  h1: { fontSize: 34, fontWeight: 900, letterSpacing: "-.04em", marginBottom: 12 },
  sub: { fontSize: 15, color: "#5b6b8c", lineHeight: 1.6 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(244px,1fr))", gap: 18, maxWidth: 1140, margin: "0 auto" },
  card: { position: "relative", background: "#fff", border: "1px solid #e3e8f2", borderRadius: 18, padding: "26px 22px",
    boxShadow: "0 20px 50px -36px rgba(10,17,36,.5)", display: "flex", flexDirection: "column" },
  cardHi: { border: "2px solid #1f6bff", boxShadow: "0 26px 56px -30px rgba(31,107,255,.5)" },
  tag: { position: "absolute", top: -11, right: 18, background: "#1f6bff", color: "#fff", fontSize: 11, fontWeight: 800,
    padding: "4px 11px", borderRadius: 20 },
  name: { fontSize: 18, fontWeight: 900 },
  tagline: { fontSize: 12.5, color: "#5b6b8c", marginTop: 4, minHeight: 34, lineHeight: 1.4 },
  priceRow: { display: "flex", alignItems: "baseline", gap: 6, margin: "10px 0 16px" },
  price: { fontSize: 27, fontWeight: 900, letterSpacing: "-.03em" },
  period: { fontSize: 13, color: "#9aa6bd", fontWeight: 600 },
  cta: { width: "100%", border: "1.5px solid #e3e8f2", background: "#fff", color: "#0a1124", cursor: "pointer",
    fontFamily: "inherit", fontSize: 14, fontWeight: 800, padding: "12px", borderRadius: 11, marginBottom: 18 },
  ctaHi: { background: "#1f6bff", color: "#fff", border: "1.5px solid #1f6bff" },
  feats: { listStyle: "none", display: "flex", flexDirection: "column", gap: 10 },
  feat: { fontSize: 13, color: "#0a1124", display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.5 },
  check: { color: "#16a34a", fontWeight: 900, flexShrink: 0 },
  faqWrap: { maxWidth: 900, margin: "48px auto 0" },
  faqH: { fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 20, letterSpacing: "-.02em" },
  faqGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14 },
  faqItem: { background: "#fff", border: "1px solid #e3e8f2", borderRadius: 14, padding: "16px 18px" },
  faqQ: { fontSize: 14, fontWeight: 800, marginBottom: 6 },
  faqA: { fontSize: 13, color: "#5b6b8c", lineHeight: 1.6 },
  note: { textAlign: "center", fontSize: 12.5, color: "#9aa6bd", marginTop: 26 },
};
