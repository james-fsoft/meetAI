"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

const PLAN_LABEL: Record<string, string> = {
  free: "Free", pro: "Pro", business: "Business", enterprise: "Enterprise",
};

type Lang = "en" | "vi" | "ko";

// Shell strings in the 3 languages the app supports. The language is shared with
// the in-app switcher (localStorage key "mr_lang"), so the top bar follows it.
const T: Record<Lang, {
  trial: string; pricing: string; signin: string; signout: string;
  unlimited: string; usageTitle: string; planTitle: string;
  left: (d: number | null, m: number | null) => string;
}> = {
  en: {
    trial: "🎁 Free trial · 3 min", pricing: "Pricing", signin: "Sign in", signout: "Sign out",
    unlimited: "⏱ Unlimited", usageTitle: "Minutes left", planTitle: "Manage plan",
    left: (d, m) => "⏱ " + [d != null ? `${Math.max(0, d)} min today` : "", m != null ? `${Math.max(0, m)} min/mo` : ""].filter(Boolean).join(" · "),
  },
  vi: {
    trial: "🎁 Dùng thử · 3 phút", pricing: "Các gói", signin: "Đăng nhập", signout: "Đăng xuất",
    unlimited: "⏱ Không giới hạn", usageTitle: "Phút còn lại", planTitle: "Quản lý gói",
    left: (d, m) => "⏱ " + [d != null ? `Còn ${Math.max(0, d)}p hôm nay` : "", m != null ? `${Math.max(0, m)}p tháng` : ""].filter(Boolean).join(" · "),
  },
  ko: {
    trial: "🎁 무료 체험 · 3분", pricing: "요금제", signin: "로그인", signout: "로그아웃",
    unlimited: "⏱ 무제한", usageTitle: "남은 시간", planTitle: "요금제 관리",
    left: (d, m) => "⏱ " + [d != null ? `오늘 ${Math.max(0, d)}분` : "", m != null ? `이번 달 ${Math.max(0, m)}분` : ""].filter(Boolean).join(" · "),
  },
};

/**
 * Flash Meet — main shell: a slim top bar above the meeting UI
 * (served from public/meeting.html inside an iframe).
 * The bar's language mirrors the in-app EN/VI/KO switcher via the shared
 * localStorage "mr_lang" key (same origin → the iframe's change fires a
 * storage event here).
 */
type Usage = { unlimited: boolean; day: { remain: number | null }; month: { remain: number | null } } | null;

export default function MeetingApp({ email, plan = "free", admin = false, usage = null }: { email?: string; plan?: string; admin?: boolean; usage?: Usage }) {
  const router = useRouter();
  const signedIn = !!email;
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const read = () => {
      const v = localStorage.getItem("mr_lang");
      setLang(v === "vi" || v === "ko" ? v : "en");
    };
    read();
    const onStorage = (e: StorageEvent) => { if (e.key === "mr_lang") read(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const t = T[lang];

  async function signOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    router.refresh();
  }

  const iframeSrc = signedIn
    ? `/meeting.html?v=40&signed=1&plan=${encodeURIComponent(plan)}`
    : "/meeting.html?v=40";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <style>{BAR_CSS}</style>
      <div className="fm-bar">
        <a href="/" className="fm-brand">
          <svg viewBox="0 0 100 100" width="24" height="24" style={{ display: "block", flexShrink: 0 }} aria-hidden="true">
            <path d="M22 8 H78 a16 16 0 0 1 16 16 V60 a16 16 0 0 1 -16 16 H50 l-20 18 v-18 H22 a16 16 0 0 1 -16 -16 V24 A16 16 0 0 1 22 8 Z" fill="#1f6bff"/>
            <g fill="#fff"><rect x="26" y="38" width="7.5" height="12" rx="3.75"/><rect x="39" y="29" width="7.5" height="30" rx="3.75"/><rect x="52" y="22" width="7.5" height="44" rx="3.75"/><rect x="65" y="32" width="7.5" height="24" rx="3.75"/></g>
          </svg>
          <span>Flash Meet</span>
        </a>
        <span style={{ flex: 1 }} />
        {signedIn ? (
          <div className="fm-right">
            {usage && (
              <a href="/pricing" style={usageBadgeStyle} title={t.usageTitle}>
                {usage.unlimited ? t.unlimited : t.left(usage.day?.remain ?? null, usage.month?.remain ?? null)}
              </a>
            )}
            {admin && <a href="/admin" style={adminLink}>⚙ Admin</a>}
            <a href="/pricing" style={planBadge(plan)} title={t.planTitle}>{PLAN_LABEL[plan] || "Free"}</a>
            <span className="fm-mail">👤 {email}</span>
            <button onClick={signOut} style={out}>{t.signout}</button>
          </div>
        ) : (
          <div className="fm-right">
            <span className="fm-trial">{t.trial}</span>
            <a href="/pricing" style={linkBtn}>{t.pricing}</a>
            <a href="/login" style={primaryBtn}>{t.signin}</a>
          </div>
        )}
      </div>
      <iframe
        src={iframeSrc}
        title="Flash Meet"
        allow="microphone; display-capture; clipboard-write"
        style={{ border: "none", width: "100%", flex: 1, display: "block" }}
      />
    </div>
  );
}

