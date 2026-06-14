"use client";

import { useState } from "react";

type Payment = {
  id: string; email: string | null; plan: string; billing: string;
  amount: number; content: string; status: string; created_at: string;
  user_email_sent?: boolean; admin_email_sent?: boolean; last_email_at?: string | null;
};

export default function AdminPayments({ initial = [] }: { initial?: Payment[] }) {
  const [rows, setRows] = useState<Payment[]>(initial);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState("");

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/payments");
      const d = await r.json();
      if (r.ok) setRows(d.payments || []);
    } catch {} finally { setLoading(false); }
  }

  async function act(id: string, action: "confirm" | "reject" | "resend") {
    if (action === "reject" && !confirm("Từ chối đơn này?")) return;
    setBusy(id);
    try {
      const r = await fetch("/api/admin/payments", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "failed");
      if (action === "resend") {
        const e = d.emailed || {};
        alert(e.user && e.admin
          ? "Đã gửi lại email ✓ (khách + admin)"
          : `Kết quả gửi:\n• Khách: ${e.user ? "✓" : "✗ " + (e.userError || "")}\n• Admin: ${e.admin ? "✓" : "✗ " + (e.adminError || "")}`);
        await load();
      } else {
        setRows((x) => x.filter((p) => p.id !== id));
      }
    } catch (e: any) { alert("Lỗi: " + e.message); }
    finally { setBusy(""); }
  }

  const fmtTime = (s: string) => { try { const d = new Date(s); return d.toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }); } catch { return s; } };
  const vnd = (n: number) => n.toLocaleString("vi-VN") + "đ";

  return (
    <div style={S.wrap}>
      <div style={S.head}>
        <h2 style={S.h2}>💰 Đơn thanh toán chờ xác nhận {rows.length > 0 && <span style={S.count}>{rows.length}</span>}</h2>
        <button style={S.refresh} onClick={load} disabled={loading}>{loading ? "Đang tải…" : "↻ Làm mới"}</button>
      </div>

      <div style={S.box}>
        {rows.length === 0 ? (
          <div style={S.empty}>Không có đơn nào đang chờ.</div>
        ) : rows.map((p) => (
          <div key={p.id} style={S.row}>
            <div style={S.left}>
              <div style={S.line1}>
                <span style={S.planBadge(p.plan)}>{p.plan.toUpperCase()}</span>
                <span style={S.amount}>{vnd(p.amount)}</span>
                <span style={S.cycle}>/{p.billing === "annual" ? "năm" : "tháng"}</span>
                <span style={p.status === "awaiting" ? S.badgeAwait : S.badgePend}>{p.status === "awaiting" ? "Báo đã CK" : "Chờ CK"}</span>
                <span style={S.email}>{p.email || "—"}</span>
              </div>
              <div style={S.line2}>
                <span style={S.code}>{p.content}</span>
                <span style={S.sep}>·</span>
                <span style={S.time}>{fmtTime(p.created_at)}</span>
                <span style={S.sep}>·</span>
                <span style={S.mail} title={p.last_email_at ? "Gửi lúc " + fmtTime(p.last_email_at) : "Chưa gửi email"}>
                  Email&nbsp;
                  <span style={mark(p.user_email_sent)}>khách {p.user_email_sent ? "✓" : "✗"}</span>
                  <span style={S.sep}>·</span>
                  <span style={mark(p.admin_email_sent)}>admin {p.admin_email_sent ? "✓" : "✗"}</span>
                </span>
              </div>
            </div>
            <div style={S.actions}>
              <button style={S.confirm} disabled={busy === p.id} onClick={() => act(p.id, "confirm")}>✓ Kích hoạt</button>
              <button style={S.iconBtn} disabled={busy === p.id} onClick={() => act(p.id, "resend")} title="Gửi lại email">✉</button>
              <button style={S.iconReject} disabled={busy === p.id} onClick={() => act(p.id, "reject")} title="Từ chối đơn">✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// sent = green, not sent = muted grey (not harsh red → easier on the eyes)
function mark(ok?: boolean): React.CSSProperties {
  return { color: ok ? "#16a34a" : "#aab3c5", fontWeight: 700 };
}

const FONT = "'Inter',system-ui,sans-serif";
const S: Record<string, any> = {
  wrap: { maxWidth: 900, margin: "0 auto 26px", fontFamily: FONT },
  head: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  h2: { fontSize: 18, fontWeight: 900, letterSpacing: "-.02em", color: "#0a1124", display: "flex", alignItems: "center", gap: 9 },
  count: { fontSize: 12, fontWeight: 800, color: "#1f6bff", background: "#eef4ff", border: "1px solid #d3e0fb", borderRadius: 20, padding: "2px 10px" },
  refresh: { border: "1px solid #e3e8f2", background: "#fff", cursor: "pointer", fontFamily: FONT,
    fontSize: 12.5, fontWeight: 700, padding: "8px 14px", borderRadius: 9, color: "#5b6b8c" },
  box: { background: "#fff", border: "1px solid #e3e8f2", borderRadius: 14, overflow: "hidden" },
  empty: { padding: "28px 16px", textAlign: "center", color: "#9aa6bd", fontSize: 14 },
  row: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap",
    padding: "13px 18px", borderBottom: "1px solid #f0f3fa" },
  left: { display: "flex", flexDirection: "column", gap: 5, minWidth: 250, flex: 1 },
  line1: { display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" },
  line2: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: 12.5, color: "#7b88a3" },
  planBadge: (plan: string): React.CSSProperties => ({
    fontSize: 11, fontWeight: 800, letterSpacing: ".03em", padding: "3px 9px", borderRadius: 7,
    color: plan === "business" ? "#16a34a" : "#1f6bff",
    background: plan === "business" ? "#e7f8ee" : "#eef4ff",
  }),
  amount: { fontSize: 16, fontWeight: 800, letterSpacing: "-.02em", color: "#0a1124" },
  cycle: { fontSize: 12.5, color: "#9aa6bd", fontWeight: 600, marginLeft: -5 },
  badgePend: { fontSize: 11, fontWeight: 700, color: "#7b88a3", background: "#f5f7fc", border: "1px solid #e7ebf3", borderRadius: 20, padding: "3px 10px" },
  badgeAwait: { fontSize: 11, fontWeight: 700, color: "#b45309", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 20, padding: "3px 10px" },
  email: { color: "#33405c", fontWeight: 600, fontSize: 13.5 },
  code: { color: "#1f6bff", fontWeight: 700, letterSpacing: ".01em" },
  time: { color: "#9aa6bd" },
  sep: { color: "#d3d9e4" },
  mail: { color: "#9aa6bd" },
  actions: { display: "flex", alignItems: "center", gap: 7, flexShrink: 0 },
  confirm: { border: "none", background: "#16a34a", color: "#fff", cursor: "pointer", fontFamily: FONT,
    fontSize: 13, fontWeight: 800, padding: "8px 15px", borderRadius: 9, whiteSpace: "nowrap" },
  iconBtn: { border: "1px solid #d3e0fb", background: "#f4f8ff", color: "#1f4fff", cursor: "pointer", fontFamily: FONT,
    fontSize: 13.5, fontWeight: 700, padding: "8px 12px", borderRadius: 9, lineHeight: 1 },
  iconReject: { border: "1px solid #f1d4d4", background: "#fff", color: "#dc2626", cursor: "pointer", fontFamily: FONT,
    fontSize: 13.5, fontWeight: 800, padding: "8px 12px", borderRadius: 9, lineHeight: 1 },
};
