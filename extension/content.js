// Injected into the meeting page: shows a draggable subtitle overlay and renders
// translation messages relayed from the background service worker.
(function () {
  // Replace any previous (possibly orphaned after an extension reload) instance.
  if (window.__ttCleanup) { try { window.__ttCleanup(); } catch (e) {} }
  const old = document.getElementById("tt-overlay");
  if (old) old.remove();

  const LANGS = [["ko", "🇰🇷 KO"], ["vi", "🇻🇳 VI"], ["en", "🇺🇸 EN"], ["ja", "🇯🇵 JA"], ["zh", "🇨🇳 ZH"], ["th", "🇹🇭 TH"], ["es", "🇪🇸 ES"], ["fr", "🇫🇷 FR"]];
  const LANG_OPTS = LANGS.map(([v, l]) => '<option value="' + v + '">' + l + "</option>").join("");
  const LOGO = chrome.runtime.getURL("icons/icon16.png");

  const box = document.createElement("div");
  box.id = "tt-overlay";
  box.innerHTML =
    '<div class="tt-head"><img class="tt-logo" src="' + LOGO + '" alt="">' +
    '<span class="tt-brand">TransFlash<span class="tt-sub"> · Live Translate</span></span>' +
    '<select class="tt-lang" id="tt-lang" title="Dịch sang">' + LANG_OPTS + "</select>" +
    '<span class="tt-st" id="tt-st">준비 중…</span>' +
    '<span class="tt-acts">' +
    '<button class="tt-act pause" id="tt-pause">⏸ Dừng</button>' +
    '<button class="tt-act resume" id="tt-resume" style="display:none">▶ Tiếp tục</button>' +
    '<button class="tt-act sum" id="tt-sumbtn">⏹ Tóm tắt</button>' +
    '<button class="tt-act" id="tt-close" style="display:none">× Đóng</button></span></div>' +
    '<div id="tt-micwarn" style="display:none"></div>' +
    '<div id="tt-lines"></div><div id="tt-sum" style="display:none"></div>' +
    '<div class="tt-grip" id="tt-grip" title="Kéo để chỉnh kích thước">' +
    '<svg width="14" height="14" viewBox="0 0 14 14"><g stroke="#cfe0ff" stroke-width="1.6" stroke-linecap="round">' +
    '<line x1="13" y1="2" x2="2" y2="13"/><line x1="13" y1="6.5" x2="6.5" y2="13"/><line x1="13" y1="11" x2="11" y2="13"/></g></svg></div>';
  document.documentElement.appendChild(box);

  const lines = box.querySelector("#tt-lines");
  const sumEl = box.querySelector("#tt-sum");
  const head = box.querySelector(".tt-head");
  const stEl = box.querySelector("#tt-st");
  const btnPause = box.querySelector("#tt-pause");
  const btnResume = box.querySelector("#tt-resume");
  const btnSum = box.querySelector("#tt-sumbtn");
  const btnClose = box.querySelector("#tt-close");
  const langSel = box.querySelector("#tt-lang");
  const micWarnEl = box.querySelector("#tt-micwarn");
  [btnPause, btnResume, btnSum, btnClose, langSel].forEach((b) => b.addEventListener("mousedown", (e) => e.stopPropagation()));
  langSel.onchange = () => chrome.runtime.sendMessage({ cmd: "setLang", lang: langSel.value });
  micWarnEl.style.cursor = "pointer";
  micWarnEl.onclick = () => chrome.runtime.sendMessage({ cmd: "openMicPerm" });
  function setMicWarn(text) {
    if (text) { micWarnEl.textContent = text + "   👉 Bấm vào đây để cấp quyền micro"; micWarnEl.style.display = "block"; }
    else micWarnEl.style.display = "none";
  }
  // m = "live" | "paused" | "stopped"
  function setMode(m) {
    btnPause.style.display = m === "live" ? "" : "none";
    btnResume.style.display = m === "paused" ? "" : "none";
    btnSum.style.display = m === "stopped" ? "none" : "";
    btnClose.style.display = m === "stopped" || m === "paused" ? "" : "none";
    if (m !== "stopped") btnSum.textContent = "⏹ Tóm tắt";
  }
  btnPause.onclick = () => { chrome.runtime.sendMessage({ cmd: "pause" }); setMode("paused"); setStatus("PAUSED"); };
  btnResume.onclick = () => { chrome.runtime.sendMessage({ cmd: "resume" }); setMode("live"); };
  btnSum.onclick = () => { chrome.runtime.sendMessage({ cmd: "end", summarize: true }); btnSum.textContent = "đang xử lý…"; };
  btnClose.onclick = () => { chrome.runtime.sendMessage({ cmd: "end", summarize: false }); box.style.display = "none"; };

  function md(x) {
    return esc(x)
      .replace(/^#{1,3}\s*(.*)$/gm, '<b class="tt-h">$1</b>')
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      .replace(/^[-*]\s+(.*)$/gm, "• $1")
      .replace(/\n/g, "<br>");
  }
  function showSummarizing() {
    box.style.display = "flex"; lines.style.display = "none"; sumEl.style.display = "block";
    sumEl.innerHTML = '<div class="tt-sum-h">📝 Đang tóm tắt…</div><div class="tt-sum-b" style="color:#9fb3d6">Vui lòng đợi vài giây.</div>';
  }
  function dlFile(content, name) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content || ""], { type: "text/plain;charset=utf-8" }));
    a.download = name; a.click();
  }
  function showSummary(text, transcript) {
    box.style.display = "flex"; lines.style.display = "none"; sumEl.style.display = "block";
    sumEl.innerHTML =
      '<div class="tt-sum-h">📝 Tóm tắt<span class="tt-sum-act">' +
      '<button id="tt-copy">Copy</button>' +
      '<button id="tt-dl">Tải tóm tắt</button>' +
      (transcript ? '<button id="tt-dltr">Tải transcript</button>' : "") +
      '</span></div>' +
      '<div class="tt-sum-b">' + md(text) + "</div>";
    sumEl.querySelector("#tt-copy").onclick = () => navigator.clipboard.writeText(text);
    sumEl.querySelector("#tt-dl").onclick = () => dlFile(text, "summary.txt");
    const tr = sumEl.querySelector("#tt-dltr");
    if (tr) tr.onclick = () => dlFile(transcript, "transcript.txt");
  }

  function setStatus(text) {
    if (text === "LIVE") { stEl.textContent = "● đang dịch"; stEl.className = "tt-st ok"; }
    else if (text === "PAUSED") { stEl.textContent = "⏸ tạm dừng"; stEl.className = "tt-st"; }
    else if (text === "STOPPED") { stEl.textContent = "đã dừng"; stEl.className = "tt-st"; }
    else { stEl.textContent = text; stEl.className = "tt-st err"; }
  }

  let cur = null;
  const esc = (s) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  function html(o, t, spk) {
    const name = spk != null ? '<div class="tt-spk" data-s="' + (((spk - 1) % 6 + 6) % 6) + '">Speaker ' + esc(String(spk)) + "</div>" : "";
    return name + '<div class="tt-o">' + esc(o) + '</div><div class="tt-t">' + esc(t) + "</div>";
  }
  function trim() { while (lines.children.length > 7) lines.removeChild(lines.firstChild); }

  function partial(o, t, spk) {
    if (!cur) { cur = document.createElement("div"); cur.className = "tt-line cur"; lines.appendChild(cur); }
    cur.innerHTML = html(o, t, spk); trim(); lines.scrollTop = lines.scrollHeight;
  }
  function final(o, t, spk) {
    if (!cur) { cur = document.createElement("div"); cur.className = "tt-line"; lines.appendChild(cur); }
    cur.className = "tt-line"; cur.innerHTML = html(o, t, spk); cur = null; trim(); lines.scrollTop = lines.scrollHeight;
  }

  function onBg(msg) {
    if (msg.from !== "bg") return;
    if (msg.type === "show") { box.style.display = "flex"; sumEl.style.display = "none"; lines.style.display = "block"; setMicWarn(""); if (msg.lang) langSel.value = msg.lang; if (!msg.resume) { lines.innerHTML = ""; cur = null; } setMode("live"); }
    else if (msg.type === "hide") box.style.display = "none";
    else if (msg.type === "status") { setStatus(msg.text); if (msg.text === "PAUSED") setMode("paused"); else if (msg.text === "STOPPED") setMode("stopped"); }
    else if (msg.type === "micWarn") setMicWarn(msg.text);
    else if (msg.type === "summarizing") { setMode("stopped"); showSummarizing(); }
    else if (msg.type === "summary") { setMode("stopped"); showSummary(msg.text, msg.transcript); }
    else if (msg.type === "partial") partial(msg.orig, msg.trans, msg.spk);
    else if (msg.type === "final") final(msg.orig, msg.trans, msg.spk);
  }
  chrome.runtime.onMessage.addListener(onBg);

  // drag (header) + resize (corner grip)
  const grip = box.querySelector("#tt-grip");
  let dx = 0, dy = 0, dragging = false;
  let rz = false, rx = 0, ry = 0, rw = 0, rh = 0;
  function detach() {
    const r = box.getBoundingClientRect();
    box.style.transform = "none"; box.style.left = r.left + "px"; box.style.top = r.top + "px"; box.style.bottom = "auto";
    return r;
  }
  function onHeadDown(e) { dragging = true; const r = detach(); dx = e.clientX - r.left; dy = e.clientY - r.top; e.preventDefault(); }
  function onGripDown(e) { rz = true; const r = detach(); rx = e.clientX; ry = e.clientY; rw = r.width; rh = r.height; e.preventDefault(); e.stopPropagation(); }
  function onMove(e) {
    if (rz) {
      const w = Math.min(Math.max(rw + (e.clientX - rx), 300), window.innerWidth * 0.96);
      const h = Math.min(Math.max(rh + (e.clientY - ry), 130), window.innerHeight * 0.88);
      box.style.width = w + "px"; box.style.height = h + "px";
    } else if (dragging) {
      box.style.left = (e.clientX - dx) + "px"; box.style.top = (e.clientY - dy) + "px";
    }
  }
  function onUp() { dragging = false; rz = false; }
  head.addEventListener("mousedown", onHeadDown);
  grip.addEventListener("mousedown", onGripDown);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);

  window.__ttCleanup = function () {
    try { box.remove(); } catch (e) {}
    try { chrome.runtime.onMessage.removeListener(onBg); } catch (e) {}
    try { window.removeEventListener("mousemove", onMove); } catch (e) {}
    try { window.removeEventListener("mouseup", onUp); } catch (e) {}
  };
})();
