"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * Top-bar subscription widget: shows the current plan + remaining minutes with a
 * mini usage bar, and opens a panel with the full monthly/daily breakdown and the
 * plan-change actions. Usage is read from /api/usage (session cookie) and
 * refreshed periodically, so the bar tracks minutes as the meeting UI burns them.
 */

type Usage = {
  plan: string; unlimited: boolean; bonus: number;
  day: { used: number; limit: number | null; remain: number | null };
  month: { used: number; limit: number | null; remain: number | null };
};

type Lang = "en" | "vi" | "ko";

const PLAN_LABEL: Record<string, string> = { free: "Free", pro: "Pro", business: "Business", enterprise: "Enterprise" };
const LOCALE: Record<Lang, string> = { en: "en-US", vi: "vi-VN", ko: "ko-KR" };

const T: Record<Lang, {
  sub: string; left: string; min: string; unlimited: string; upgrade: string; change: string;
  month: string; today: string; used: string; remaining: string; renews: string; account: string;
  bonus: (b: number) => string; freeHint: string; loading: string;
}> = {
  en: {
    sub: "Subscription", left: "left", min: "min", unlimited: "Unlimited",
    upgrade: "Upgrade", change: "Change plan", month: "This month", today: "Today",
    used: "Used", remaining: "Remaining", renews: "Renews", account: "Account & history",
    bonus: (b) => `🎁 Referral pool: +${b} min (never expires)`,
    freeHint: "Upgrade for more minutes and no daily cap.", loading: "Loading…",
  },
  vi: {
    sub: "Gói cước", left: "còn", min: "phút", unlimited: "Không giới hạn",
    upgrade: "Nâng cấp", change: "Đổi gói", month: "Tháng này", today: "Hôm nay",
    used: "Đã dùng", remaining: "Còn lại", renews: "Làm mới", account: "Tài khoản & lịch sử",
    bonus: (b) => `🎁 Ví thưởng giới thiệu: +${b} phút (không hết hạn)`,
    freeHint: "Nâng cấp để có thêm phút và bỏ giới hạn theo ngày.", loading: "Đang tải…",
  },
  ko: {
    sub: "요금제", left: "남음", min: "분", unlimited: "무제한",
    upgrade: "업그레이드", change: "플랜 변경", month: "이번 달", today: "오늘",
    used: "사용", remaining: "남음", renews: "갱신", account: "계정 및 기록",
    bonus: (b) => `🎁 추천 적립: +${b}분 (무기한)`,
    freeHint: "업그레이드하면 사용 가능한 분이 늘고 일일 한도가 없어집니다.", loading: "불러오는 중…",
  },
};

