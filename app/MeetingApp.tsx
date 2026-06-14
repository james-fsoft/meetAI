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
    ? `/meeting.html?v=38&signed=1&plan=${encodeURIComponent(plan)}`
    : "/meeting.html?v=38";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={bar}>
        <a href="/" style={brand}>
          <svg viewBox="0 0 100 100" width="22" height="22" style={{ display: "block" }} aria-hidden="true">
            <path d="M22 8 H78 a16 16 0 0 1 16 16 V60 a16 16 0 0 1 -16 16 H50 l-20 18 v-18 H22 a16 16 0 0 1 -16 -16 V24 A16 16 0 0 1 22 8 Z" fill="#1f6bff"/>
            <g fill="#fff"><rect x="26" y="38" width="7.5" height="12" rx="3.75"/><rect x="39" y="29" width="7.5" height="30" rx="3.75"/><rect x="52" y="22" width="7.5" height="44" rx="3.75"/><rect x="65" y="32" width="7.5" height="24" rx="3.75"/></g>
          </svg>
          <span>Flash Meet</span>
        </a>
        <span style={{ flex: 1 }} />
        {signedIn ? (
          <>
            {usage && (
              <a href="/pricing" style={usageBadgeStyle} title={t.usageTitle}>
                {usage.unlimited ? t.unlimited : t.left(usage.day?.remain ?? null, usage.month?.remain ?? null)}
              </a>
            )}
            {admin && <a href="/admin" style={adminLink}>⚙ Admin</a>}
            <a href="/pricing" style={planBadge(plan)} title={t.planTitle}>{PLAN_LABEL[plan] || "Free"}</a>
            <span style={mail}>👤 {email}</span>
            <button onClick={signOut} style={out}>{t.signout}</button>
          </>
        ) : (
          <>
            <span style={trialBadge}>{t.trial}</span>
            <a href="/pricing" style={linkBtn}>{t.pricing}</a>
            <a href="/login" style={primaryBtn}>{t.signin}</a>
          </>
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

const bar: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 12, padding: "8px 16px",
  fontFamily: "'Inter',system-ui,sans-serif", fontSize: 13, color: "#5b6b8c",
  borderBottom: "1px solid #e3e8f2", background: "#fff",
};
const brand: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 900, fontSize: 15, color: "#0a1124", letterSpacing: "-.03em", textDecoration: "none" };
const mail: React.CSSProperties = { fontSize: 12.5 };
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
  padding: "7px 16px", borderRadius: 8,
};
const trialBadge: React.CSSProperties = {
  fontSize: 11, fontWeight: 800, letterSpacing: ".03em", color: "#b45309",
  background: "#fffbeb", border: "1px solid #fde68a", padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap",
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
