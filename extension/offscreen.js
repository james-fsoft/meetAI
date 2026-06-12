// Captures the tab audio, plays it back (so the user still hears the call),
// streams it to Soniox via the backend temp key, and emits subtitle messages.
// Auto-reconnects when Soniox closes the socket (temp-key expiry / blips).

const API_BASE = "https://meet.transflash.app";
const SONIOX_WS = "wss://stt-rt.soniox.com/transcribe-websocket";

let ws = null, stream = null, rec = null, audioCtx = null;
let seg = { orig: "", trans: "", spk: null };
let target = "ko";
let running = false, stopping = false, openAt = 0, fails = 0;
let fullText = []; // whole-session transcript (with speaker labels) for the summary

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.target !== "offscreen") return;
  if (msg.type === "start") { target = msg.lang || target; startCap(msg.streamId, msg.resume); }
  else if (msg.type === "pause") { pauseCap(); }
  else if (msg.type === "end") { endCap(!!msg.summarize); }
});

function send(p) { chrome.runtime.sendMessage({ from: "offscreen", ...p }).catch(() => {}); }
function pickMime() { const c = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"]; for (const m of c) if (MediaRecorder.isTypeSupported(m)) return m; return ""; }

async function startCap(streamId, resume) {
  running = true; stopping = false; fails = 0;
  if (!resume) fullText = [];
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { mandatory: { chromeMediaSource: "tab", chromeMediaSourceId: streamId } }, video: false,
    });
  } catch (e) { send({ type: "status", text: "탭 오디오 오류: " + e.message }); running = false; return; }
  // keep the meeting audible to the user
  try { audioCtx = new AudioContext(); audioCtx.createMediaStreamSource(stream).connect(audioCtx.destination); if (audioCtx.state === "suspended") audioCtx.resume(); } catch {}
  openWs();
}

// Returns a valid Supabase access token (refreshing if needed), or null.
async function getAuth() {
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

async function openWs() {
  const authTok = await getAuth();
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
        try { rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream); }
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
  if (o) fullText.push((spk != null ? "Speaker " + spk + ": " : "") + o);
  if (o || t) send({ type: "final", orig: o, trans: t, spk });
}

function teardown() {
  if (rec && rec.state !== "inactive") { try { rec.stop(); } catch {} } rec = null;
  if (ws) { try { if (ws.readyState === 1) ws.send(""); ws.close(); } catch {} } ws = null;
  if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; }
  if (audioCtx) { audioCtx.close().catch(() => {}); audioCtx = null; }
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
  if (summarize && fullText.length) summarizeNow(); else fullText = [];
}

// After stopping, summarize the whole session via the backend.
async function summarizeNow() {
  const transcript = fullText.join("\n"); fullText = [];
  send({ type: "summarizing" });
  try {
    const r = await fetch(API_BASE + "/api/summarize", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript }),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || "summary");
    send({ type: "summary", text: (d.summary || "").trim() });
  } catch (e) { send({ type: "summary", text: "⚠ Tóm tắt lỗi: " + e.message }); }
}
