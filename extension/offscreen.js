// Captures the tab audio, plays it back (so the user still hears the call),
// streams it to Soniox via the backend temp key, and emits subtitle messages.
// Auto-reconnects when Soniox closes the socket (temp-key expiry / blips).

const API_BASE = "https://meet.transflash.app";
const SONIOX_WS = "wss://stt-rt.soniox.com/transcribe-websocket";

let ws = null, stream = null, rec = null, audioCtx = null;
let micStream = null, recStream = null, useMic = false;
let seg = { orig: "", trans: "", spk: null };
let target = "ko", way = "one", langB = "vi";
let running = false, stopping = false, openAt = 0, fails = 0;
let fullLines = []; // whole-session segments {spk, o (original), t (translation)}
let meterTimer = null, meterLast = 0; // usage metering (only while audio is live)
let autoSumTimer = null, autoSumBusy = false; // periodic auto-summary for long sessions
let sxLastTrans = 0, sxLastOrig = 0, sxWatch = null; // translation-stall watchdog
// Self-heal: Soniox sometimes keeps streaming the ORIGINAL but the translation
// stalls (no socket close), so the overlay shows source-only until manual
// stop/resume. If audio is flowing but no translation for 18s, force a clean
// reconnect (fresh temp key).
function startWatch() {
  stopWatch();
  sxWatch = setInterval(() => {
    if (!running || stopping || !ws || ws.readyState !== 1) return;
    const now = Date.now(), base = sxLastTrans || openAt;
    if (sxLastOrig && now - sxLastOrig < 7000 && base && now - base > 18000) {
      sxLastTrans = now; try { ws.close(); } catch {} // onclose → openWs reconnects
    }
  }, 5000);
}
function stopWatch() { if (sxWatch) { clearInterval(sxWatch); sxWatch = null; } }

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.target !== "offscreen") return;
  if (msg.type === "start") { target = msg.lang || target; way = msg.way || "one"; if (msg.langB) langB = msg.langB; startCap(msg.streamId, msg.resume, msg.source || "tab"); }
  else if (msg.type === "pause") { pauseCap(); }
  else if (msg.type === "end") { endCap(!!msg.summarize); }
  else if (msg.type === "setLang") { if (msg.lang) target = msg.lang; if (msg.way) way = msg.way; if (msg.langB) langB = msg.langB; if (ws) { try { ws.close(); } catch {} } } // reconnect with new config
});

function send(p) { chrome.runtime.sendMessage({ from: "offscreen", ...p }).catch(() => {}); }

// ── usage metering ─────────────────────────────────────────────────────────
// Reports streamed seconds to the backend so extension usage counts against the
// same per-user quota as the web app. Only counts wall-clock while a socket is
// actually open (paused between reconnects), so dead gaps aren't charged.
async function reportUsage(sec) {
  if (sec <= 0) return;
  let authTok = null;
  try { authTok = await chrome.runtime.sendMessage({ cmd: "authToken" }); } catch {}
  if (!authTok) return; // not signed in → nothing to meter against
  try {
    await fetch(API_BASE + "/api/usage", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + authTok },
      body: JSON.stringify({ seconds: Math.min(120, sec) }),
    });
  } catch {}
}
function meterFlush() {
  if (!meterLast) return;
  const now = Date.now();
  const sec = Math.round((now - meterLast) / 1000);
  if (sec > 0) { meterLast = now; reportUsage(sec); }
}
function meterResume() { meterLast = Date.now(); if (!meterTimer) meterTimer = setInterval(meterFlush, 60_000); }
function meterPauseSeg() { meterFlush(); meterLast = 0; }            // socket closed (reconnect gap)
function meterStopAll() { meterFlush(); meterLast = 0; if (meterTimer) { clearInterval(meterTimer); meterTimer = null; } }
function pickMime() { const c = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"]; for (const m of c) if (MediaRecorder.isTypeSupported(m)) return m; return ""; }

async function startCap(streamId, resume, source) {
  running = true; stopping = false; fails = 0;
  const useTab = source !== "mic";          // "mic" = in-person, no tab capture
  useMic = source === "mic" || source === "tabmic";
  if (!resume) fullLines = [];

  // Tab audio (skipped for mic-only / in-person mode)
  stream = null;
  if (useTab) {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { mandatory: { chromeMediaSource: "tab", chromeMediaSourceId: streamId } }, video: false,
      });
    } catch (e) { send({ type: "status", text: "탭 오디오 오류: " + e.message }); running = false; return; }
  }

  // Microphone
  micStream = null; let micErr = "";
  if (useMic) {
    try { micStream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch (e) { micErr = e.name || e.message || "lỗi"; micStream = null; }
  }
  if (useMic && !micStream) {
    if (!useTab) { send({ type: "status", text: "🎤 Mic lỗi (" + micErr + ") — cấp quyền micro rồi thử lại." }); running = false; return; }
    send({ type: "micWarn", text: "⚠ Mic KHÔNG hoạt động (" + micErr + ") — chỉ dịch tiếng trong tab. Hãy cấp quyền micro, hoặc đóng app đang chiếm mic (Zoom/Meet)." });
  } else send({ type: "micWarn", text: "" });

  // Audio graph → Soniox. Tab is also played back so the user still hears the call;
  // the mic is never played back (avoids echo/feedback).
  recStream = stream || micStream;
  try {
    audioCtx = new AudioContext();
    const dest = audioCtx.createMediaStreamDestination();
    if (stream) { const tabSrc = audioCtx.createMediaStreamSource(stream); tabSrc.connect(audioCtx.destination); tabSrc.connect(dest); }
    if (micStream) audioCtx.createMediaStreamSource(micStream).connect(dest);
    if (audioCtx.state === "suspended") audioCtx.resume();
    recStream = dest.stream;
  } catch (e) { recStream = stream || micStream; }
  openWs();
  startAutoSum();
}