export default function PlanMenu({ plan, lang, email }: { plan: string; lang: Lang; email?: string }) {
  const t = T[lang];
  const [usage, setUsage] = useState<Usage | null>(null);
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement | null>(null);

  const load = useCallback(() => {
    fetch("/api/usage", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d && d.month) setUsage(d as Usage); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 60_000);
    const onVis = () => { if (document.visibilityState === "visible") load(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { clearInterval(id); document.removeEventListener("visibilitychange", onVis); };
  }, [load]);

  useEffect(() => {
    if (!open) return;
    load();
    const onDoc = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open, load]);

  const p = usage?.plan || plan;
  const paid = p !== "free";
  const label = PLAN_LABEL[p] || "Free";
  const nf = (n: number) => n.toLocaleString(LOCALE[lang]);

  // Headline number = monthly minutes left; the daily cap (free plan) shows in the panel.
  const unlimited = usage?.unlimited ?? false;
  const mLim = usage?.month.limit ?? null;
  const mUsed = usage?.month.used ?? 0;
  const mRemain = usage?.month.remain ?? null;
  const pct = mLim ? Math.min(100, Math.round((mUsed / mLim) * 100)) : 0;
  const danger = pct >= 90, warn = pct >= 70;
  const barColor = danger ? "#dc2626" : warn ? "#d97706" : "#1f6bff";

  const renewMonth = (() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth() + 1, 1).toLocaleDateString(LOCALE[lang], { day: "2-digit", month: "short" });
  })();
  const renewDay = (() => {
    const n = new Date(); n.setDate(n.getDate() + 1);
    return n.toLocaleDateString(LOCALE[lang], { day: "2-digit", month: "short" });
  })();

  return (
    <div ref={wrap} className="fm-plan" style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fm-plan-pill"
        style={{ ...S.pill, borderColor: danger ? "#f4c7c7" : warn ? "#f6dfb5" : paid ? "#d3e0fb" : "#e3e8f2" }}
        aria-expanded={open}
        aria-haspopup="dialog"
        title={t.sub}
      >
        <span style={S.pillDot(paid ? "#1f6bff" : "#9aa6bd")} aria-hidden />
        <span style={S.pillMain}>
          <span style={S.pillTop}>
            <b style={{ ...S.pillPlan, color: paid ? "#1f4fff" : "#0a1124" }}>{label}</b>
            <span style={S.pillSep}>·</span>
            <span style={S.pillLeft}>
              {usage == null ? "…" : unlimited ? `♾️ ${t.unlimited}` : `${t.left} ${nf(mRemain ?? 0)} ${t.min}`}
            </span>
          </span>
          {!unlimited && (
            <span style={S.pillTrack} aria-hidden>
              <span style={{ ...S.pillFill, width: pct + "%", background: barColor }} />
            </span>
          )}
        </span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9aa6bd" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: ".15s" }} aria-hidden>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <Link href="/pricing" className="fm-plan-cta" style={paid ? S.ctaGhost : S.ctaPri}>
        {paid ? t.change : `✨ ${t.upgrade}`}
      </Link>

      {open && (
        <div style={S.panel} role="dialog" aria-label={t.sub}>
          <div style={S.panelHead}>
            <div style={{ minWidth: 0 }}>
              <div style={S.kicker}>{t.sub}</div>
              <div style={{ ...S.panelPlan, color: paid ? "#1f4fff" : "#0a1124" }}>{label}</div>
            </div>
            <Link href="/pricing" style={S.panelChange}>{paid ? t.change : t.upgrade} →</Link>
          </div>

          {email && <div style={S.panelMail}>👤 {email}</div>}

          {usage == null ? (
            <div style={S.loading}>{t.loading}</div>
          ) : (
            <>
              <Section
                title={t.month}
                renew={unlimited ? "" : `${t.renews} ${renewMonth}`}
                used={mUsed} limit={mLim} unlimited={unlimited} t={t} nf={nf}
              />
              {usage.day.limit != null && (
                <Section
                  title={t.today}
                  renew={`${t.renews} ${renewDay}`}
                  used={usage.day.used} limit={usage.day.limit} unlimited={false} t={t} nf={nf}
                />
              )}
              {usage.bonus > 0 && <div style={S.bonus}>{t.bonus(usage.bonus)}</div>}
              {!paid && <div style={S.hint}>{t.freeHint}</div>}
            </>
          )}

          <div style={S.panelFoot}>
            <Link href="/account" style={S.footLink}>{t.account} →</Link>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, renew, used, limit, unlimited, t, nf }: {
  title: string; renew: string; used: number; limit: number | null; unlimited: boolean;
  t: (typeof T)["en"]; nf: (n: number) => string;
}) {
  const lim = limit || 0;
  const pct = lim > 0 ? Math.min(100, Math.round((used / lim) * 100)) : 0;
  const remain = Math.max(0, lim - used);
  const color = pct >= 90 ? "#dc2626" : pct >= 70 ? "#d97706" : "#1f6bff";
  return (
    <div style={S.section}>
      <div style={S.sectionHead}>
        <span style={S.sectionTitle}>{title}</span>
        {renew ? <span style={S.sectionRenew}>{renew}</span> : null}
      </div>
      {unlimited ? (
        <div style={S.unlimited}>♾️ {t.unlimited}</div>
      ) : (
        <>
          <div style={S.track}><div style={{ ...S.fill, width: pct + "%", background: color }} /></div>
          <div style={S.legend}>
            <span>{t.used} <b style={{ color }}>{nf(used)}</b> / {nf(lim)} {t.min}</span>
            <span style={{ color: "#16a34a", fontWeight: 800 }}>{t.remaining} {nf(remain)} {t.min}</span>
          </div>
        </>
      )}
    </div>
  );
}

const FONT = "'Inter',system-ui,-apple-system,sans-serif";
const S: Record<string, any> = {
  pill: {
    display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: FONT,
    background: "#fff", border: "1.5px solid #d3e0fb", borderRadius: 11, padding: "5px 10px",
    boxShadow: "0 1px 2px rgba(10,17,36,.04)", lineHeight: 1.1, textAlign: "left",
  },
  pillDot: (c: string): React.CSSProperties => ({
    width: 7, height: 7, borderRadius: 7, background: c, flexShrink: 0, boxShadow: `0 0 0 3px ${c}22`,
  }),
  pillMain: { display: "flex", flexDirection: "column", gap: 4, minWidth: 96 },
  pillTop: { display: "flex", alignItems: "baseline", gap: 5, whiteSpace: "nowrap" },
  pillPlan: { fontSize: 12.5, fontWeight: 900, letterSpacing: "-.01em" },
  pillSep: { color: "#c6cee0", fontSize: 11 },
  pillLeft: { fontSize: 11.5, fontWeight: 700, color: "#5b6b8c" },
  pillTrack: { display: "block", height: 4, borderRadius: 4, background: "#eef1f7", overflow: "hidden" },
  pillFill: { display: "block", height: "100%", borderRadius: 4, transition: "width .3s" },

  ctaPri: {
    fontSize: 12, fontWeight: 800, color: "#fff", textDecoration: "none", whiteSpace: "nowrap",
    background: "linear-gradient(135deg,#2563eb,#3b82f6)", padding: "8px 14px", borderRadius: 10,
    boxShadow: "0 4px 12px -4px rgba(37,99,235,.55)",
  },
  ctaGhost: {
    fontSize: 12, fontWeight: 800, color: "#1f4fff", textDecoration: "none", whiteSpace: "nowrap",
    background: "#f4f8ff", border: "1.5px solid #d3e0fb", padding: "6px 13px", borderRadius: 10,
  },

  panel: {
    position: "absolute", top: "calc(100% + 9px)", right: 0, zIndex: 70, width: 316, maxWidth: "calc(100vw - 24px)",
    background: "#fff", border: "1px solid #e7ebf3", borderRadius: 15, padding: "15px 16px 12px",
    boxShadow: "0 26px 60px -22px rgba(10,17,36,.45)", fontFamily: FONT, color: "#0a1124", cursor: "default",
  },
  panelHead: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 },
  kicker: { fontSize: 10.5, fontWeight: 800, color: "#9aa6bd", textTransform: "uppercase", letterSpacing: ".06em" },
  panelPlan: { fontSize: 19, fontWeight: 900, letterSpacing: "-.02em", marginTop: 2 },
  panelChange: { fontSize: 12, fontWeight: 800, color: "#1f4fff", textDecoration: "none", background: "#eef4ff", border: "1px solid #d3e0fb", borderRadius: 9, padding: "6px 10px", whiteSpace: "nowrap" },
  panelMail: { fontSize: 11.5, color: "#9aa6bd", fontWeight: 600, marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  loading: { fontSize: 12.5, color: "#9aa6bd", padding: "14px 0" },

  section: { marginTop: 14 },
  sectionHead: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 7 },
  sectionTitle: { fontSize: 12, fontWeight: 800, color: "#33405c" },
  sectionRenew: { fontSize: 10.5, fontWeight: 700, color: "#9aa6bd" },
  unlimited: { fontSize: 14.5, fontWeight: 900, color: "#1f6bff" },
  track: { height: 9, background: "#eef1f7", borderRadius: 20, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 20, transition: "width .3s" },
  legend: { display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", marginTop: 7, fontSize: 11.5, color: "#5b6b8c", fontWeight: 600 },

  bonus: { marginTop: 12, fontSize: 11.5, fontWeight: 700, color: "#16a34a", background: "#e7f8ee", border: "1px solid #bcebcd", borderRadius: 9, padding: "7px 10px" },
  hint: { marginTop: 12, fontSize: 11.5, fontWeight: 600, color: "#5b6b8c", background: "#f7f9fd", border: "1px solid #e7ebf3", borderRadius: 9, padding: "7px 10px" },
  panelFoot: { marginTop: 13, paddingTop: 11, borderTop: "1px solid #f0f3fa" },
  footLink: { fontSize: 12, fontWeight: 800, color: "#5b6b8c", textDecoration: "none" },
};
