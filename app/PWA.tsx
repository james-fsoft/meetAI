"use client";

import { useEffect, useState } from "react";

/* Registers the service worker and shows a mobile "install as app" prompt.
   Android/Chrome: native install via beforeinstallprompt. iOS Safari: short
   Add-to-Home-Screen instructions (iOS has no install API). */
export default function PWA() {
  const [deferred, setDeferred] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone === true;
    if (standalone) return;
    try { if (localStorage.getItem("fm_pwa_dismiss") === "1") return; } catch {}

    const ua = navigator.userAgent;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
    if (!isMobile) return;
    const isIOS = /iPhone|iPad|iPod/i.test(ua) && !(window as any).MSStream;

    const onBIP = (e: any) => { e.preventDefault(); setDeferred(e); setShow(true); };
    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", () => dismiss());

    let tmr: any;
    if (isIOS && /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS/i.test(ua)) {
      // iOS Safari: no install event — show instructions after a short delay.
      tmr = setTimeout(() => { setIos(true); setShow(true); }, 2500);
    }
    return () => { window.removeEventListener("beforeinstallprompt", onBIP); if (tmr) clearTimeout(tmr); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function dismiss() { try { localStorage.setItem("fm_pwa_dismiss", "1"); } catch {} setShow(false); }
  async function install() {
    if (!deferred) return;
    deferred.prompt();
    try { await deferred.userChoice; } catch {}
    dismiss();
  }

  if (!show) return null;
  return (
    <div style={S.wrap} role="dialog" aria-label="Cài Flash Meet">
      <button onClick={dismiss} style={S.x} aria-label="Đóng">✕</button>
      <div style={S.row}>
        <span style={S.icon} aria-hidden>
          <svg viewBox="0 0 100 100" width="30" height="30"><rect width="100" height="100" rx="22" fill="#1f6bff" /><g fill="#fff"><rect x="26" y="38" width="7.5" height="24" rx="3.75" /><rect x="39" y="29" width="7.5" height="42" rx="3.75" /><rect x="52" y="22" width="7.5" height="56" rx="3.75" /><rect x="65" y="32" width="7.5" height="36" rx="3.75" /></g></svg>
        </span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={S.title}>Cài Flash Meet như app</div>
          <div style={S.body}>
            {ios
              ? "Bấm nút Chia sẻ ⎘ ở thanh dưới, rồi chọn “Thêm vào MH chính”."
              : "Dịch phụ đề trực tiếp, mở nhanh từ màn hình chính."}
          </div>
        </div>
        {!ios && <button onClick={install} style={S.btn}>Cài đặt</button>}
      </div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap: { position: "fixed", left: 12, right: 12, bottom: 12, zIndex: 70, background: "#fff", border: "1px solid #e7ebf3",
    borderRadius: 16, padding: "14px 14px", boxShadow: "0 18px 50px -16px rgba(10,17,36,.45)", fontFamily: "'Inter',system-ui,sans-serif", color: "#0a1124" },
  x: { position: "absolute", top: 8, right: 8, border: "none", background: "none", cursor: "pointer", color: "#9aa6bd", fontSize: 13, fontWeight: 700, padding: 4, lineHeight: 1 },
  row: { display: "flex", alignItems: "center", gap: 12 },
  icon: { flexShrink: 0, display: "flex" },
  title: { fontSize: 14.5, fontWeight: 800, letterSpacing: "-.02em" },
  body: { fontSize: 12.5, color: "#5b6b8c", lineHeight: 1.45, marginTop: 2 },
  btn: { flexShrink: 0, fontSize: 13.5, fontWeight: 800, color: "#fff", background: "#1f6bff", border: "none", borderRadius: 11, padding: "10px 16px", cursor: "pointer", fontFamily: "inherit" },
};