// ── periodic auto-summary (long meetings) ───────────────────────────────────
// Every 15 min, summarize the session-so-far and push it + the full transcript
// to the overlay, so a 3-hour meeting isn't one slow summary at the end and the
// user can copy/download a recent snapshot at any time (anti data-loss).
function startAutoSum() { stopAutoSum(); autoSumTimer = setInterval(autoSummarize, 900000); }
function stopAutoSum() { if (autoSumTimer) { clearInterval(autoSumTimer); autoSumTimer = null; } }
async function autoSummarize() {
  if (autoSumBusy || fullLines.length < 2) return;
  const sumInput = fullLines.map((l) => (l.spk != null ? "Speaker " + l.spk + ": " : "") + (l.o || "")).join("\n");
  if (sumInput.trim().length < 120) return;
  const transcript = buildTranscript();
  autoSumBusy = true;
  try {
    let authTok = null; try { authTok = await chrome.runtime.sendMessage({ cmd: "authToken" }); } catch {}
    const r = await fetch(API_BASE + "/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(authTok ? { Authorization: "Bearer " + authTok } : {}) },
      body: JSON.stringify({ transcript: sumInput }),
    });
    const d = await r.json();
    if (r.ok && d.summary) send({ type: "partialSummary", text: (d.summary || "").trim(), transcript });
  } catch (e) {} finally { autoSumBusy = false; }
}

