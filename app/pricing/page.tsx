"use client";

import { useState } from "react";

type Plan = {
  id: string; name: string; price: string; period: string; tag?: string; highlight?: boolean;
  cta: string; features: string[];
};

const PLANS: Plan[] = [
  {
    id: "free", name: "Free", price: "0đ", period: "miễn phí", cta: "Bắt đầu",
    features: ["30 phút dịch / tháng", "1 ngôn ngữ đích", "Tóm tắt rút gọn", "Lịch sử 7 ngày"],
  },
  {
    id: "pro", name: "Pro", price: "199.000đ", period: "/ tháng", tag: "Phổ biến", highlight: true, cta: "Nâng cấp Pro",
    features: ["600 phút dịch / tháng", "Tất cả ngôn ngữ (60+)", "Tách giọng nói (speaker)", "Tóm tắt AI đầy đủ", "Lịch sử không giới hạn", "Tải transcript & summary"],
  },
  {
    id: "business", name: "Business", price: "599.000đ", period: "/ tháng", cta: "Nâng cấp Business",
    features: ["2.400 phút dịch / tháng", "Mọi tính năng Pro", "Call Center mode", "5 người dùng", "Từ điển chuyên ngành (1 bộ)", "Hỗ trợ ưu tiên"],
  },
  {
    id: "enterprise", name: "Enterprise", price: "Liên hệ", period: "tuỳ chỉnh", cta: "Liên hệ",
    features: ["Phút dịch tuỳ chỉnh", "Nhiều người dùng / SSO", "Nhiều từ điển chuyên ngành", "Tuỳ chỉnh prompt tóm tắt", "Dedicated support + SLA"],
  },
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
        <p style={S.sub}>Thanh toán theo tháng, huỷ bất cứ lúc nào. Giá đã gồm phút dịch real-time và tóm tắt AI.</p>
      </header>

      <section style={S.grid}>
        {PLANS.map((p) => (
          <div key={p.id} style={{ ...S.card, ...(p.highlight ? S.cardHi : {}) }}>
            {p.tag && <div style={S.tag}>{p.tag}</div>}
            <div style={S.name}>{p.name}</div>
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
                <li key={f} style={S.feat}><span style={S.check}>✓</span>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <p style={S.note}>Cần thêm phút khi vượt hạn mức? Bạn có thể mua thêm gói phút lẻ (sắp ra mắt).</p>
    </main>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap: { minHeight: "100vh", padding: "48px 22px 60px", fontFamily: "'Inter',system-ui,sans-serif",
    background: "radial-gradient(1000px 520px at 50% -10%,rgba(31,107,255,.08),transparent 60%),#f5f7fc", color: "#0a1124" },
  head: { textAlign: "center", maxWidth: 640, margin: "0 auto 40px", position: "relative" },
  back: { position: "absolute", left: 0, top: 4, fontSize: 13, fontWeight: 600, color: "#5b6b8c", textDecoration: "none" },
  h1: { fontSize: 34, fontWeight: 900, letterSpacing: "-.04em", marginBottom: 12 },
  sub: { fontSize: 15, color: "#5b6b8c", lineHeight: 1.6 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 18, maxWidth: 1100, margin: "0 auto" },
  card: { position: "relative", background: "#fff", border: "1px solid #e3e8f2", borderRadius: 18, padding: "26px 22px",
    boxShadow: "0 20px 50px -36px rgba(10,17,36,.5)" },
  cardHi: { border: "2px solid #1f6bff", boxShadow: "0 26px 56px -30px rgba(31,107,255,.5)" },
  tag: { position: "absolute", top: -11, right: 18, background: "#1f6bff", color: "#fff", fontSize: 11, fontWeight: 800,
    padding: "4px 11px", borderRadius: 20 },
  name: { fontSize: 17, fontWeight: 900, marginBottom: 12 },
  priceRow: { display: "flex", alignItems: "baseline", gap: 6, marginBottom: 18 },
  price: { fontSize: 26, fontWeight: 900, letterSpacing: "-.03em" },
  period: { fontSize: 13, color: "#9aa6bd", fontWeight: 600 },
  cta: { width: "100%", border: "1.5px solid #e3e8f2", background: "#fff", color: "#0a1124", cursor: "pointer",
    fontFamily: "inherit", fontSize: 14, fontWeight: 800, padding: "12px", borderRadius: 11, marginBottom: 18 },
  ctaHi: { background: "#1f6bff", color: "#fff", border: "1.5px solid #1f6bff" },
  feats: { listStyle: "none", display: "flex", flexDirection: "column", gap: 9 },
  feat: { fontSize: 13, color: "#0a1124", display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.45 },
  check: { color: "#16a34a", fontWeight: 900, flexShrink: 0 },
  note: { textAlign: "center", fontSize: 13, color: "#9aa6bd", marginTop: 34 },
};
