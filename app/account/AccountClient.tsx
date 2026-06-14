"use client";

import { useEffect, useState } from "react";
import { useLang, type Lang } from "@/lib/use-lang";
import LangSwitch from "../LangSwitch";

type Usage = {
  plan: string; unlimited: boolean; bonus: number;
  day: { used: number; limit: number | null; remain: number | null };
  month: { used: number; limit: number | null; remain: number | null };
};
type Meeting = { id: number; date: string; title: string; transcript?: string; summary?: string; live?: { src?: string; tgt?: string; spk?: number | null }[] };

const PLAN_LABEL: Record<string, string> = { free: "Free", pro: "Pro", business: "Business", enterprise: "Enterprise" };
const LOCALE: Record<Lang, string> = { en: "en-US", vi: "vi-VN", ko: "ko-KR" };

const T: Record<Lang, any> = {
  en: {
    back: "← Back to app", title: "My account", plan: "Plan", manage: "Manage plan", invite: "🎁 Invite & earn hours",
    month: "This month", today: "Today", used: "Used", remaining: "Remaining", renews: "Renews on", unlimited: "Unlimited",
    min: "min", bonusNote: (b: number) => `Includes +${b} bonus min from referrals`,
    history: "Meeting history", empty: "No saved meetings on this device yet.", download: "Download", del: "Delete", deviceNote: "History is stored on this device.",
  },
  vi: {
    back: "← Quay lại app", title: "Tài khoản của tôi", plan: "Gói", manage: "Quản lý gói", invite: "🎁 Mời bạn & nhận giờ",
    month: "Tháng này", today: "Hôm nay", used: "Đã dùng", remaining: "Còn lại", renews: "Làm mới vào", unlimited: "Không giới hạn",
    min: "phút", bonusNote: (b: number) => `Đã gồm +${b} phút thưởng giới thiệu`,
    history: "Lịch sử cuộc họp", empty: "Chưa có cuộc họp nào lưu trên thiết bị này.", download: "Tải về", del: "Xoá", deviceNote: "Lịch sử được lưu trên thiết bị này.",
  },
  ko: {
    back: "← 앱으로", title: "내 계정", plan: "요금제", manage: "요금제 관리", invite: "🎁 초대하고 시간 받기",
    month: "이번 달", today: "오늘", used: "사용", remaining: "남음", renews: "갱신일", unlimited: "무제한",
    min: "분", bonusNote: (b: number) => `추천 보너스 +${b}분 포함`,
    history: "회의 기록", empty: "이 기기에 저장된 회의가 없습니다.", download: "다운로드", del: "삭제", deviceNote: "기록은 이 기기에 저장됩니다.",
  },
};

