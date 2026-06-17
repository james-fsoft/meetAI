"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Profile = {
  id: string; email: string | null; plan: string; created_at: string;
  seconds_today?: number; day_key?: string | null; seconds_month?: number; month_key?: string | null;
  referred_by?: string | null; trial_until?: string | null;
};
const PLANS = ["free", "pro", "business", "enterprise"];
const LIM: Record<string, { day: number | null; month: number | null }> = {
  free: { day: 10, month: 30 }, pro: { day: null, month: 1000 }, business: { day: null, month: 5000 }, enterprise: { day: null, month: null },
};

export default function AdminTable({ profiles, me }: { profiles: Profile[]; me: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState("");

  const todayKey = new Date().toISOString().slice(0, 10);
  const monthKey = todayKey.slice(0, 7);
  const minToday = (p: Profile) => (p.day_key === todayKey ? Math.floor((p.seconds_today || 0) / 60) : 0);
  const minMonth = (p: Profile) => (p.month_key === monthKey ? Math.floor((p.seconds_month || 0) / 60) : 0);

  const counts = useMemo(() => {
    const c: Record<string, number> = { free: 0, pro: 0, business: 0, enterprise: 0 };
    profiles.forEach((p) => { c[p.plan] = (c[p.plan] || 0) + 1; });
    return c;
  }, [profiles]);

  // Growth + activity metrics (computed from the data we already loaded).
  const growth = useMemo(() => {
    const now = Date.now(), DAY = 86400000;
    const since = (d: number) => profiles.filter((p) => {
      const t = new Date(p.created_at).getTime();
      return !isNaN(t) && now - t <= d * DAY;
    }).length;
    const activeMonth = profiles.filter((p) => p.month_key === monthKey && (p.seconds_month || 0) > 0).length;
    const minutesMonth = profiles.reduce((s, p) => s + (p.month_key === monthKey ? Math.floor((p.seconds_month || 0) / 60) : 0), 0);
    const referred = profiles.filter((p) => p.referred_by).length;
    const paid = profiles.filter((p) => p.plan !== "free").length;
    const trials = profiles.filter((p) => p.trial_until && new Date(p.trial_until).getTime() > now).length;
    return { d1: since(1), d7: since(7), d30: since(30), activeMonth, minutesMonth, referred, paid, trials };
  }, [profiles, monthKey]);

  const trialDays = (p: Profile) => {
    if (!p.trial_until) return 0;
    const ms = new Date(p.trial_until).getTime() - Date.now();
    return ms > 0 ? Math.ceil(ms / 86400000) : 0;
  };

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? profiles.filter((p) => (p.email || "").toLowerCase().includes(s)) : profiles;
  }, [profiles, q]);

  async function post(url: string, body: any) {
    setBusy(body.userId);
    try {
      const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "failed");
      router.refresh();
    } catch (e: any) {
      alert("Lỗi: " + e.message);
    } finally {
      setBusy("");
    }
  }
  const setPlan = (userId: string, plan: string) => post("/api/admin/set-plan", { userId, plan });
  const grantTrial = (userId: string, days: number) => post("/api/admin/grant-trial", { userId, days });

  const fmt = (s: string) => { try { return new Date(s).toLocaleString("vi-VN"); } catch { return s; } };

  return (
    <main style={S.wrap}>
      <header style={S.head}>
        <div>
          <a href="/" style={S.back}>← App</a>
          <h1 style={S.h1}>Quản trị người dùng</h1>
        </div>
        <div style={S.stats}>
          <span style={S.stat}><b>{profiles.length}</b> users</span>
          {PLANS.map((p) => <span key={p} style={{ ...S.stat, ...badge(p) }}>{p}: <b>{counts[p] || 0}</b></span>)}
        </div>
      </header>

      <div style={S.cards}>
        <Metric label="Đăng ký hôm nay" value={growth.d1} accent="#1f6bff" />
        <Metric label="Mới · 7 ngày" value={growth.d7} accent="#1f6bff" />
        <Metric label="Mới · 30 ngày" value={growth.d30} accent="#1f6bff" />
        <Metric label="Hoạt động tháng này" value={growth.activeMonth} accent="#16a34a" />
        <Metric label="Phút dịch tháng này" value={growth.minutesMonth} accent="#16a34a" />
        <Metric label="Đến từ giới thiệu" value={growth.referred} accent="#8e4ec6" />
        <Metric label="Khách trả phí" value={growth.paid} accent="#d97706" />
        <Metric label="Free 7 ngày đang chạy" value={growth.trials} accent="#0ea5a8" />
      </div>

      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo email…" style={S.search} />

      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Email</th>
              <th style={S.th}>Gói</th>
              <th style={S.th}>Free 7 ngày</th>
              <th style={S.th}>Phút (ngày · tháng)</th>
              <th style={S.th}>Tạo lúc</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} style={S.tr}>
                <td style={S.td}>
                  {p.email || <i style={{ color: "#9aa6bd" }}>—</i>}
                  {p.email === me && <span style={S.you}>bạn</span>}
                </td>
                <td style={S.td}>
                  <select
                    value={p.plan}
                    disabled={busy === p.id}
                    onChange={(e) => setPlan(p.id, e.target.value)}
                    style={{ ...S.sel, ...badge(p.plan) }}
                  >
                    {PLANS.map((pl) => <option key={pl} value={pl}>{pl}</option>)}
                  </select>
                </td>
                <td style={{ ...S.td, whiteSpace: "nowrap" }}>
                  {trialDays(p) > 0 ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <span style={S.trialBadge}>🎁 {trialDays(p)} ngày</span>
                      <button style={S.trialRevoke} disabled={busy === p.id} onClick={() => grantTrial(p.id, 0)}>Huỷ</button>
                    </span>
                  ) : (
                    <button style={S.trialGrant} disabled={busy === p.id} onClick={() => grantTrial(p.id, 7)}>+ Free 7 ngày</button>
                  )}
                </td>
                <td style={{ ...S.td, fontSize: 12.5, whiteSpace: "nowrap" }}>
                  <b>{minToday(p)}</b>
                  <span style={{ color: "#9aa6bd" }}>{LIM[p.plan]?.day != null ? "/" + LIM[p.plan].day : ""} · </span>
                  <b>{minMonth(p)}</b>
                  <span style={{ color: "#9aa6bd" }}>{LIM[p.plan]?.month != null ? "/" + LIM[p.plan].month : ""} p</span>
                </td>
                <td style={{ ...S.td, color: "#9aa6bd", fontSize: 12 }}>{fmt(p.created_at)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td style={{ ...S.td, textAlign: "center", color: "#9aa6bd" }} colSpan={5}>Không có người dùng</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function Metric({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div style={S.card}>
      <div style={{ ...S.cardVal, color: accent }}>{value.toLocaleString("vi-VN")}</div>
      <div style={S.cardLabel}>{label}</div>
    </div>
  );
}

function badge(plan: string): React.CSSProperties {
  if (plan === "free") return { color: "#5b6b8c" };
  if (plan === "pro") return { color: "#1f6bff" };
  if (plan === "business") return { color: "#16a34a" };
  return { color: "#8e4ec6" }; // enterprise
}

const S: Record<string, React.CSSProperties> = {
  wrap: { minHeight: "100vh", padding: "32px 22px 60px", fontFamily: "'Inter',system-ui,sans-serif", background: "#f5f7fc", color: "#0a1124" },
  head: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", maxWidth: 900, margin: "0 auto 18px" },
  back: { fontSize: 13, fontWeight: 700, color: "#5b6b8c", textDecoration: "none" },
  h1: { fontSize: 26, fontWeight: 900, letterSpacing: "-.03em", marginTop: 4 },
  stats: { display: "flex", gap: 8, flexWrap: "wrap" },
  stat: { fontSize: 12, fontWeight: 700, background: "#fff", border: "1px solid #e3e8f2", borderRadius: 20, padding: "5px 12px" },
  cards: { maxWidth: 900, margin: "0 auto 14px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(118px,1fr))", gap: 10 },
  card: { background: "#fff", border: "1px solid #e3e8f2", borderRadius: 14, padding: "13px 14px", boxShadow: "0 12px 30px -26px rgba(10,17,36,.5)" },
  cardVal: { fontSize: 23, fontWeight: 900, letterSpacing: "-.03em", lineHeight: 1 },
  cardLabel: { fontSize: 11.5, fontWeight: 700, color: "#7b88a3", marginTop: 5 },
  search: { display: "block", width: "100%", maxWidth: 900, margin: "0 auto 14px", border: "1px solid #e3e8f2", borderRadius: 10, padding: "11px 14px", fontSize: 14, fontFamily: "inherit", outline: "none" },
  tableWrap: { maxWidth: 900, margin: "0 auto", background: "#fff", border: "1px solid #e3e8f2", borderRadius: 14, overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", fontSize: 11, fontWeight: 800, color: "#9aa6bd", textTransform: "uppercase", letterSpacing: ".04em", padding: "12px 16px", borderBottom: "1px solid #e3e8f2" },
  tr: { borderBottom: "1px solid #f0f3fa" },
  td: { padding: "12px 16px", fontSize: 14, verticalAlign: "middle" },
  you: { marginLeft: 8, fontSize: 10, fontWeight: 800, color: "#1f6bff", background: "#eef4ff", borderRadius: 20, padding: "2px 7px" },
  sel: { fontFamily: "inherit", fontSize: 13, fontWeight: 800, border: "1px solid #e3e8f2", borderRadius: 8, padding: "6px 10px", cursor: "pointer", background: "#fff", outline: "none" },
  trialBadge: { fontSize: 12, fontWeight: 800, color: "#0e7490", background: "#ecfeff", border: "1px solid #a5f3fc", borderRadius: 20, padding: "4px 10px", whiteSpace: "nowrap" },
  trialGrant: { fontFamily: "inherit", fontSize: 12, fontWeight: 800, color: "#0e7490", background: "#ecfeff", border: "1px solid #a5f3fc", borderRadius: 8, padding: "6px 11px", cursor: "pointer", whiteSpace: "nowrap" },
  trialRevoke: { fontFamily: "inherit", fontSize: 12, fontWeight: 700, color: "#dc2626", background: "#fff", border: "1px solid #f1d4d4", borderRadius: 8, padding: "5px 9px", cursor: "pointer" },
};
