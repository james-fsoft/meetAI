// Service worker: orchestrates tab-audio capture → offscreen Soniox stream → content overlay.

// source: "tab" (tab audio) | "tabmic" (tab + your mic) | "mic" (microphone only, in-person)
let active = { tabId: null, running: false, lang: "ko", langB: "vi", way: "one", source: "tab" };

async function hasOffscreen() {
  const ctxs = await chrome.runtime.getContexts({ contextTypes: ["OFFSCREEN_DOCUMENT"] });
  return ctxs.length > 0;
}

async function ensureOffscreen() {
  if (await hasOffscreen()) return;
  await chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: ["USER_MEDIA"],
    justification: "Capture tab audio and stream it for real-time translation.",
  });
}

// Recreate a fresh offscreen document so it picks up the current mic permission
// (an offscreen created before the grant stays denied = NotAllowedError).
async function recreateOffscreen() {
  try { if (await hasOffscreen()) await chrome.offscreen.closeDocument(); } catch {}
  await chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: ["USER_MEDIA"],
    justification: "Capture tab audio and stream it for real-time translation.",
  });
}

async function startCapture(lang, resume, sourcev, wayv, langBv, tabIdArg) {
  // Use the tab the popup captured (so a mic-permission tab can't hijack "active").
  let tabId = resume ? active.tabId : tabIdArg;
  if (!tabId) { const [t] = await chrome.tabs.query({ active: true, currentWindow: true }); tabId = t && t.id; }
  if (!tabId) throw new Error("Không tìm thấy tab");

  if (resume) {
    // Resume: the overlay is still alive (paused state) — re-injecting content.js
    // would rebuild it from scratch and wipe the existing transcript lines.
    await ensureOffscreen();
  } else {
    await recreateOffscreen();
    let injected = true;
    try {
      await chrome.scripting.insertCSS({ target: { tabId }, files: ["content.css"] });
      await chrome.scripting.executeScript({ target: { tabId }, files: ["content.js"] });
    } catch { injected = false; }
    // The subtitle overlay lives inside the page — it can't run on chrome:// or a blank tab.
    if (!injected) throw new Error("Mở một trang web thường để hiện phụ đề (không dùng được trên chrome:// hay tab trống).");
  }
  active = {
    tabId, running: true,
    lang: lang || active.lang || "ko",
    langB: (resume ? active.langB : langBv) || active.langB || "vi",
    way: (resume ? active.way : wayv) || "one",
    source: (resume ? active.source : sourcev) || "tab",
  };
  chrome.tabs.sendMessage(tabId, { from: "bg", type: "show", resume: !!resume, lang: active.lang, langB: active.langB, way: active.way }).catch(() => {});

  // Tab audio only when the source uses it; "mic" (in-person) skips tab capture
  // so it works on any page without a meeting/video.
  let streamId = null;
  if (active.source !== "mic") {
    streamId = await chrome.tabCapture.getMediaStreamId({ targetTabId: tabId });
  }
  chrome.runtime.sendMessage({ target: "offscreen", type: "start", streamId, source: active.source, lang: active.lang, langB: active.langB, way: active.way, resume: !!resume });
}

function pauseCapture() {
  chrome.runtime.sendMessage({ target: "offscreen", type: "pause" });
  active.running = false;
}

function endCapture(summarize) {
  chrome.runtime.sendMessage({ target: "offscreen", type: "end", summarize: !!summarize });
  active.running = false;
}

// Returns a valid Supabase access token (refreshing if needed), or null.
// Lives in the service worker because the offscreen document lacks chrome.storage.
async function getAuthToken() {
  const s = await chrome.storage.local.get(["access_token", "refresh_token", "expires_at", "sb_url", "sb_key"]);
  if (!s.access_token) return null;
  const now = Math.floor(Date.now() / 1000);
  if (!s.expires_at || s.expires_at > now + 60) return s.access_token;
  if (s.refresh_token && s.sb_url && s.sb_key) {
    try {
      const r = await fetch(s.sb_url + "/auth/v1/token?grant_type=refresh_token", {
        method: "POST", headers: { "Content-Type": "application/json", apikey: s.sb_key },
        body: JSON.stringify({ refresh_token: s.refresh_token }),
      });
      const d = await r.json();
      if (r.ok && d.access_token) {
        await chrome.storage.local.set({ access_token: d.access_token, refresh_token: d.refresh_token, expires_at: now + (d.expires_in || 3600) });
        return d.access_token;
      }
    } catch {}
  }
  return s.access_token;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.cmd === "start") {
    startCapture(msg.lang, false, msg.source, msg.way, msg.langB, msg.tabId).then(() => sendResponse({ ok: true })).catch((e) => sendResponse({ ok: false, error: e.message }));
    return true;
  }
  if (msg.cmd === "resume") {
    startCapture(active.lang, true).then(() => sendResponse({ ok: true })).catch((e) => sendResponse({ ok: false, error: e.message }));
    return true;
  }
  if (msg.cmd === "pause") { pauseCapture(); sendResponse({ ok: true }); return; }
  if (msg.cmd === "end") { endCapture(msg.summarize); sendResponse({ ok: true }); return; }
  if (msg.cmd === "getState") { sendResponse(active); return; }
  if (msg.cmd === "setLang") { if (msg.lang) active.lang = msg.lang; if (msg.way) active.way = msg.way; if (msg.langB) active.langB = msg.langB; chrome.runtime.sendMessage({ target: "offscreen", type: "setLang", lang: active.lang, way: active.way, langB: active.langB }); sendResponse({ ok: true }); return; }
  if (msg.cmd === "openMicPerm") { chrome.tabs.create({ url: chrome.runtime.getURL("mic-permission.html") }); sendResponse({ ok: true }); return; }
  if (msg.cmd === "authToken") { getAuthToken().then((t) => sendResponse(t)).catch(() => sendResponse(null)); return true; }

  // Relay results coming up from the offscreen document to the page overlay + popup.
  if (msg.from === "offscreen") {
    if (msg.type === "status" && (msg.text === "STOPPED" || msg.text === "PAUSED")) active.running = false;
    if (active.tabId) chrome.tabs.sendMessage(active.tabId, { ...msg, from: "bg" }).catch(() => {});
    chrome.runtime.sendMessage({ ...msg, from: "bg" }).catch(() => {});
  }
});
