"use client";

import { ChangeEvent, useRef, useState } from "react";

const LANGS = [
  ["ko", "🇰🇷 한국어"],
  ["vi", "🇻🇳 Tiếng Việt"],
  ["en", "🇺🇸 English"],
  ["ja", "🇯🇵 日本語"],
  ["zh", "🇨🇳 中文"],
] as const;

type StageConfig = {
  preset: string;
  customDataUrl?: string;
  overlay: number;
};

export default function ConferenceModePage() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [open, setOpen] = useState(false);
  const [languages, setLanguages] = useState(["ko", "vi", "en"]);
  const [preset, setPreset] = useState("blue");
  const [overlay, setOverlay] = useState(0.18);
  const [customDataUrl, setCustomDataUrl] = useState("");
  const [message, setMessage] = useState("");

  function childDoc() {
    try { return frameRef.current?.contentDocument || null; } catch { return null; }
  }

  function conferenceId() {
    const text = childDoc()?.getElementById("idpill")?.textContent?.trim().toUpperCase() || "";
    return /^FM-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{2}$/.test(text) ? text : "";
  }

  function syncLanguages() {
    const doc = childDoc();
    if (!doc) return;
    const next = ["l1", "l2", "l3"].map((id, i) =>
      (doc.getElementById(id) as HTMLSelectElement | null)?.value || languages[i]
    );
    setLanguages(next);
  }

  function showStage() {
    syncLanguages();
    setMessage("");
    setOpen(true);
  }

  async function resizeBackground(file: File) {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result || ""));
      r.onerror = () => reject(r.error);
      r.readAsDataURL(file);
    });
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const im = new Image();
      im.onload = () => resolve(im);
      im.onerror = reject;
      im.src = dataUrl;
    });
    const maxW = 1920, maxH = 1080;
    const scale = Math.min(1, maxW / img.width, maxH / img.height);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.84);
  }

  async function onBackground(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return setMessage("Chỉ dùng ảnh JPG/PNG/WebP.");
    if (file.size > 12 * 1024 * 1024) return setMessage("Ảnh nền tối đa 12MB.");
    try {
      setMessage("Đang tối ưu ảnh nền…");
      setCustomDataUrl(await resizeBackground(file));
      setPreset("custom");
      setMessage("Đã sẵn sàng dùng ảnh nền riêng.");
    } catch {
      setMessage("Không đọc được ảnh nền.");
    }
  }

  function saveStageConfig(id: string) {
    const cfg: StageConfig = { preset, overlay, ...(customDataUrl ? { customDataUrl } : {}) };
    try { localStorage.setItem(`fm_stage_bg_${id}`, JSON.stringify(cfg)); } catch {}
  }

  function openWindows(n: number) {
    const id = conferenceId();
    if (!id) {
      setMessage("Chưa có Conference ID. Hãy đăng nhập/đợi Conference ID được tạo rồi thử lại.");
      return;
    }
    saveStageConfig(id);
    const usable = languages.slice(0, n);
    const sw = window.screen.availWidth || 1440;
    const sh = window.screen.availHeight || 900;
    const width = Math.max(520, Math.floor(sw / Math.min(n, 2)) - 30);
    const height = Math.max(460, Math.floor(sh * 0.78));
    let blocked = 0;
    usable.forEach((lang, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const left = 16 + col * (width + 12);
      const top = 40 + row * 90;
      const url = `/conference-stage.html?id=${encodeURIComponent(id)}&lang=${encodeURIComponent(lang)}`;
      const w = window.open(url, `flashmeet-stage-${id}-${lang}`, `popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=no`);
      if (!w) blocked++;
    });
    setMessage(blocked ? `Browser đã chặn ${blocked} cửa sổ. Hãy cho phép pop-up cho meet.transflash.app.` : `Đã mở ${n} Stage Window. Bạn có thể kéo từng cửa sổ sang màn hình khác.`);
  }

  function openOne(i: number) {
    const id = conferenceId();
    if (!id) return setMessage("Chưa có Conference ID.");
    saveStageConfig(id);
    const lang = languages[i];
    const url = `/conference-stage.html?id=${encodeURIComponent(id)}&lang=${encodeURIComponent(lang)}`;
    const w = window.open(url, `flashmeet-stage-${id}-${lang}`, "popup=yes,width=850,height=650,resizable=yes,scrollbars=no");
    if (!w) setMessage("Browser đang chặn pop-up. Hãy Allow pop-ups cho trang này.");
  }

  return (
    <main className="stage-host">
      <style>{css}</style>
      <iframe
        ref={frameRef}
        src="/conference-pro.html"
        title="Flash Meet Conference Mode"
        allow="microphone; clipboard-write; fullscreen"
        allowFullScreen
        className="host-frame"
      />
      <button className="stage-launch" onClick={showStage}>▣ Stage windows</button>

      {open && <div className="backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
        <section className="stage-sheet">
          <header><div><small>FLASH MEET · CONFERENCE DISPLAY</small><h2>Stage windows</h2><p>Mở cửa sổ browser riêng để kéo sang màn hình trình chiếu khác.</p></div><button onClick={() => setOpen(false)}>✕</button></header>

          <div className="group"><label>Ngôn ngữ hiển thị</label><div className="language-grid">
            {[0,1,2].map(i => <div className="lang-item" key={i}>
              <select value={languages[i]} onChange={e => setLanguages(v => v.map((x,j) => j === i ? e.target.value : x))}>
                {LANGS.map(([value,label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <button onClick={() => openOne(i)}>Mở riêng</button>
            </div>)}
          </div></div>

          <div className="group"><label>Background</label><div className="presets">
            {[["clean","Light"],["blue","Conference Blue"],["dark","Dark Navy"],["black","Black"]].map(([v,l]) =>
              <button key={v} className={preset === v && !customDataUrl ? "on" : ""} onClick={() => { setPreset(v); setCustomDataUrl(""); }}>{l}</button>
            )}
            <label className={customDataUrl ? "upload on" : "upload"}>＋ Upload ảnh<input type="file" accept="image/*" onChange={onBackground}/></label>
          </div></div>

          <div className="group overlay-row"><label>Độ tối nền <b>{Math.round(overlay * 100)}%</b></label><input type="range" min="0" max="0.65" step="0.05" value={overlay} onChange={e => setOverlay(Number(e.target.value))}/></div>

          <div className="actions"><button className="secondary" onClick={() => openWindows(2)}>Mở 2 cửa sổ</button><button className="primary" onClick={() => openWindows(3)}>Mở 3 cửa sổ</button></div>
          {message && <div className="message">{message}</div>}
          <footer>Stage Window nhận caption realtime bằng Conference ID. Ảnh upload được lưu cục bộ trên máy host, không public lên server.</footer>
        </section>
      </div>}
    </main>
  );
}

const css = `
*{box-sizing:border-box}.stage-host{width:100%;height:100vh;position:relative;background:#fff}.host-frame{border:0;width:100%;height:100vh;display:block}.stage-launch{position:fixed;left:18px;bottom:18px;z-index:50;border:1px solid rgba(24,53,87,.14);background:rgba(255,255,255,.94);backdrop-filter:blur(14px);color:#10213a;border-radius:13px;padding:11px 15px;font:650 12px Inter,system-ui,sans-serif;box-shadow:0 14px 36px rgba(29,62,105,.16);cursor:pointer}.stage-launch:hover{transform:translateY(-1px)}.backdrop{position:fixed;inset:0;z-index:100;background:rgba(4,10,18,.48);backdrop-filter:blur(10px);display:grid;place-items:center;padding:18px}.stage-sheet{width:min(680px,100%);max-height:94vh;overflow:auto;background:#fff;border-radius:24px;border:1px solid #e2e9f1;box-shadow:0 34px 100px rgba(4,15,30,.24);padding:24px;font-family:"Be Vietnam Pro",Inter,system-ui,sans-serif;color:#101827}.stage-sheet header{display:flex;gap:18px;align-items:flex-start}.stage-sheet header>div{flex:1}.stage-sheet header small{font-size:9px;letter-spacing:.18em;color:#6d7d92;font-weight:700}.stage-sheet h2{font-size:27px;letter-spacing:-.04em;margin:5px 0 4px}.stage-sheet header p{font-size:12px;color:#718096;margin:0;line-height:1.55}.stage-sheet header button{border:0;background:#f1f5f9;border-radius:10px;width:36px;height:36px;cursor:pointer}.group{margin-top:23px}.group>label{display:block;font-size:11px;font-weight:700;margin-bottom:9px}.language-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.lang-item{border:1px solid #e1e8f0;border-radius:13px;padding:9px;background:#f8fafc}.lang-item select{width:100%;border:0;background:transparent;font:600 12px inherit;color:#111827;outline:none}.lang-item button{width:100%;margin-top:8px;border:1px solid #dce5ef;background:#fff;border-radius:9px;padding:8px;font-size:10px;font-weight:650;cursor:pointer}.presets{display:flex;gap:7px;flex-wrap:wrap}.presets button,.upload{border:1px solid #dce5ef;background:#f8fafc;color:#334155;border-radius:10px;padding:9px 12px;font-size:10px;font-weight:650;cursor:pointer}.presets .on{border-color:#176bff;background:#edf4ff;color:#176bff}.upload input{display:none}.overlay-row{display:grid;grid-template-columns:150px 1fr;align-items:center;gap:12px}.overlay-row label{margin:0}.overlay-row input{width:100%}.actions{display:flex;gap:9px;margin-top:25px}.actions button{flex:1;border-radius:12px;padding:12px 14px;font-size:11px;font-weight:700;cursor:pointer}.secondary{border:1px solid #dbe4ee;background:#fff;color:#18283d}.primary{border:0;background:#176bff;color:#fff}.message{margin-top:13px;background:#eef4fb;border-radius:11px;padding:10px 12px;color:#47627f;font-size:10px;line-height:1.5}.stage-sheet footer{margin-top:18px;padding-top:14px;border-top:1px solid #e6ecf2;color:#7b8999;font-size:9px;line-height:1.55}@media(max-width:650px){.language-grid{grid-template-columns:1fr}.overlay-row{grid-template-columns:1fr}.stage-sheet{border-radius:20px;padding:18px}.stage-launch{left:12px;bottom:12px}}
`;
