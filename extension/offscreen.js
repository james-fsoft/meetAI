// Captures the tab audio stream, plays it back (so the user still hears the call),
// streams it to Soniox via the backend temp key, and emits subtitle messages.

const API_BASE = "https://meet.transflash.app";
const SONIOX_WS = "wss://stt-rt.soniox.com/transcribe-websocket";

let ws = null, stream = null, rec = null, audioCtx = null;
let seg = { orig: "", trans: "" };
let target = "ko";

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.target !== "offscreen") return;
  if (msg.type === "start") { target = msg.lang || "ko"; start(msg.streamId); }
  else if (msg.type === "stop") { stop(); }
});

function send(payload) { chrome.runtime.sendMessage({ from: "offscreen", ...payload }).catch(() => {}); }

function pickMime() {
  const c = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  for (const m of c) if (MediaRecorder.isTypeSupported(m)) return m;
  return "";
}

async function start(streamId) {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { mandatory: { chromeMediaSource: "tab", chromeMediaSourceId: streamId } },
      video: false,
    });
  } catch (e) { send({ type: "status", text: "탭 오디오 오류: " + e.message }); return; }

  // Keep the meeting audible to the user (tab capture would otherwise mute it).
  try {
    audioCtx = new AudioContext();
    audioCtx.createMediaStreamSource(stream).connect(audioCtx.destination);
    if (audioCtx.state === "suspended") audioCtx.resume();
  } catch {}

  let tok;
  try {
    const r = await fetch(API_BASE + "/api/soniox-token", { method: "POST" });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || "token");
    tok = d.api_key;
  } catch (e) { send({ type: "status", text: "토큰 오류: " + e.message }); stop(); return; }

  ws = new WebSocket(SONIOX_WS);
  ws.onopen = () => {
    ws.send(JSON.stringify({
      api_key: tok, model: "stt-rt-v4", audio_format: "auto",
      language_hints: ["ko", "vi", "en", "ja", "zh", "th", "es", "fr"],
      enable_speaker_diarization: true, enable_endpoint_detection: true,
      translation: { type: "one_way", target_language: target },
    }));
    const mime = pickMime();
    try { rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream); }
    catch (e) { send({ type: "status", text: "녹음 오류: " + e.message }); return; }
    rec.ondataavailable = async (e) => { if (e.data.size && ws && ws.readyState === 1) ws.send(await e.data.arrayBuffer()); };
    rec.start(240);
    send({ type: "status", text: "LIVE" });
  };
  ws.onmessage = (ev) => {
    let m; try { m = JSON.parse(ev.data); } catch { return; }
    if (m.error_code) { send({ type: "status", text: "⚠ " + (m.error_message || m.error_code) }); return; }
    let oI = "", tI = "";
    (m.tokens || []).forEach((tk) => {
      const x = tk.text; if (x == null) return;
      if (x === "<end>") { flush(); return; }
      if (tk.translation_status === "translation") { if (tk.is_final) seg.trans += x; else tI += x; }
      else { if (tk.is_final) seg.orig += x; else oI += x; }
    });
    const o = (seg.orig + oI).trim(), t = (seg.trans + tI).trim();
    if (o || t) send({ type: "partial", orig: o, trans: t });
    if (m.finished) flush();
  };
  ws.onerror = () => send({ type: "status", text: "⚠ 연결 오류" });
  ws.onclose = () => {};
}

function flush() {
  const o = seg.orig.trim(), t = seg.trans.trim();
  seg.orig = ""; seg.trans = "";
  if (o || t) send({ type: "final", orig: o, trans: t });
}

function stop() {
  if (rec && rec.state !== "inactive") { try { rec.stop(); } catch {} } rec = null;
  if (ws) { try { if (ws.readyState === 1) ws.send(""); ws.close(); } catch {} } ws = null;
  if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; }
  if (audioCtx) { audioCtx.close().catch(() => {}); audioCtx = null; }
  seg = { orig: "", trans: "" };
  send({ type: "status", text: "STOPPED" });
}
