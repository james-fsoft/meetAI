"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("✓ Tài khoản đã tạo. Kiểm tra email để xác nhận, rồi đăng nhập.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setMsg("⚠ " + (err.message || "Có lỗi xảy ra"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap">
      <style>{`
        .auth-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;
          font-family:'Inter',system-ui,sans-serif;color:#0a1124;
          background:radial-gradient(900px 480px at 12% -6%,rgba(31,107,255,.10),transparent 60%),
            radial-gradient(820px 460px at 100% 0%,rgba(31,107,255,.08),transparent 55%),#fff}
        .auth-card{width:100%;max-width:400px;background:#fff;border:1px solid #e3e8f2;border-radius:22px;
          padding:34px 30px;box-shadow:0 30px 60px -34px rgba(10,17,36,.45)}
        .auth-logo{display:flex;align-items:center;gap:10px;justify-content:center;margin-bottom:8px}
        .auth-logo svg{width:38px;height:38px}
        .auth-logo b{font-size:18px;font-weight:900;letter-spacing:-.03em}
        .auth-sub{text-align:center;color:#5b6b8c;font-size:13.5px;margin-bottom:24px}
        .auth-card label{display:block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;color:#5b6b8c;margin:14px 0 6px}
        .auth-card input{width:100%;border:1.5px solid #e3e8f2;border-radius:10px;padding:12px 14px;font-size:14px;font-family:inherit;outline:none}
        .auth-card input:focus{border-color:#1f6bff;box-shadow:0 0 0 3px rgba(31,107,255,.18)}
        .auth-btn{width:100%;margin-top:20px;background:#1f6bff;color:#fff;border:none;border-radius:12px;
          padding:14px;font-size:15px;font-weight:800;font-family:inherit;cursor:pointer;transition:.15s}
        .auth-btn:hover{background:#1657d6}
        .auth-btn:disabled{opacity:.5;cursor:not-allowed}
        .auth-switch{text-align:center;margin-top:18px;font-size:13px;color:#5b6b8c}
        .auth-switch button{background:none;border:none;color:#1f6bff;font-weight:700;cursor:pointer;font-family:inherit;font-size:13px}
        .auth-msg{margin-top:14px;font-size:13px;text-align:center;line-height:1.5;color:#0a1124}
      `}</style>
      <div className="auth-card">
        <div className="auth-logo">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <path d="M22 8 H78 a16 16 0 0 1 16 16 V60 a16 16 0 0 1 -16 16 H50 l-20 18 v-18 H22 a16 16 0 0 1 -16 -16 V24 A16 16 0 0 1 22 8 Z" fill="#1f6bff"/>
            <g fill="#fff">
              <rect x="26" y="38" width="7.5" height="12" rx="3.75"/>
              <rect x="39" y="29" width="7.5" height="30" rx="3.75"/>
              <rect x="52" y="22" width="7.5" height="44" rx="3.75"/>
              <rect x="65" y="32" width="7.5" height="24" rx="3.75"/>
            </g>
          </svg>
          <b>Meeting AI</b>
        </div>
        <p className="auth-sub">{mode === "login" ? "Đăng nhập để tiếp tục" : "Tạo tài khoản mới"}</p>
        <form onSubmit={submit}>
          <label>Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
          <label>Mật khẩu</label>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          <button className="auth-btn" disabled={busy}>
            {busy ? "…" : mode === "login" ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>
        {msg && <div className="auth-msg">{msg}</div>}
        <div className="auth-switch">
          {mode === "login" ? (
            <>Chưa có tài khoản? <button onClick={() => { setMode("signup"); setMsg(""); }}>Đăng ký</button></>
          ) : (
            <>Đã có tài khoản? <button onClick={() => { setMode("login"); setMsg(""); }}>Đăng nhập</button></>
          )}
        </div>
      </div>
    </div>
  );
}
