// Injected into the meeting page: shows a draggable subtitle overlay and renders
// translation messages relayed from the background service worker.
(function () {
  if (window.__ttInjected) return;
  window.__ttInjected = true;

  const box = document.createElement("div");
  box.id = "tt-overlay";
  box.innerHTML =
    '<div class="tt-head"><span class="tt-dot"></span><span>LIVE TRANSLATE</span>' +
    '<span class="tt-st" id="tt-st">준비 중…</span><span class="tt-x" title="Hide">×</span></div>' +
    '<div id="tt-lines"></div><div id="tt-sum" style="display:none"></div>';
  document.documentElement.appendChild(box);

  const lines = box.querySelector("#tt-lines");
  const sumEl = box.querySelector("#tt-sum");
  const head = box.querySelector(".tt-head");
  const stEl = box.querySelector("#tt-st");
  box.querySelector(".tt-x").onclick = () => { box.style.display = "none"; };

  function md(x) {
    return esc(x)
      .replace(/^#{1,3}\s*(.*)$/gm, '<b class="tt-h">$1</b>')
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      .replace(/^[-*]\s+(.*)$/gm, "• $1")
      .replace(/\n/g, "<br>");
  }
  function showSummarizing() {
    box.style.display = "block"; lines.style.display = "none"; sumEl.style.display = "block";
    sumEl.innerHTML = '<div class="tt-sum-h">📝 Đang tóm tắt…</div><div class="tt-sum-b" style="color:#9fb3d6">Vui lòng đợi vài giây.</div>';
  }
  function showSummary(text) {
    box.style.display = "block"; lines.style.display = "none"; sumEl.style.display = "block";
    sumEl.innerHTML =
      '<div class="tt-sum-h">📝 Tóm tắt<span class="tt-sum-act">' +
      '<button id="tt-copy">Copy</button><button id="tt-dl">Tải</button>' +
      '<button id="tt-back">↩ Phụ đề</button></span></div>' +
      '<div class="tt-sum-b">' + md(text) + "</div>";
    sumEl.querySelector("#tt-copy").onclick = () => navigator.clipboard.writeText(text);
    sumEl.querySelector("#tt-dl").onclick = () => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
      a.download = "summary.txt"; a.click();
    };
    sumEl.querySelector("#tt-back").onclick = () => { sumEl.style.display = "none"; lines.style.display = "block"; };
  }

  function setStatus(text) {
    if (text === "LIVE") { stEl.textContent = "● đang dịch"; stEl.className = "tt-st ok"; }
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

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.from !== "bg") return;
    if (msg.type === "show") { box.style.display = "block"; sumEl.style.display = "none"; lines.style.display = "block"; lines.innerHTML = ""; cur = null; }
    else if (msg.type === "hide") box.style.display = "none";
    else if (msg.type === "status") setStatus(msg.text);
    else if (msg.type === "summarizing") showSummarizing();
    else if (msg.type === "summary") showSummary(msg.text);
    else if (msg.type === "partial") partial(msg.orig, msg.trans, msg.spk);
    else if (msg.type === "final") final(msg.orig, msg.trans, msg.spk);
  });

  // drag to reposition
  let dx = 0, dy = 0, dragging = false;
  head.addEventListener("mousedown", (e) => {
    dragging = true; const r = box.getBoundingClientRect();
    dx = e.clientX - r.left; dy = e.clientY - r.top;
    box.style.transform = "none"; box.style.left = r.left + "px"; box.style.top = r.top + "px"; box.style.bottom = "auto";
    e.preventDefault();
  });
  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    box.style.left = (e.clientX - dx) + "px"; box.style.top = (e.clientY - dy) + "px";
  });
  window.addEventListener("mouseup", () => { dragging = false; });
})();