// Responsive top bar — classes so media queries actually apply (inline styles can't).
const BAR_CSS = `
.fm-bar{display:flex;align-items:center;gap:10px;padding:8px 16px;background:#fff;border-bottom:1px solid #e3e8f2;font-family:'Inter',system-ui,sans-serif;font-size:13px;color:#5b6b8c}
.fm-brand{display:inline-flex;align-items:center;gap:8px;font-weight:900;font-size:15.5px;color:#0a1124;letter-spacing:-.03em;text-decoration:none;white-space:nowrap;flex-shrink:0}
.fm-right{display:flex;align-items:center;gap:8px;flex-shrink:0}
.fm-mail{font-size:12.5px;white-space:nowrap;max-width:200px;overflow:hidden;text-overflow:ellipsis}
.fm-trial{font-size:11px;font-weight:800;letter-spacing:.03em;color:#b45309;background:#fffbeb;border:1px solid #fde68a;padding:4px 11px;border-radius:20px;white-space:nowrap}
@media(max-width:600px){
  .fm-bar{gap:8px;padding:8px 13px}
  .fm-brand{font-size:14.5px}
  .fm-mail{display:none}
  .fm-right{gap:7px}
}
@media(max-width:420px){
  .fm-trial{display:none}
}
`;
const out: React.CSSProperties = {
  border: "1.5px solid #e3e8f2", background: "#fff", color: "#0a1124", cursor: "pointer",
  fontFamily: "inherit", fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 8,
};
const linkBtn: React.CSSProperties = {
  fontSize: 12, fontWeight: 700, color: "#5b6b8c", textDecoration: "none", padding: "6px 10px",
};
const adminLink: React.CSSProperties = {
  fontSize: 12, fontWeight: 800, color: "#8e4ec6", textDecoration: "none",
  background: "#f6f0fc", border: "1px solid #e7d8f7", padding: "5px 11px", borderRadius: 8,
};
const primaryBtn: React.CSSProperties = {
  fontSize: 12, fontWeight: 800, color: "#fff", background: "#1f6bff", textDecoration: "none",
  padding: "7px 16px", borderRadius: 8, whiteSpace: "nowrap",
};
const usageBadgeStyle: React.CSSProperties = {
  fontSize: 11.5, fontWeight: 800, color: "#1f6bff", background: "#eef4ff", border: "1px solid #d3e0fb",
  borderRadius: 20, padding: "4px 11px", textDecoration: "none", whiteSpace: "nowrap",
};
const planBadge = (plan: string): React.CSSProperties => ({
  fontSize: 11, fontWeight: 800, letterSpacing: ".03em", textDecoration: "none",
  padding: "4px 10px", borderRadius: 20,
  color: plan === "free" ? "#5b6b8c" : "#1f6bff",
  background: plan === "free" ? "#f5f7fc" : "#eef4ff",
  border: `1px solid ${plan === "free" ? "#e3e8f2" : "#d3e0fb"}`,
});
