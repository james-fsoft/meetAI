# Chrome Web Store — Listing & Submission Pack
TransFlash Live Translate — v0.12.3

Upload file: `transflash-extension-v0.12.3.zip`

---

## 1. Store listing (copy-paste)

**Name**
TransFlash – Live Meeting Translate

**Summary (≤132 chars)**
Real-time translated subtitles for online meetings & videos. Captures tab audio, translates live, and writes an AI summary.

**Category:** Productivity
**Language:** English (default) — also works for Korean, Vietnamese, Japanese, Chinese…

**Description**
TransFlash adds real-time translated subtitles to any audio playing in your browser — Google Meet, Zoom (web), Microsoft Teams (web), YouTube, and more.

Click Start, and a movable, resizable subtitle box appears on the page showing both the original speech and the live translation. Separate speakers are detected automatically (Speaker 1, 2, 3…).

Features
• Live translated subtitles over any tab audio
• One-way mode (everything → one language) or two-way mode (bilingual, e.g. KO ⇄ VI)
• Optionally include your own microphone so both sides of a call are translated
• Automatic speaker separation
• Pause / Resume without losing the transcript
• Stop & get an AI summary (minutes, key points, decisions, action items)
• Download the summary and the full transcript (original + translation)
• Sign in with Google for paid plans (unlimited translation)

How it works
Audio from the active tab (and optionally your mic) is streamed to our translation service to produce live subtitles. When you press Stop, the transcript is summarized by AI. Nothing is captured until you press Start.

**Privacy policy URL:** https://meet.transflash.app/privacy
**Homepage URL:** https://meet.transflash.app
**Support email:** support@transflash.app

---

## 2. Single purpose (required field)
TransFlash has one purpose: provide real-time translated subtitles for audio playing in the browser, plus an AI summary of that conversation.

---

## 3. Permission justifications (paste each one in its box)

**tabCapture**
Captures the audio of the active tab (e.g. a Google Meet / Zoom / YouTube tab) so it can be transcribed and translated in real time. Only starts after the user clicks "Start".

**offscreen**
tabCapture audio cannot be processed in a service worker. An offscreen document runs the Web Audio mixing and the streaming connection that turns the captured audio into live subtitles.

**scripting**
Injects the subtitle overlay (content script + CSS) into the active tab when the user starts a session, so subtitles appear on top of the meeting/video.

**activeTab**
Grants access to the tab the user is currently viewing when they click Start, to capture its audio and display subtitles on it.

**storage**
Stores the user's language and mode preferences and their sign-in session locally on the device.

**identity**
Lets the user sign in with Google (through our website's authentication) so paid subscribers get unlimited translation.

**host permission — https://meet.transflash.app/\***
Calls our own backend API on this domain to issue short-lived streaming tokens, generate the AI summary, and read the signed-in user's plan.

**Remote code:** No remote code is executed. The extension only sends audio/text data to our servers and the translation service and renders the results.

---

## 4. Data safety / Privacy practices answers
- What user data is collected:
  • Authentication info (email) — for sign-in
  • User activity / audio — tab audio (and optional mic) is processed to produce subtitles and a summary
  • Website content — the transcript text
- Email address: collected (login only)
- Certify:
  • [x] I do not sell or transfer user data to third parties (outside approved use cases)
  • [x] I do not use or transfer user data for purposes unrelated to the item's single purpose
  • [x] I do not use or transfer user data to determine creditworthiness or for lending

---

## 5. Graphic assets needed
- Store icon: 128×128 PNG (have it: icons/icon128.png — can reuse, but Store prefers a 128 with padding)
- Screenshots: at least 1, size 1280×800 or 640×400 PNG/JPG
  → Take 2–3: (1) subtitle overlay live on a YouTube/Meet tab, (2) the popup, (3) the AI summary panel
- Small promo tile (optional): 440×280

---

## 6. IMPORTANT — Google login after publishing
`chrome.identity` uses a redirect URL of the form:
  https://<EXTENSION_ID>.chromiumapp.org/

The EXTENSION_ID of the published item is DIFFERENT from the unpacked dev ID,
so Google login will break until you do this:

1. After the item is created, copy its published Extension ID.
2. The redirect URL becomes: https://<published-id>.chromiumapp.org/
3. Add that URL to Supabase → Authentication → URL Configuration → Redirect URLs.
   (The popup's "Cấu hình đăng nhập" section also prints the exact current URL.)

To keep ONE stable ID for both dev and prod, add a "key" field to manifest.json
(optional, advanced). Otherwise just update Supabase after publishing.
