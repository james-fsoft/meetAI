# TransFlash Live Translate — Chrome Extension (MVP)

Real-time translation subtitles for browser meetings (Google Meet, Zoom Web, Teams Web).
It captures the **tab audio** (everyone in the call, not just your mic), streams it to
Soniox through the existing backend (`/api/soniox-token`), and shows a draggable subtitle
overlay on the page.

## How it works

```
popup (Start + language)
   └─▶ background (service worker)
          ├─ chrome.tabCapture.getMediaStreamId  → tab audio
          └─▶ offscreen document
                 ├─ getUserMedia(tab) + play back so you still hear the call
                 ├─ fetch /api/soniox-token  (key stays server-side)
                 └─ Soniox WebSocket (stt-rt-v4, one-way translation)
                       └─▶ subtitle messages ─▶ content overlay on the meeting page
```

Backend is reused 100% — same Soniox account, same cost guardrails.

## Load it in Chrome (unpacked)

1. Open `chrome://extensions`
2. Toggle **Developer mode** (top-right)
3. Click **Load unpacked** → select this `extension/` folder
4. Pin the extension (puzzle icon → pin)

## Use

1. Open a meeting tab (e.g. https://meet.google.com/...)
2. Click the extension icon → choose target language → **Bắt đầu**
3. Grant any prompt; subtitles appear at the bottom of the page (drag to move, × to hide)
4. Click **Dừng** to stop

## Config

- API base is `https://meet.transflash.app` (see `offscreen.js` `API_BASE`).
  Change it if you deploy elsewhere, and update `host_permissions` in `manifest.json`.

## Known MVP limitations

- No icons yet (Chrome shows a default). Add `icons/` + `action.default_icon` later.
- Auth/trial limits are not enforced in the extension yet (it hits the public token
  endpoint, which has per-IP + daily caps). Wire login/quota in a later pass.
- Tab capture only — for system-wide audio (native apps) you'd need a desktop app.
- Not yet published to the Chrome Web Store (needs a privacy policy + review).

## Next steps (post-MVP)

- Icons + store listing + privacy policy
- Sign-in (reuse the web session) and per-plan quota
- Save transcript / push to the meeting summary endpoint
- Pause/Resume, font-size control, position presets
