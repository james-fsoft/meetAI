"use client";

import { useEffect, useState } from "react";

type Payment = {
  id: string; email: string | null; plan: string; billing: string;
  amount: number; content: string; status: string; created_at: string;
  user_email_sent?: boolean; admin_email_sent?: boolean; last_email_at?: string | null;
};

export default function AdminPayments() {
  const [rows, setRows] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/payments");
      const d = await r.json();
      if (r.ok) setRows(d.payments || []);
    } catch {} finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

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

  const fmtTime = (s: string) => { try { const d = new Date(s); return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) + " · " + d.toLocaleDateString("vi-VN"); } catch { return s; } };
  const vnd = (n: number) => n.toLocaleString("vi-VN") + "đ";

  return (
    <div style={S.wrap}>
      <div style={S.head}>
        <h2 style={S.h2}>💰 Đơn thanh toán chờ xác nhận {rows.length > 0 && <span style={S.count}>{rows.length}</span>}</h2>
        <button style={S.refresh} onClick={load} disabled={loading}>{loading ? "Đang tải…" : "↻ Làm mới"}</button>
      </div>

      {rows.length === 0 ? (
        <div style={S.empty}>{loading ? "Đang tải…" : "Không có đơn nào đang chờ."}</div>
      ) : (
        <div style={S.list}>
          {rows.map((p) => (
            <div key={p.id} style={S.card}>
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
                  <span style={S.dot}>·</span>
                  <span style={S.time}>{fmtTime(p.created_at)}</span>
                  <span style={S.dot}>·</span>
                  <span style={S.mailLabel} title={p.last_email_at ? "Gửi lúc " + fmtTime(p.last_email_at) : "Chưa gửi email"}>
                    ✉ <span style={ink(p.user_email_sent)}>K{p.user_email_sent ? "✓" : "✗"}</span> <span style={ink(p.admin_email_sent)}>A{p.admin_email_sent ? "✓" : "✗"}</span>
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
      )}
    </div>
  );
}

function ink(ok?: boolean): React.CSSProperties {
  return { color: ok ? "#16a34a" : "#dc2626", fontWeight: 800 };
}

const S: Record<string, any> = {
  wrap: { maxWidth: 900, margin: "0 auto 26px" },
  head: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  h2: { fontSize: 18, fontWeight: 900, letterSpacing: "-.02em", display: "flex", alignItems: "center", gap: 9 },
  count: { fontSize: 12, fontWeight: 800, color: "#1f6bff", background: "#eef4ff", border: "1px solid #d3e0fb", borderRadius: 20, padding: "2px 10px" },
  refresh: { border: "1px solid #e3e8f2", background: "#fff", cursor: "pointer", fontFamily: "inherit",
    fontSize: 12.5, fontWeight: 700, padding: "7px 13px", borderRadius: 9, color: "#5b6b8c" },
  empty: { background: "#fff", border: "1px solid #e3e8f2", borderRadius: 12, padding: "26px 16px", textAlign: "center", color: "#9aa6bd", fontSize: 14 },
  list: { display: "flex", flexDirection: "column", gap: 6 },
  card: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
    background: "#fff", border: "1px solid #e7ebf3", borderRadius: 11, padding: "9px 14px" },
  left: { display: "flex", flexDirection: "column", gap: 3, minWidth: 240, flex: 1 },
  line1: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  line2: { display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", fontSize: 12 },
  planBadge: (plan: string): React.CSSProperties => ({
    fontSize: 11, fontWeight: 900, letterSpacing: ".02em", padding: "2px 8px", borderRadius: 7,
    color: plan === "business" ? "#16a34a" : "#1f6bff",
    background: plan === "business" ? "#e7f8ee" : "#eef4ff",
  }),
  amount: { fontSize: 15.5, fontWeight: 900, letterSpacing: "-.02em", color: "#0a1124" },
  cycle: { fontSize: 12, color: "#9aa6bd", fontWeight: 600, marginLeft: -5 },
  badgePend: { fontSize: 10.5, fontWeight: 800, color: "#7b88a3", background: "#f5f7fc", border: "1px solid #e3e8f2", borderRadius: 20, padding: "2px 9px" },
  badgeAwait: { fontSize: 10.5, fontWeight: 800, color: "#b45309", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 20, padding: "2px 9px" },
  email: { color: "#33405c", fontWeight: 600, fontSize: 13 },
  code: { fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700, color: "#1f4fff", whiteSpace: "nowrap" },
  time: { color: "#9aa6bd" },
  dot: { color: "#cdd5e4" },
  mailLabel: { color: "#9aa6bd", fontWeight: 600, whiteSpace: "nowrap" },
  actions: { display: "flex", alignItems: "center", gap: 6, flexShrink: 0 },
  confirm: { border: "none", background: "#16a34a", color: "#fff", cursor: "pointer", fontFamily: "inherit",
    fontSize: 12.5, fontWeight: 800, padding: "7px 13px", borderRadius: 9, whiteSpace: "nowrap" },
  iconBtn: { border: "1px solid #d3e0fb", background: "#f4f8ff", color: "#1f4fff", cursor: "pointer", fontFamily: "inherit",
    fontSize: 13, fontWeight: 700, padding: "7px 11px", borderRadius: 9, lineHeight: 1 },
  iconReject: { border: "1px solid #f1d4d4", background: "#fff", color: "#dc2626", cursor: "pointer", fontFamily: "inherit",
    fontSize: 13, fontWeight: 800, padding: "7px 11px", borderRadius: 9, lineHeight: 1 },
};