async function openWs() {
  // The offscreen document can't access chrome.storage — ask the worker for a token.
  let authTok = null;
  try { authTok = await chrome.runtime.sendMessage({ cmd: "authToken" }); } catch {}
  const headers = authTok ? { Authorization: "Bearer " + authTok } : {};
  fetch(API_BASE + "/api/soniox-token", { method: "POST", headers })
    .then((r) => r.json().then((d) => {
      if (!r.ok) { const e = new Error(d.error || "token"); e.quota = (r.status === 403 || d.code === "quota_exceeded"); throw e; }
      return d.api_key;
    }))
    .then((tok) => {
      if (!running || !stream) return;
      const w = new WebSocket(SONIOX_WS); ws = w;
      w.onopen = () => {
        openAt = Date.now(); sxLastTrans = 0; sxLastOrig = 0; startWatch();
        const two = way === "two";
        w.send(JSON.stringify({
          api_key: tok, model: "stt-rt-v4", audio_format: "auto",
          language_hints: two ? [target, langB] : ["ko", "vi", "en", "ja", "zh", "th", "es", "fr"],
          enable_speaker_diarization: true, enable_endpoint_detection: true,
          translation: two
            ? { type: "two_way", language_a: target, language_b: langB }
            : { type: "one_way", target_language: target },
        }));
        const mime = pickMime();
        try { rec = mime ? new MediaRecorder(recStream, { mimeType: mime }) : new MediaRecorder(recStream); }
        catch (e) { send({ type: "status", text: "녹음 오류: " + e.message }); return; }
        rec.ondataavailable = async (e) => { if (e.data.size && ws && ws.readyState === 1) ws.send(await e.data.arrayBuffer()); };
        rec.start(240);
        meterResume();
        send({ type: "status", text: "LIVE" });
      };
      w.onmessage = (ev) => {
        let m; try { m = JSON.parse(ev.data); } catch { return; }
        if (m.error_code) { send({ type: "status", text: "⚠ " + (m.error_message || m.error_code) }); return; }
        let oI = "", tI = "";
        (m.tokens || []).forEach((tk) => {
          const x = tk.text; if (x == null) return;
          if (x === "<end>") { flush(); return; }
          if (tk.translation_status === "translation") { if (tk.is_final) seg.trans += x; else tI += x; sxLastTrans = Date.now(); }
          else { if (tk.is_final) { seg.orig += x; if (tk.speaker != null) seg.spk = tk.speaker; } else oI += x; sxLastOrig = Date.now(); }
        });
        const o = (seg.orig + oI).trim(), t = (seg.trans + tI).trim();
        if (o || t) send({ type: "partial", orig: o, trans: t, spk: seg.spk });
        if (m.finished) flush();
      };
      w.onerror = () => {};
      w.onclose = () => {
        ws = null; stopWatch();
        meterPauseSeg();
        if (rec && rec.state !== "inactive") { try { rec.stop(); } catch {} } rec = null;
        flush();
        const lasted = openAt ? Date.now() - openAt : 0; openAt = 0;
        if (lasted > 5000) fails = 0; else fails++;
        if (running && !stopping) {
          if (fails >= 4) { send({ type: "status", text: "⚠ 연결 실패 — 잔액/네트워크 확인" }); return; }
          setTimeout(() => { if (running && !stopping) openWs(); }, 700);
        }
      };
    })
    .catch((e) => {
      if (e.quota) { // out of quota → stop cleanly, no retries
        running = false; stopping = true; meterStopAll();
        send({ type: "status", text: "⚠ " + e.message });
        return;
      }
      send({ type: "status", text: "토큰 오류: " + e.message });
      if (running && !stopping) { fails++; if (fails < 4) setTimeout(() => { if (running && !stopping) openWs(); }, 1500); }
    });
}

function flush() {
  const o = seg.orig.trim(), t = seg.trans.trim(), spk = seg.spk;
  seg = { orig: "", trans: "", spk: null };
  if (o || t) { fullLines.push({ spk, o, t }); send({ type: "final", orig: o, trans: t, spk }); }
}

// Build a readable transcript file: original (script) + translation per turn.
function buildTranscript() {
  return fullLines.map((l) => {
    const who = l.spk != null ? "Speaker " + l.spk : "";
    let s = (who ? who + "\n" : "") + (l.o || "");
    if (l.t) s += "\n→ " + l.t;
    return s;
  }).join("\n\n");
}

function teardown() {
  meterStopAll(); stopAutoSum(); stopWatch();
  if (rec && rec.state !== "inactive") { try { rec.stop(); } catch {} } rec = null;
  if (ws) { try { if (ws.readyState === 1) ws.send(""); ws.close(); } catch {} } ws = null;
  if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; }
  if (micStream) { micStream.getTracks().forEach((t) => t.stop()); micStream = null; }
  if (audioCtx) { audioCtx.close().catch(() => {}); audioCtx = null; }
  recStream = null;
}

// Pause: stop streaming but keep the transcript so the session can resume.
function pauseCap() {
  running = false; stopping = true;
  teardown(); flush();
  send({ type: "status", text: "PAUSED" });
}

// End: stop for good; optionally summarize the whole session.
function endCap(summarize) {
  running = false; stopping = true;
  teardown(); flush();
  send({ type: "status", text: "STOPPED" });
  if (summarize && fullLines.length) summarizeNow();
  else fullLines = [];
}

// After stopping, summarize the whole session via the backend.
async function summarizeNow() {
  const transcript = buildTranscript();
  const sumInput = fullLines.map((l) => (l.spk != null ? "Speaker " + l.spk + ": " : "") + (l.o || "")).join("\n");
  fullLines = [];
  send({ type: "summarizing" });
  try {
    const r = await fetch(API_BASE + "/api/summarize", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: sumInput }),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || "summary");
    send({ type: "summary", text: (d.summary || "").trim(), transcript });
  } catch (e) { send({ type: "summary", text: "⚠ Tóm tắt lỗi: " + e.message, transcript }); }
}