export default function AccountClient({ email, usage }: { email: string; usage: Usage }) {
  const [lang, setLang] = useLang();
  const t = T[lang];
  const [items, setItems] = useState<Meeting[]>([]);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem("mr_m") || "[]")); } catch { setItems([]); }
  }, []);

  function delItem(id: number) {
    const next = items.filter((m) => m.id !== id);
    setItems(next);
    try { localStorage.setItem("mr_m", JSON.stringify(next)); } catch {}
  }
  function dlItem(m: Meeting) {
    let txt = "";
    if (m.summary) txt += "===== SUMMARY =====\n\n" + m.summary + "\n\n";
    txt += "===== TRANSCRIPT =====\n\n";
    if (m.live && m.live.length) {
      txt += m.live.map((p) => {
        const lb = p.spk != null ? "Speaker " + p.spk : "";
        return (lb ? lb + "\n" : "") + (p.src || "") + (p.tgt ? "\n→ " + p.tgt : "");
      }).join("\n\n");
    } else txt += m.transcript || "";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([txt], { type: "text/plain;charset=utf-8" }));
    a.download = (m.title || "meeting").replace(/[^\w\s-]/g, "").slice(0, 40).trim() + ".txt";
    a.click();
  }

  const renewMonth = (() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth() + 1, 1).toLocaleDateString(LOCALE[lang], { day: "2-digit", month: "long", year: "numeric" });
  })();
  const renewDay = (() => {
    const n = new Date(); n.setDate(n.getDate() + 1);
    return n.toLocaleDateString(LOCALE[lang], { day: "2-digit", month: "long" });
  })();

  return (
    <main style={S.wrap}>
      <div style={S.top}>
        <a href="/" style={S.back}>{t.back}</a>
        <LangSwitch lang={lang} onChange={setLang} />
      </div>

      <h1 style={S.h1}>{t.title}</h1>
      <div style={S.subEmail}>👤 {email}</div>

      {/* plan */}
      <div style={S.card}>
        <div style={S.cardRow}>
          <div>
            <div style={S.cardLabel}>{t.plan}</div>
            <div style={S.planName}>{PLAN_LABEL[usage.plan] || "Free"}</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a href="/pricing" style={S.btnGhost}>{t.manage}</a>
            <a href="/pricing" style={S.btnPri}>{t.invite}</a>
          </div>
        </div>
      </div>

      {/* monthly usage */}
      <div style={S.card}>
        <div style={S.usageHead}>
          <span style={S.cardLabel}>{t.month}</span>
          {!usage.unlimited && <span style={S.renew}>{t.renews} {renewMonth}</span>}
        </div>
        {usage.unlimited ? (
          <div style={S.unlimited}>♾️ {t.unlimited}</div>
        ) : (
          <Bar used={usage.month.used} limit={usage.month.limit} t={t} />
        )}
        {usage.bonus > 0 && <div style={S.bonus}>🎁 {t.bonusNote(usage.bonus)}</div>}
      </div>

      {/* daily (free plan) */}
      {usage.day.limit != null && (
        <div style={S.card}>
          <div style={S.usageHead}>
            <span style={S.cardLabel}>{t.today}</span>
            <span style={S.renew}>{t.renews} {renewDay}</span>
          </div>
          <Bar used={usage.day.used} limit={usage.day.limit} t={t} />
        </div>
      )}

      {/* history */}
      <div style={S.histHead}>
        <h2 style={S.h2}>{t.history}</h2>
        <span style={S.deviceNote}>{t.deviceNote}</span>
      </div>
      <div style={S.histBox}>
        {items.length === 0 ? (
          <div style={S.empty}>{t.empty}</div>
        ) : items.map((m) => (
          <div key={m.id} style={S.histRow}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={S.histTitle}>{m.title || "—"}</div>
              <div style={S.histDate}>{m.date}</div>
            </div>
            <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
              <button style={S.miniPri} onClick={() => dlItem(m)}>⬇ {t.download}</button>
              <button style={S.miniDel} onClick={() => delItem(m.id)} title={t.del}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function Bar({ used, limit, t }: { used: number; limit: number | null; t: any }) {
  const lim = limit || 0;
  const pct = lim > 0 ? Math.min(100, Math.round((used / lim) * 100)) : 0;
  const remain = Math.max(0, lim - used);
  const remainPct = 100 - pct;
  const danger = pct >= 90, warn = pct >= 70;
  const color = danger ? "#dc2626" : warn ? "#d97706" : "#1f6bff";
  return (
    <div>
      <div style={S.barTrack}><div style={{ ...S.barFill, width: pct + "%", background: color }} /></div>
      <div style={S.barLegend}>
        <span><b style={{ color }}>{t.used} {used}</b> / {lim} {t.min} · <b>{pct}%</b></span>
        <span style={{ color: "#16a34a", fontWeight: 800 }}>{t.remaining} {remain} {t.min} ({remainPct}%)</span>
      </div>
    </div>
  );
}

const FONT = "'Inter',system-ui,-apple-system,sans-serif";
const S: Record<string, React.CSSProperties> = {
  wrap: { minHeight: "100vh", maxWidth: 720, margin: "0 auto", padding: "24px 20px 70px", fontFamily: FONT, color: "#0a1124" },
  top: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  back: { fontSize: 13, fontWeight: 700, color: "#5b6b8c", textDecoration: "none" },
  h1: { fontSize: 28, fontWeight: 900, letterSpacing: "-.03em", marginBottom: 3 },
  subEmail: { fontSize: 13.5, color: "#7b88a3", fontWeight: 600, marginBottom: 22 },
  card: { background: "#fff", border: "1px solid #e7ebf3", borderRadius: 16, padding: "18px 20px", marginBottom: 14, boxShadow: "0 12px 30px -26px rgba(10,17,36,.5)" },
  cardRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  cardLabel: { fontSize: 11.5, fontWeight: 800, color: "#9aa6bd", textTransform: "uppercase", letterSpacing: ".05em" },
  planName: { fontSize: 22, fontWeight: 900, letterSpacing: "-.02em", marginTop: 3 },
  btnGhost: { fontSize: 13, fontWeight: 800, color: "#0a1124", background: "#fff", border: "1.5px solid #e3e8f2", borderRadius: 10, padding: "9px 15px", textDecoration: "none" },
  btnPri: { fontSize: 13, fontWeight: 800, color: "#fff", background: "#1f6bff", border: "1.5px solid transparent", borderRadius: 10, padding: "9px 15px", textDecoration: "none" },
  usageHead: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14, flexWrap: "wrap" },
  renew: { fontSize: 12, fontWeight: 700, color: "#7b88a3" },
  unlimited: { fontSize: 18, fontWeight: 900, color: "#1f6bff" },
  bonus: { marginTop: 12, fontSize: 12.5, fontWeight: 700, color: "#16a34a", background: "#e7f8ee", border: "1px solid #bcebcd", borderRadius: 10, padding: "8px 12px" },
  barTrack: { height: 12, background: "#eef1f7", borderRadius: 20, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 20, transition: "width .3s" },
  barLegend: { display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginTop: 9, fontSize: 13, color: "#5b6b8c", fontWeight: 600 },
  histHead: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, flexWrap: "wrap", margin: "26px 0 10px" },
  h2: { fontSize: 18, fontWeight: 900, letterSpacing: "-.02em" },
  deviceNote: { fontSize: 12, color: "#9aa6bd", fontWeight: 600 },
  histBox: { background: "#fff", border: "1px solid #e7ebf3", borderRadius: 14, overflow: "hidden" },
  empty: { padding: "28px 16px", textAlign: "center", color: "#9aa6bd", fontSize: 14 },
  histRow: { display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: "1px solid #f0f3fa" },
  histTitle: { fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  histDate: { fontSize: 12, color: "#9aa6bd", marginTop: 2 },
  miniPri: { fontSize: 12.5, fontWeight: 800, color: "#1f4fff", background: "#f4f8ff", border: "1px solid #d3e0fb", borderRadius: 9, padding: "8px 12px", cursor: "pointer", fontFamily: FONT, whiteSpace: "nowrap" },
  miniDel: { fontSize: 13, color: "#dc2626", background: "#fff", border: "1px solid #f1d4d4", borderRadius: 9, padding: "8px 11px", cursor: "pointer", fontFamily: FONT },
};
