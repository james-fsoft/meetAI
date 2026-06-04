const btn = document.getElementById("toggle");
const lang = document.getElementById("lang");
const status = document.getElementById("status");
let running = false;

function render() {
  btn.textContent = running ? "■ Dừng" : "▶ Bắt đầu";
  btn.className = running ? "stop" : "start";
  lang.disabled = running;
}

chrome.storage.local.get("lang", (d) => { if (d.lang) lang.value = d.lang; });
chrome.runtime.sendMessage({ cmd: "getState" }, (s) => { running = !!(s && s.running); render(); });

btn.onclick = () => {
  if (running) {
    chrome.runtime.sendMessage({ cmd: "stop" }, () => { running = false; render(); status.textContent = ""; });
  } else {
    chrome.storage.local.set({ lang: lang.value });
    status.textContent = "준비 중…";
    chrome.runtime.sendMessage({ cmd: "start", lang: lang.value }, (r) => {
      if (r && r.ok) { running = true; render(); }
      else { status.textContent = "⚠ " + ((r && r.error) || "Không bắt được tab"); }
    });
  }
};

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.from === "bg" && msg.type === "status") {
    status.textContent = msg.text === "LIVE" ? "● Đang dịch trực tiếp" : msg.text;
    if (msg.text === "STOPPED") { running = false; render(); }
  }
});
