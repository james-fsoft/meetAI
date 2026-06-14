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
const STORE_URL = "https://chromewebstore.google.com/detail/fnaffendjnopgpfehgoocdegbffakofl";

const T: Record<Lang, {
  trial: string; pricing: string; signin: string; signout: string;
  planTitle: string; account: string; refBanner: string; refClaim: string; ext: string;
  extPromo: string; extAdd: string; extMore: string;
}> = {
  en: {
    trial: "🎁 Free trial · 3 min", pricing: "Pricing", signin: "Sign in", signout: "Sign out",
    planTitle: "Manage plan", account: "My Page", ext: "Extension",
    refBanner: "🎁 A friend invited you to Flash Meet — sign in to claim 120 free minutes (2 hours)!", refClaim: "Sign in & claim →",
    extPromo: "Translate Google Meet, Zoom & YouTube live — get the free Chrome extension.", extAdd: "Add to Chrome", extMore: "Learn more",
  },
  vi: {
    trial: "🎁 Dùng thử · 3 phút", pricing: "Các gói", signin: "Đăng nhập", signout: "Đăng xuất",
    planTitle: "Quản lý gói", account: "Tài khoản", ext: "Tiện ích",
    refBanner: "🎁 Bạn được mời dùng Flash Meet — đăng nhập để nhận 120 phút (2 giờ) miễn phí!", refClaim: "Đăng nhập & nhận →",
    extPromo: "Dịch trực tiếp Google Meet, Zoom & YouTube — cài tiện ích Chrome miễn phí.", extAdd: "Thêm vào Chrome", extMore: "Tìm hiểu",
  },
  ko: {
    trial: "🎁 무료 체험 · 3분", pricing: "요금제", signin: "로그인", signout: "로그아웃",
    planTitle: "요금제 관리", account: "마이페이지", ext: "확장 프로그램",
    refBanner: "🎁 친구가 Flash Meet에 초대했어요 — 로그인하고 120분(2시간) 무료 받으세요!", refClaim: "로그인하고 받기 →",
    extPromo: "Google Meet·Zoom·YouTube 실시간 번역 — 무료 Chrome 확장 프로그램을 받으세요.", extAdd: "Chrome에 추가", extMore: "자세히",
  },
};

/**
 * Flash Meet — main shell: a slim top bar above the meeting UI
 * (served from public/meeting.html inside an iframe).
 * The bar's language mirrors the in-app EN/VI/KO switcher via the shared
 * localStorage "mr_lang" key (same origin → the iframe's change fires a
 * storage event here).
 */
