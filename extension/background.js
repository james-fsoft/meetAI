// Service worker: orchestrates tab-audio capture → offscreen Soniox stream → content overlay.

let active = { tabId: null, running: false };

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

async function startCapture(lang) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) throw new Error("No active tab");

  await ensureOffscreen();
  // Inject the subtitle overlay into the meeting page.
  try { await chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: ["content.css"] }); } catch {}
  try { await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] }); } catch {}
  active = { tabId: tab.id, running: true };
  chrome.tabs.sendMessage(tab.id, { from: "bg", type: "show" }).catch(() => {});

  // Get the stream id LAST so it's consumed immediately (ids are short-lived).
  const streamId = await chrome.tabCapture.getMediaStreamId({ targetTabId: tab.id });
  chrome.runtime.sendMessage({ target: "offscreen", type: "start", streamId, lang });
}

function stopCapture() {
  chrome.runtime.sendMessage({ target: "offscreen", type: "stop" });
  if (active.tabId) chrome.tabs.sendMessage(active.tabId, { from: "bg", type: "hide" }).catch(() => {});
  active = { tabId: active.tabId, running: false };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.cmd === "start") {
    startCapture(msg.lang).then(() => sendResponse({ ok: true })).catch((e) => sendResponse({ ok: false, error: e.message }));
    return true; // async
  }
  if (msg.cmd === "stop") { stopCapture(); sendResponse({ ok: true }); return; }
  if (msg.cmd === "getState") { sendResponse(active); return; }

  // Relay results coming up from the offscreen document.
  if (msg.from === "offscreen") {
    if (msg.type === "status" && (msg.text === "STOPPED" || msg.text?.startsWith("⚠") || msg.text?.includes("오류")))
      active.running = false;
    if (active.tabId) chrome.tabs.sendMessage(active.tabId, { ...msg, from: "bg" }).catch(() => {});
    chrome.runtime.sendMessage({ ...msg, from: "bg" }).catch(() => {}); // to popup if open
  }
});
