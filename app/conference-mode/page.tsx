"use client";

import { ChangeEvent, useRef, useState } from "react";
import { useLang, type Lang } from "../../lib/use-lang";

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

// Stage-window sheet copy. The host iframe (conference-pro.html) and this page share the "mr_lang" key,
// so switching the interface language inside the host relabels this sheet too.
const VI = {
  launch: "Màn hình sân khấu",
  launchTip: "Mở phụ đề lớn trong cửa sổ riêng để kéo sang máy chiếu",
  kicker: "FLASH MEET · MÀN HÌNH SÂN KHẤU",
  title: "Màn hình sân khấu",
  intro: "Mỗi ngôn ngữ mở trong một cửa sổ riêng với phụ đề lớn. Kéo cửa sổ sang máy chiếu hoặc màn hình phụ, rồi bấm ⛶ trong cửa sổ để phóng toàn màn hình.",
  steps: ["Chọn ngôn ngữ cho từng cửa sổ", "Chọn nền hợp với sân khấu", "Bấm “Mở 2/3 cửa sổ” rồi kéo sang màn hình trình chiếu"],
  langs: "Ngôn ngữ hiển thị",
  openOne: "Mở riêng",
  bg: "Nền",
  presets: { clean: "Sáng", blue: "Xanh hội nghị", dark: "Xanh navy", black: "Đen" },
  upload: "＋ Tải ảnh lên",
  darkness: "Độ tối nền",
  open2: "Mở 2 cửa sổ",
  open3: "Mở 3 cửa sổ",
  footer: "Cửa sổ sân khấu nhận phụ đề trực tiếp qua Conference ID. Ảnh tải lên chỉ lưu trên máy này, không đưa lên server.",
  close: "Đóng",
  imgOnly: "Chỉ dùng ảnh JPG/PNG/WebP.",
  imgMax: "Ảnh nền tối đa 12MB.",
  imgOpt: "Đang tối ưu ảnh nền…",
  imgReady: "Đã sẵn sàng dùng ảnh nền riêng.",
  imgFail: "Không đọc được ảnh nền.",
  noId: "Chưa có Conference ID. Hãy đăng nhập hoặc đợi Conference ID được tạo rồi thử lại.",
  noIdShort: "Chưa có Conference ID. Hãy đăng nhập trước.",
  blocked: "Trình duyệt đã chặn {n} cửa sổ. Hãy cho phép pop-up cho meet.transflash.app.",
  opened: "Đã mở {n} cửa sổ. Kéo từng cửa sổ sang màn hình khác.",
  popBlocked: "Trình duyệt đang chặn pop-up. Hãy cho phép pop-up cho trang này.",
};
type Dict = typeof VI;
type MsgKey = "imgOnly" | "imgMax" | "imgOpt" | "imgReady" | "imgFail" | "noId" | "noIdShort" | "blocked" | "opened" | "popBlocked";

const T: Record<Lang, Dict> = {
  vi: VI,
  en: {
    launch: "Stage windows",
    launchTip: "Open large captions in separate windows to drag onto the projector",
    kicker: "FLASH MEET · STAGE DISPLAY",
    title: "Stage windows",
    intro: "Each language opens in its own window with large captions. Drag the window to the projector or a second screen, then press ⛶ in the window to go full screen.",
    steps: ["Pick a language for each window", "Choose a background that suits the stage", "Press “Open 2/3 windows” and drag them to the projection screen"],
    langs: "Languages shown",
    openOne: "Open alone",
    bg: "Background",
    presets: { clean: "Light", blue: "Conference Blue", dark: "Dark Navy", black: "Black" },
    upload: "＋ Upload image",
    darkness: "Background darkness",
    open2: "Open 2 windows",
    open3: "Open 3 windows",
    footer: "Stage windows receive live captions through the Conference ID. Uploaded images stay on this computer and are never sent to the server.",
    close: "Close",
    imgOnly: "Use a JPG, PNG or WebP image.",
    imgMax: "Background images can be up to 12MB.",
    imgOpt: "Optimizing the background…",
    imgReady: "Your background image is ready.",
    imgFail: "Couldn’t read that image.",
    noId: "No Conference ID yet. Sign in or wait for the Conference ID to be created, then try again.",
    noIdShort: "No Conference ID yet. Please sign in first.",
    blocked: "The browser blocked {n} window(s). Allow pop-ups for meet.transflash.app.",
    opened: "Opened {n} windows. Drag each one to another screen.",
    popBlocked: "The browser is blocking pop-ups. Allow pop-ups for this page.",
  },
  ko: {
    launch: "무대 화면",
    launchTip: "큰 자막을 별도 창으로 열어 프로젝터로 옮기기",
    kicker: "FLASH MEET · 무대 화면",
    title: "무대 화면",
    intro: "언어마다 큰 자막 창이 따로 열립니다. 창을 프로젝터나 보조 화면으로 옮긴 뒤, 창의 ⛶ 버튼으로 전체 화면을 켜세요.",
    steps: ["창마다 표시할 언어 선택", "무대에 맞는 배경 선택", "“창 2/3개 열기”를 누르고 송출 화면으로 옮기기"],
    langs: "표시 언어",
    openOne: "따로 열기",
    bg: "배경",
    presets: { clean: "라이트", blue: "컨퍼런스 블루", dark: "다크 네이비", black: "블랙" },
    upload: "＋ 이미지 업로드",
    darkness: "배경 어둡기",
    open2: "창 2개 열기",
    open3: "창 3개 열기",
    footer: "무대 화면은 Conference ID로 실시간 자막을 받습니다. 업로드한 이미지는 이 컴퓨터에만 저장되며 서버로 전송되지 않습니다.",
    close: "닫기",
    imgOnly: "JPG, PNG, WebP 이미지만 사용할 수 있습니다.",
    imgMax: "배경 이미지는 최대 12MB입니다.",
    imgOpt: "배경 이미지를 최적화하는 중…",
    imgReady: "배경 이미지가 준비되었습니다.",
    imgFail: "이미지를 읽을 수 없습니다.",
    noId: "아직 Conference ID가 없습니다. 로그인하거나 ID가 만들어질 때까지 기다린 뒤 다시 시도하세요.",
    noIdShort: "아직 Conference ID가 없습니다. 먼저 로그인하세요.",
    blocked: "브라우저가 창 {n}개를 차단했습니다. meet.transflash.app의 팝업을 허용하세요.",
    opened: "창 {n}개를 열었습니다. 각 창을 다른 화면으로 옮기세요.",
    popBlocked: "브라우저가 팝업을 차단하고 있습니다. 이 페이지의 팝업을 허용하세요.",
  },
};

