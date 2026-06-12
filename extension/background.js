// Service worker: orchestrates tab-audio capture → offscreen Soniox stream → content overlay.

let active = { tabId: null, running: false, lang: "ko" };

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

async function startCapture(lang, resume) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) throw new Error("No active tab");

  await ensureOffscreen();
  try { await chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: ["content.css"] }); } catch {}
  try { await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] }); } catch {}
  active = { tabId: tab.id, running: true, lang: lang || active.lang || "ko" };
  chrome.tabs.sendMessage(tab.id, { from: "bg", type: "show", resume: !!resume }).catch(() => {});

  // Get the stream id LAST so it's consumed immediately (ids are short-lived).
  const streamId = await chrome.tabCapture.getMediaStreamId({ targetTabId: tab.id });
  chrome.runtime.sendMessage({ target: "offscreen", type: "start", streamId, lang: active.lang, resume: !!resume });
}

function pauseCapture() {
  chrome.runtime.sendMessage({ target: "offscreen", type: "pause" });
  active.running = false;
}

function endCapture(summarize) {
  chrome.runtime.sendMessage({ target: "offscreen", type: "end", summarize: !!summarize });
  active.running = false;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.cmd === "start") {
    startCapture(msg.lang, false).then(() => sendResponse({ ok: true })).catch((e) => sendResponse({ ok: false, error: e.message }));
    return true;
  }
  if (msg.cmd === "resume") {
    startCapture(active.lang, true).then(() => sendResponse({ ok: true })).catch((e) => sendResponse({ ok: false, error: e.message }));
    return true;
  }
  if (msg.cmd === "pause") { pauseCapture(); sendResponse({ ok: true }); return; }
  if (msg.cmd === "end") { endCapture(msg.summarize); sendResponse({ ok: true }); return; }
  if (msg.cmd === "getState") { sendResponse(active); return; }

  // Relay results coming up from the offscreen document to the page overlay + popup.
  if (msg.from === "offscreen") {
    if (msg.type === "status" && (msg.text === "STOPPED" || msg.text === "PAUSED")) active.running = false;
    if (active.tabId) chrome.tabs.sendMessage(active.tabId, { ...msg, from: "bg" }).catch(() => {});
    chrome.runtime.sendMessage({ ...msg, from: "bg" }).catch(() => {});
  }
});
