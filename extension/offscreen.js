// Captures the tab audio, plays it back (so the user still hears the call),
// streams it to Soniox via the backend temp key, and emits subtitle messages.
// Auto-reconnects when Soniox closes the socket (temp-key expiry / blips).

const API_BASE = "https://meet.transflash.app";
const SONIOX_WS = "wss://stt-rt.soniox.com/transcribe-websocket";

let ws = null, stream = null, rec = null, audioCtx = null;
let micStream = null, mixCtx = null, recStream = null, useMic = false;
let seg = { orig: "", trans: "", spk: null };
let target = "ko";
let running = false, stopping = false, openAt = 0, fails = 0;
let fullLines = []; // whole-session segments {spk, o (original), t (translation)}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.target !== "offscreen") return;
  if (msg.type === "start") { target = msg.lang || target; startCap(msg.streamId, msg.resume, msg.mic); }
  else if (msg.type === "pause") { pauseCap(); }
  else if (msg.type === "end") { endCap(!!msg.summarize); }
});

function send(p) { chrome.runtime.sendMessage({ from: "offscreen", ...p }).catch(() => {}); }
function pickMime() { const c = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"]; for (const m of c) if (MediaRecorder.isTypeSupported(m)) return m; return ""; }

async function startCap(streamId, resume, mic) {
  running = true; stopping = false; fails = 0; useMic = !!mic;
  if (!resume) fullLines = [];
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { mandatory: { chromeMediaSource: "tab", chromeMediaSourceId: streamId } }, video: false,
    });
  } catch (e) { send({ type: "status", text: "탭 오디오 오류: " + e.message }); running = false; return; }
  // play back the tab so the user still hears the call (mic is NOT played back → no echo)
  try { audioCtx = new AudioContext(); audioCtx.createMediaStreamSource(stream).connect(audioCtx.destination); if (audioCtx.state === "suspended") audioCtx.resume(); } catch {}
  // optionally mix in the user's microphone so both sides get translated
  recStream = stream;
  if (useMic) {
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mixCtx = new AudioContext();
      const dest = mixCtx.createMediaStreamDestination();
      mixCtx.createMediaStreamSource(stream).connect(dest);
      mixCtx.createMediaStreamSource(micStream).connect(dest);
      recStream = dest.stream;
    } catch (e) {
      send({ type: "status", text: "마이크 사용 불가 — 탭만 번역" });
      micStream = null; recStream = stream;
    }
  }
  openWs();
}

async function openWs() {
  // The offscreen document can't access chrome.storage — ask the worker for a token.
  let authTok = null;
  try { authTok = await chrome.runtime.sendMessage({ cmd: "authToken" }); } catch {}
  const headers = authTok ? { Authorization: "Bearer " + authTok } : {};
  fetch(API_BASE + "/api/soniox-token", { method: "POST", headers })
    .then((r) => r.json().then((d) => { if (!r.ok) throw new Error(d.error || "token"); return d.api_key; }))
    .then((tok) => {
      if (!running || !stream) return;
      const w = new WebSocket(SONIOX_WS); ws = w;
      w.onopen = () => {
        openAt = Date.now();
        w.send(JSON.stringify({
          api_key: tok, model: "stt-rt-v4", audio_format: "auto",
          language_hints: ["ko", "vi", "en", "ja", "zh", "th", "es", "fr"],
          enable_speaker_diarization: true, enable_endpoint_detection: true,
          translation: { type: "one_way", target_language: target },
        }));
        const mime = pickMime();
        try { rec = mime ? new MediaRecorder(recStream, { mimeType: mime }) : new MediaRecorder(recStream); }
        catch (e) { send({ type: "status", text: "녹음 오류: " + e.message }); return; }
        rec.ondataavailable = async (e) => { if (e.data.size && ws && ws.readyState === 1) ws.send(await e.data.arrayBuffer()); };
        rec.start(240);
        send({ type: "status", text: "LIVE" });
      };
      w.onmessage = (ev) => {
        let m; try { m = JSON.parse(ev.data); } catch { return; }
        if (m.error_code) { send({ type: "status", text: "⚠ " + (m.error_message || m.error_code) }); return; }
        let oI = "", tI = "";
        (m.tokens || []).forEach((tk) => {
          const x = tk.text; if (x == null) return;
          if (x === "<end>") { flush(); return; }
          if (tk.translation_status === "translation") { if (tk.is_final) seg.trans += x; else tI += x; }
          else { if (tk.is_final) { seg.orig += x; if (tk.speaker != null) seg.spk = tk.speaker; } else oI += x; }
        });
        const o = (seg.orig + oI).trim(), t = (seg.trans + tI).trim();
        if (o || t) send({ type: "partial", orig: o, trans: t, spk: seg.spk });
        if (m.finished) flush();
      };
      w.onerror = () => {};
      w.onclose = () => {
        ws = null;
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
  if (rec && rec.state !== "inactive") { try { rec.stop(); } catch {} } rec = null;
  if (ws) { try { if (ws.readyState === 1) ws.send(""); ws.close(); } catch {} } ws = null;
  if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; }
  if (micStream) { micStream.getTracks().forEach((t) => t.stop()); micStream = null; }
  if (audioCtx) { audioCtx.close().catch(() => {}); audioCtx = null; }
  if (mixCtx) { mixCtx.close().catch(() => {}); mixCtx = null; }
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