export default function ConferenceModePage() {
  const [lang] = useLang();
  const t = T[lang] || T.en;
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [open, setOpen] = useState(false);
  const [languages, setLanguages] = useState(["ko", "vi", "en"]);
  const [preset, setPreset] = useState("blue");
  const [overlay, setOverlay] = useState(0.18);
  const [customDataUrl, setCustomDataUrl] = useState("");
  const [message, setMessage] = useState<{ k: MsgKey; n?: number } | null>(null);
  const say = (k: MsgKey, n?: number) => setMessage({ k, n });

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
    setMessage(null);
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
    if (!file.type.startsWith("image/")) return say("imgOnly");
    if (file.size > 12 * 1024 * 1024) return say("imgMax");
    try {
      say("imgOpt");
      setCustomDataUrl(await resizeBackground(file));
      setPreset("custom");
      say("imgReady");
    } catch {
      say("imgFail");
    }
  }

  function saveStageConfig(id: string) {
    const cfg: StageConfig = { preset, overlay, ...(customDataUrl ? { customDataUrl } : {}) };
    try { localStorage.setItem(`fm_stage_bg_${id}`, JSON.stringify(cfg)); } catch {}
  }

  function openWindows(n: number) {
    const id = conferenceId();
    if (!id) {
      say("noId");
      return;
    }
    saveStageConfig(id);
    const usable = languages.slice(0, n);
    const sw = window.screen.availWidth || 1440;
    const sh = window.screen.availHeight || 900;
    const width = Math.max(520, Math.floor(sw / Math.min(n, 2)) - 30);
    const height = Math.max(460, Math.floor(sh * 0.78));
    let blocked = 0;
    usable.forEach((l, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const left = 16 + col * (width + 12);
      const top = 40 + row * 90;
      const url = `/conference-stage.html?id=${encodeURIComponent(id)}&lang=${encodeURIComponent(l)}`;
      const w = window.open(url, `flashmeet-stage-${id}-${l}`, `popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=no`);
      if (!w) blocked++;
    });
    if (blocked) say("blocked", blocked);
    else say("opened", n);
  }

  function openOne(i: number) {
    const id = conferenceId();
    if (!id) return say("noIdShort");
    saveStageConfig(id);
    const l = languages[i];
    const url = `/conference-stage.html?id=${encodeURIComponent(id)}&lang=${encodeURIComponent(l)}`;
    const w = window.open(url, `flashmeet-stage-${id}-${l}`, "popup=yes,width=850,height=650,resizable=yes,scrollbars=no");
    if (!w) say("popBlocked");
  }

  const messageText = message ? t[message.k].replace("{n}", String(message.n ?? "")) : "";

  return (
    <main className="stage-host">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <iframe
        ref={frameRef}
        src="/conference-pro.html"
        title="Flash Meet Conference Mode"
        allow="microphone; clipboard-write; fullscreen; display-capture"
        allowFullScreen
        className="host-frame"
      />
      <button className="stage-launch" onClick={showStage} title={t.launchTip}>▣ {t.launch}</button>

      {open && <div className="backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
        <section className="stage-sheet" role="dialog" aria-modal="true" aria-label={t.title}>
          <header><div><small>{t.kicker}</small><h2>{t.title}</h2><p>{t.intro}</p></div><button onClick={() => setOpen(false)} aria-label={t.close}>✕</button></header>

          <ol className="steps">{t.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>

          <div className="group"><label>{t.langs}</label><div className="language-grid">
            {[0,1,2].map(i => <div className="lang-item" key={i}>
              <select value={languages[i]} onChange={e => setLanguages(v => v.map((x,j) => j === i ? e.target.value : x))}>
                {LANGS.map(([value,label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <button onClick={() => openOne(i)}>{t.openOne}</button>
            </div>)}
          </div></div>

          <div className="group"><label>{t.bg}</label><div className="presets">
            {(["clean", "blue", "dark", "black"] as const).map(v =>
              <button key={v} className={preset === v && !customDataUrl ? "on" : ""} onClick={() => { setPreset(v); setCustomDataUrl(""); }}>{t.presets[v]}</button>
            )}
            <label className={customDataUrl ? "upload on" : "upload"}>{t.upload}<input type="file" accept="image/*" onChange={onBackground}/></label>
          </div></div>

          <div className="group overlay-row"><label>{t.darkness} <b>{Math.round(overlay * 100)}%</b></label><input type="range" min="0" max="0.65" step="0.05" value={overlay} onChange={e => setOverlay(Number(e.target.value))}/></div>

          <div className="actions"><button className="secondary" onClick={() => openWindows(2)}>{t.open2}</button><button className="primary" onClick={() => openWindows(3)}>{t.open3}</button></div>
          {message && <div className="message">{messageText}</div>}
          <footer>{t.footer}</footer>
        </section>
      </div>}
    </main>
  );
}

const css = `
*{box-sizing:border-box}.stage-host{width:100%;height:100vh;position:relative;background:#fff}.host-frame{border:0;width:100%;height:100vh;display:block}.stage-launch{position:fixed;left:18px;bottom:18px;z-index:50;border:1px solid rgba(24,53,87,.14);background:rgba(255,255,255,.94);backdrop-filter:blur(14px);color:#10213a;border-radius:13px;padding:11px 15px;font:650 13px "Be Vietnam Pro","Noto Sans KR",Inter,system-ui,sans-serif;box-shadow:0 14px 36px rgba(29,62,105,.16);cursor:pointer}.stage-launch:hover{transform:translateY(-1px)}.backdrop{position:fixed;inset:0;z-index:100;background:rgba(4,10,18,.48);backdrop-filter:blur(10px);display:grid;place-items:center;padding:18px}.stage-sheet{width:min(680px,100%);max-height:94vh;overflow:auto;background:#fff;border-radius:24px;border:1px solid #e2e9f1;box-shadow:0 34px 100px rgba(4,15,30,.24);padding:24px;font-family:"Be Vietnam Pro","Noto Sans KR",Inter,system-ui,sans-serif;color:#101827}.stage-sheet header{display:flex;gap:18px;align-items:flex-start}.stage-sheet header>div{flex:1}.stage-sheet header small{font-size:10px;letter-spacing:.18em;color:#6d7d92;font-weight:700}.stage-sheet h2{font-size:27px;letter-spacing:-.04em;margin:5px 0 4px}.stage-sheet header p{font-size:13px;color:#5b6b80;margin:0;line-height:1.6}.stage-sheet header button{border:0;background:#f1f5f9;border-radius:10px;width:36px;height:36px;cursor:pointer}.steps{margin:16px 0 0;padding:12px 16px 12px 34px;background:#f5f8fc;border-radius:12px;font-size:12.5px;line-height:1.75;color:#334155}.group{margin-top:22px}.group>label{display:block;font-size:12px;font-weight:700;margin-bottom:9px}.language-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.lang-item{border:1px solid #e1e8f0;border-radius:13px;padding:9px;background:#f8fafc}.lang-item select{width:100%;border:0;background:transparent;font:600 13px inherit;color:#111827;outline:none}.lang-item button{width:100%;margin-top:8px;border:1px solid #dce5ef;background:#fff;border-radius:9px;padding:8px;font-size:11.5px;font-weight:650;cursor:pointer}.presets{display:flex;gap:7px;flex-wrap:wrap}.presets button,.upload{border:1px solid #dce5ef;background:#f8fafc;color:#334155;border-radius:10px;padding:9px 12px;font-size:11.5px;font-weight:650;cursor:pointer}.presets .on{border-color:#176bff;background:#edf4ff;color:#176bff}.upload input{display:none}.overlay-row{display:grid;grid-template-columns:170px 1fr;align-items:center;gap:12px}.overlay-row label{margin:0}.overlay-row input{width:100%}.actions{display:flex;gap:9px;margin-top:25px}.actions button{flex:1;border-radius:12px;padding:13px 14px;font-size:13px;font-weight:700;cursor:pointer}.secondary{border:1px solid #dbe4ee;background:#fff;color:#18283d}.primary{border:0;background:#176bff;color:#fff}.message{margin-top:13px;background:#eef4fb;border-radius:11px;padding:10px 12px;color:#47627f;font-size:12px;line-height:1.5}.stage-sheet footer{margin-top:18px;padding-top:14px;border-top:1px solid #e6ecf2;color:#7b8999;font-size:11px;line-height:1.55}@media(max-width:650px){.language-grid{grid-template-columns:1fr}.overlay-row{grid-template-columns:1fr}.stage-sheet{border-radius:20px;padding:18px}.stage-launch{left:12px;bottom:12px}}
`;
