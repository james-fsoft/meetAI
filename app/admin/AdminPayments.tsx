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
        const ok = e.user && e.admin;
        alert(ok
          ? "Đã gửi lại email ✓ (khách + admin)"
          : `Kết quả gửi:\n• Khách: ${e.user ? "✓" : "✗ " + (e.userError || "")}\n• Admin: ${e.admin ? "✓" : "✗ " + (e.adminError || "")}`);
        await load();
      } else {
        setRows((x) => x.filter((p) => p.id !== id));
      }
    } catch (e: any) { alert("Lỗi: " + e.message); }
    finally { setBusy(""); }
  }

  const fmt = (s: string) => { try { return new Date(s).toLocaleString("vi-VN"); } catch { return s; } };
  const vnd = (n: number) => n.toLocaleString("vi-VN") + "đ";

  return (
    <div style={S.wrap}>
      <div style={S.head}>
        <h2 style={S.h2}>💰 Đơn thanh toán chờ xác nhận</h2>
        <button style={S.refresh} onClick={load} disabled={loading}>{loading ? "Đang tải…" : "↻ Làm mới"}</button>
      </div>
      <div style={S.box}>
        {rows.length === 0 ? (
          <div style={S.empty}>{loading ? "Đang tải…" : "Không có đơn nào đang chờ."}</div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Email</th><th style={S.th}>Gói</th><th style={S.th}>Số tiền</th>
                <th style={S.th}>Nội dung CK</th><th style={S.th}>Trạng thái</th><th style={S.th}>Email</th><th style={S.th}>Lúc</th><th style={S.th}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} style={S.tr}>
                  <td style={S.td}>{p.email || "—"}</td>
                  <td style={S.td}><b>{p.plan.toUpperCase()}</b> <span style={{ color: "#9aa6bd", fontSize: 12 }}>{p.billing === "annual" ? "năm" : "tháng"}</span></td>
                  <td style={{ ...S.td, fontWeight: 800 }}>{vnd(p.amount)}</td>
                  <td style={{ ...S.td, fontFamily: "'Space Mono',monospace", fontSize: 12.5, color: "#1f4fff" }}>{p.content}</td>
                  <td style={S.td}><span style={p.status === "awaiting" ? S.badgeAwait : S.badgePend}>{p.status === "awaiting" ? "Báo đã CK" : "Chờ"}</span></td>
                  <td style={{ ...S.td, fontSize: 12 }} title={p.last_email_at ? "Gửi lúc " + fmt(p.last_email_at) : "Chưa gửi"}>
                    <span style={p.user_email_sent ? S.eyes : S.eno}>Khách {p.user_email_sent ? "✓" : "✗"}</span>{" "}
                    <span style={p.admin_email_sent ? S.eyes : S.eno}>Admin {p.admin_email_sent ? "✓" : "✗"}</span>
                  </td>
                  <td style={{ ...S.td, color: "#9aa6bd", fontSize: 12 }}>{fmt(p.created_at)}</td>
                  <td style={{ ...S.td, whiteSpace: "nowrap" }}>
                    <button style={S.confirm} disabled={busy === p.id} onClick={() => act(p.id, "confirm")}>✓ Kích hoạt</button>
                    <button style={S.resend} disabled={busy === p.id} onClick={() => act(p.id, "resend")}>✉ Gửi lại</button>
                    <button style={S.reject} disabled={busy === p.id} onClick={() => act(p.id, "reject")}>Từ chối</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 900, margin: "0 auto 26px" },
  head: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  h2: { fontSize: 18, fontWeight: 900, letterSpacing: "-.02em" },
  refresh: { border: "1px solid #e3e8f2", background: "#fff", cursor: "pointer", fontFamily: "inherit",
    fontSize: 12.5, fontWeight: 700, padding: "7px 13px", borderRadius: 9, color: "#5b6b8c" },
  box: { background: "#fff", border: "1px solid #e3e8f2", borderRadius: 14, overflow: "hidden" },
  empty: { padding: "26px 16px", textAlign: "center", color: "#9aa6bd", fontSize: 14 },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", fontSize: 11, fontWeight: 800, color: "#9aa6bd", textTransform: "uppercase",
    letterSpacing: ".04em", padding: "11px 14px", borderBottom: "1px solid #e3e8f2" },
  tr: { borderBottom: "1px solid #f0f3fa" },
  td: { padding: "11px 14px", fontSize: 13.5, verticalAlign: "middle" },
  badgePend: { fontSize: 11, fontWeight: 800, color: "#9aa6bd", background: "#f5f7fc", borderRadius: 20, padding: "3px 9px" },
  badgeAwait: { fontSize: 11, fontWeight: 800, color: "#b45309", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 20, padding: "3px 9px" },
  confirm: { border: "none", background: "#16a34a", color: "#fff", cursor: "pointer", fontFamily: "inherit",
    fontSize: 12.5, fontWeight: 800, padding: "7px 12px", borderRadius: 9, marginRight: 7 },
  resend: { border: "1px solid #d3e0fb", background: "#f4f8ff", color: "#1f4fff", cursor: "pointer", fontFamily: "inherit",
    fontSize: 12.5, fontWeight: 700, padding: "7px 12px", borderRadius: 9, marginRight: 7 },
  reject: { border: "1px solid #e3e8f2", background: "#fff", color: "#dc2626", cursor: "pointer", fontFamily: "inherit",
    fontSize: 12.5, fontWeight: 700, padding: "7px 12px", borderRadius: 9 },
  eyes: { color: "#16a34a", fontWeight: 700 },
  eno: { color: "#dc2626", fontWeight: 700 },
};
