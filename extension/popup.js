const API_BASE = "https://meet.transflash.app";
const btn = document.getElementById("toggle");
const lang = document.getElementById("lang");
const langB = document.getElementById("langB");
const swapIc = document.getElementById("swapIc");
const langLbl = document.getElementById("langLbl");
const modeseg = document.getElementById("modeseg");
const mic = document.getElementById("mic");
const status = document.getElementById("status");
const authBox = document.getElementById("auth");
let running = false;

function getWay() { const b = modeseg.querySelector("button.on"); return b ? b.dataset.w : "one"; }
function applyMode() {
  const two = getWay() === "two";
  langB.style.display = two ? "" : "none";
  swapIc.style.display = two ? "" : "none";
  langLbl.textContent = two ? "Cặp ngôn ngữ (nói tiếng nào ra tiếng kia)" : "Dịch sang / Translate to";
}
modeseg.querySelectorAll("button").forEach((b) => b.onclick = () => {
  modeseg.querySelectorAll("button").forEach((x) => x.classList.remove("on"));
  b.classList.add("on"); chrome.storage.local.set({ way: b.dataset.w }); applyMode();
});
langB.onchange = () => chrome.storage.local.set({ langB: langB.value });

// show the redirect URL (for Supabase config)
document.getElementById("redir").textContent = chrome.identity.getRedirectURL();

function render() {
  btn.textContent = running ? "■ Dừng nhanh" : "▶ Bắt đầu";
  btn.className = running ? "act stop" : "act start";
  lang.disabled = running;
  langB.disabled = running;
  mic.disabled = running;
  modeseg.querySelectorAll("button").forEach((b) => (b.disabled = running));
  // When a session is live, the on-page overlay is the control surface — dim the
  // config here and point the user there so the two windows feel like one flow.
  const cfg = document.getElementById("cfg");
  const runbar = document.getElementById("runbar");
  cfg.style.opacity = running ? ".45" : "1";
  cfg.style.pointerEvents = running ? "none" : "auto";
  runbar.style.display = running ? "block" : "none";
  if (running) runbar.innerHTML = "● Đang dịch trực tiếp<span>Dừng · Tiếp tục · Tóm tắt nằm ở khung phụ đề ngay trên trang →</span>";
}

chrome.storage.local.get(["lang", "langB", "way", "mic"], (d) => {
  if (d.lang) lang.value = d.lang;
  if (d.langB) langB.value = d.langB;
  if (d.way) { modeseg.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.w === d.way)); }
  if (d.mic) mic.checked = true;
  applyMode();
});
chrome.runtime.sendMessage({ cmd: "getState" }, (s) => { running = !!(s && s.running); render(); });
loadMe();
mic.onchange = () => {
  chrome.storage.local.set({ mic: mic.checked });
  if (!mic.checked) { status.textContent = ""; return; }
  // Popups can't prompt for the mic reliably → grant it via a dedicated page.
  chrome.tabs.create({ url: chrome.runtime.getURL("mic-permission.html") });
  status.textContent = "👉 Bấm “Cho phép” ở tab vừa mở, rồi quay lại bấm Bắt đầu";
};

btn.onclick = async () => {
  if (running) {
    chrome.runtime.sendMessage({ cmd: "end", summarize: false }, () => { running = false; render(); status.textContent = ""; });
    return;
  }
  chrome.storage.local.set({ lang: lang.value, langB: langB.value, way: getWay(), mic: mic.checked });
  status.textContent = "준비 중…";
  chrome.runtime.sendMessage({ cmd: "start", lang: lang.value, langB: langB.value, way: getWay(), mic: mic.checked }, (r) => {
    if (r && r.ok) { running = true; render(); }
    else { status.textContent = "⚠ " + ((r && r.error) || "Không bắt được tab"); }
  });
};

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.from === "bg" && msg.type === "status") {
    status.textContent = msg.text === "LIVE" ? "● Đang dịch trực tiếp" : msg.text;
    if (msg.text === "STOPPED" || msg.text === "PAUSED") { running = false; render(); }
  }
});

// ── auth ──
function renderAuth(me) {
  if (me && me.email) {
    authBox.innerHTML =
      '<div class="prof"><span class="em">👤 ' + me.email + '</span>' +
      '<span class="plan ' + (me.plan === "free" ? "free" : "") + '">' + me.plan + "</span>" +
      '<button class="lo" id="logout">Thoát</button></div>';
    document.getElementById("logout").onclick = logout;
  } else {
    authBox.innerHTML =
      '<button class="gbtn" id="gbtn">' +
      '<svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.7 1.2 9.2 3.6l6.8-6.8C35.9 2.4 30.5 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.2C12.4 13.7 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M47 24.5c0-1.6-.2-3.1-.4-4.5H24v9h12.9c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 7.2-10.4 7.2-17.7z"/><path fill="#FBBC05" d="M10.5 28.6A14.5 14.5 0 0 1 9.8 24c0-1.6.3-3.1.8-4.6l-8-6.2A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.2z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.1 1.4-4.9 2.3-8.2 2.3-6.3 0-11.6-4.2-13.5-9.9l-8 6.2C6.5 42.6 14.6 48 24 48z"/></svg>' +
      "Đăng nhập với Google</button>" +
      '<div class="anote">Đăng nhập gói trả phí (Pro/Business) để dịch không giới hạn. Khách dùng thử bị giới hạn.</div>';
    document.getElementById("gbtn").onclick = login;
  }
}

async function loadMe() {
  const s = await chrome.storage.local.get("access_token");
  if (!s.access_token) { renderAuth(null); return; }
  try {
    const r = await fetch(API_BASE + "/api/me", { headers: { Authorization: "Bearer " + s.access_token } });
    if (r.ok) renderAuth(await r.json());
    else renderAuth(null);
  } catch { renderAuth(null); }
}

async function login() {
  authBox.innerHTML = '<div class="anote">Đang mở Google…</div>';
  let cfg;
  try { cfg = await (await fetch(API_BASE + "/api/ext-config")).json(); } catch { renderAuth(null); return; }
  if (!cfg.supabaseUrl) { authBox.innerHTML = '<div class="anote">⚠ Server chưa cấu hình Supabase.</div>'; return; }
  const redirect = chrome.identity.getRedirectURL();
  const url = cfg.supabaseUrl + "/auth/v1/authorize?provider=google&redirect_to=" + encodeURIComponent(redirect);
  chrome.identity.launchWebAuthFlow({ url, interactive: true }, async (resp) => {
    if (chrome.runtime.lastError || !resp) { renderAuth(null); return; }
    const frag = (resp.split("#")[1] || resp.split("?")[1] || "");
    const p = new URLSearchParams(frag);
    const at = p.get("access_token"), rt = p.get("refresh_token"), exp = p.get("expires_in");
    if (!at) { renderAuth(null); return; }
    await chrome.storage.local.set({
      access_token: at, refresh_token: rt,
      expires_at: Math.floor(Date.now() / 1000) + parseInt(exp || "3600", 10),
      sb_url: cfg.supabaseUrl, sb_key: cfg.anonKey,
    });
    loadMe();
  });
}

function logout() {
  chrome.storage.local.remove(["access_token", "refresh_token", "expires_at"], () => renderAuth(null));
}