export default function MeetingApp({ email, plan = "free", admin = false }: { email?: string; plan?: string; admin?: boolean }) {
  const router = useRouter();
  const signedIn = !!email;
  const [lang, setLang] = useState<Lang>("en");
  const [refPending, setRefPending] = useState(false);
  const [showExt, setShowExt] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem("fm_ext_dismiss") && window.innerWidth > 760) setShowExt(true);
    } catch {}
  }, []);
  function dismissExt() { try { localStorage.setItem("fm_ext_dismiss", "1"); } catch {} setShowExt(false); }

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

  // Referral: capture ?ref= on landing; once signed in, claim it (credits both).
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const ref = url.searchParams.get("ref");
      if (ref) {
        localStorage.setItem("fm_ref", ref);
        url.searchParams.delete("ref");
        window.history.replaceState({}, "", url.toString());
      }
    } catch {}
    const ref = (() => { try { return localStorage.getItem("fm_ref"); } catch { return null; } })();
    if (!signedIn) { setRefPending(!!ref); return; }
    if (!ref) return;
    fetch("/api/referral", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: ref }) })
      .then((r) => r.json()).then((d) => { if (d) { try { localStorage.removeItem("fm_ref"); } catch {} if (d.credited) router.refresh(); } })
      .catch(() => {});
  }, [signedIn, router]);

  const t = T[lang];

  async function signOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    router.refresh();
  }

  const iframeSrc = signedIn
    ? `/meeting.html?v=41&signed=1&plan=${encodeURIComponent(plan)}`
    : "/meeting.html?v=41";

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
            <a href="/extension" className="fm-mail" style={{ textDecoration: "none", color: "#5b6b8c", fontWeight: 700 }}>🧩 {t.ext}</a>
            {admin && <a href="/admin" style={adminLink}>⚙ Admin</a>}
            <a href="/account" style={accountLink}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }} aria-hidden="true">
                <circle cx="12" cy="8" r="3.4" />
                <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
              </svg>
              {t.account}
            </a>
            <a href="/pricing" style={planBadge(plan)} title={t.planTitle}>{PLAN_LABEL[plan] || "Free"}</a>
            <a href="/account" className="fm-mail" style={{ textDecoration: "none", color: "#5b6b8c" }}>👤 {email}</a>
            <button onClick={signOut} style={out}>{t.signout}</button>
          </div>
        ) : (
          <div className="fm-right">
            <span className="fm-trial">{t.trial}</span>
            <a href="/extension" className="fm-mail" style={{ ...linkBtn }}>🧩 {t.ext}</a>
            <a href="/pricing" style={linkBtn}>{t.pricing}</a>
            <a href="/login" style={primaryBtn}>{t.signin}</a>
          </div>
        )}
      </div>
      {refPending && !signedIn && (
        <div style={refBanner}>
          <span style={{ flex: 1 }}>{t.refBanner}</span>
          <a href="/login" style={refBannerBtn}>{t.refClaim}</a>
        </div>
      )}
      {showExt && (
        <div style={extBar}>
          <span style={extIcon} aria-hidden>
            <svg width="20" height="20" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#fff" /><path fill="#EA4335" d="M24 9.5c3.5 0 6.7 1.2 9.2 3.6l6.8-6.8C35.9 2.4 30.5 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.2C12.4 13.7 17.7 9.5 24 9.5z" /><path fill="#4285F4" d="M47 24.5c0-1.6-.2-3.1-.4-4.5H24v9h12.9c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 7.2-10.4 7.2-17.7z" /><path fill="#FBBC05" d="M10.5 28.6A14.5 14.5 0 0 1 9.8 24c0-1.6.3-3.1.8-4.6l-8-6.2A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.2z" /><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.1 1.4-4.9 2.3-8.2 2.3-6.3 0-11.6-4.2-13.5-9.9l-8 6.2C6.5 42.6 14.6 48 24 48z" /></svg>
          </span>
          <span style={extText}>{t.extPromo}</span>
          <a href={STORE_URL} target="_blank" rel="noopener noreferrer" style={extAddBtn}>{t.extAdd}</a>
          <a href="/extension" style={extMoreLink}>{t.extMore}</a>
          <button onClick={dismissExt} style={extX} aria-label="Dismiss">✕</button>
        </div>
      )}
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
const refBanner: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "10px 16px",
  background: "linear-gradient(135deg,#eef4ff,#f3f0ff)", borderBottom: "1px solid #dbe4fb",
  fontFamily: "'Inter',system-ui,sans-serif", fontSize: 13.5, fontWeight: 700, color: "#1f3a8a",
};
const refBannerBtn: React.CSSProperties = {
  fontSize: 12.5, fontWeight: 800, color: "#fff", background: "#1f6bff", textDecoration: "none",
  padding: "8px 16px", borderRadius: 9, whiteSpace: "nowrap",
};
const extBar: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
  background: "#fff", borderBottom: "1px solid #e3e8f2",
  fontFamily: "'Inter',system-ui,sans-serif", fontSize: 13.5,
};
const extIcon: React.CSSProperties = { display: "inline-flex", flexShrink: 0 };
const extText: React.CSSProperties = { flex: 1, color: "#33405c", fontWeight: 600, minWidth: 0 };
const extAddBtn: React.CSSProperties = {
  fontSize: 13, fontWeight: 800, color: "#fff", background: "linear-gradient(135deg,#2563eb,#3b82f6)",
  textDecoration: "none", padding: "8px 16px", borderRadius: 10, whiteSpace: "nowrap",
  boxShadow: "0 4px 12px rgba(37,99,235,.28)",
};
const extMoreLink: React.CSSProperties = {
  fontSize: 12.5, fontWeight: 700, color: "#5b6b8c", textDecoration: "none", whiteSpace: "nowrap",
};
const extX: React.CSSProperties = {
  border: "none", background: "none", cursor: "pointer", color: "#9aa6bd", fontSize: 14, fontWeight: 700,
  padding: "4px 6px", lineHeight: 1, flexShrink: 0,
};
const accountLink: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6,
  fontSize: 12, fontWeight: 800, color: "#1f6bff", background: "#eef4ff", border: "1px solid #d3e0fb",
  borderRadius: 8, padding: "5px 11px", textDecoration: "none", whiteSpace: "nowrap",
};
const planBadge = (plan: string): React.CSSProperties => ({
  fontSize: 11, fontWeight: 800, letterSpacing: ".03em", textDecoration: "none",
  padding: "4px 10px", borderRadius: 20,
  color: plan === "free" ? "#5b6b8c" : "#1f6bff",
  background: plan === "free" ? "#f5f7fc" : "#eef4ff",
  border: `1px solid ${plan === "free" ? "#e3e8f2" : "#d3e0fb"}`,
});
