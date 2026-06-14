"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useLang, type Lang } from "@/lib/use-lang";
import LangSwitch from "../LangSwitch";

const T: Record<Lang, {
  sub: string; google: string; redirecting: string; failed: string;
  seePlans: string; privacy: string; terms: string;
}> = {
  en: {
    sub: "Record, separate voices, translate live and summarize meetings with AI.",
    google: "Sign in with Google", redirecting: "Redirecting…", failed: "Sign-in failed",
    seePlans: "See pricing plans →", privacy: "Privacy Policy", terms: "Terms of Service",
  },
  vi: {
    sub: "Ghi âm, tách giọng, dịch trực tiếp và tóm tắt cuộc họp bằng AI.",
    google: "Đăng nhập với Google", redirecting: "Đang chuyển hướng…", failed: "Đăng nhập thất bại",
    seePlans: "Xem các gói dịch vụ →", privacy: "Chính sách bảo mật", terms: "Điều khoản dịch vụ",
  },
  ko: {
    sub: "녹음, 화자 분리, 실시간 번역, AI 회의 요약을 한 번에.",
    google: "Google로 로그인", redirecting: "이동 중…", failed: "로그인 실패",
    seePlans: "요금제 보기 →", privacy: "개인정보처리방침", terms: "이용약관",
  },
};

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [lang, setLang] = useLang();
  const t = T[lang];

  async function signInWithGoogle() {
    setErr("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (e: any) {
      setErr(e.message || t.failed);
      setLoading(false);
    }
  }

  return (
    <main style={S.wrap}>
      <div style={S.top}><LangSwitch lang={lang} onChange={setLang} /></div>
      <div style={S.card}>
        <div style={S.logo}>🎙️</div>
        <h1 style={S.h1}>Flash Meet</h1>
        <p style={S.sub}>{t.sub}</p>

        <button onClick={signInWithGoogle} disabled={loading} style={S.gbtn}>
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {loading ? t.redirecting : t.google}
        </button>

        {err && <p style={S.err}>{err}</p>}

        <a href="/pricing" style={S.link}>{t.seePlans}</a>

        <div style={S.legal}>
          <a href="/privacy" style={S.legalLink}>{t.privacy}</a>
          <span style={{ color: "#cdd5e4" }}>·</span>
          <a href="/terms" style={S.legalLink}>{t.terms}</a>
        </div>
      </div>
    </main>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap: { minHeight: "100vh", display: "grid", placeItems: "center", padding: 20, position: "relative",
    fontFamily: "'Inter',system-ui,sans-serif",
    background: "radial-gradient(900px 480px at 15% -8%,rgba(31,107,255,.10),transparent 60%),#f5f7fc" },
  top: { position: "absolute", top: 18, right: 18 },
  card: { width: "100%", maxWidth: 400, background: "#fff", border: "1px solid #e3e8f2", borderRadius: 22,
    padding: "40px 32px", textAlign: "center", boxShadow: "0 30px 60px -34px rgba(10,17,36,.45)" },
  logo: { fontSize: 40, marginBottom: 10 },
  h1: { fontSize: 26, fontWeight: 900, letterSpacing: "-.04em", color: "#0a1124", marginBottom: 8 },
  sub: { fontSize: 14, color: "#5b6b8c", lineHeight: 1.55, marginBottom: 28 },
  gbtn: { width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 11,
    border: "1.5px solid #e3e8f2", background: "#fff", color: "#0a1124", cursor: "pointer",
    fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "14px 18px", borderRadius: 12, transition: ".15s" },
  err: { color: "#dc2626", fontSize: 13, marginTop: 14, fontWeight: 600 },
  link: { display: "inline-block", marginTop: 22, fontSize: 13, fontWeight: 600, color: "#1f6bff", textDecoration: "none" },
  legal: { marginTop: 20, display: "flex", gap: 10, justifyContent: "center", alignItems: "center" },
  legalLink: { fontSize: 12, color: "#9aa6bd", textDecoration: "none", fontWeight: 600 },
};
