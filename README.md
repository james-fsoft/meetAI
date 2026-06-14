# Flash Meet — Production app (Next.js)

A SaaS version of Flash Meet: record meetings, separate speakers, live-translate,
and get AI summaries — with user accounts and monthly subscriptions.

This is built in **phases**. You can run it after Phase 1 and add the rest incrementally.

---

## Phase 1 — Run it locally (you are here ✅)

The current scaffold is a working Next.js app. The existing browser UI is served
at `public/app.html` and shown inside the main page, so you have something running
immediately while we convert it to native React + backend in later phases.

### Steps

1. Install Node.js 18+ from https://nodejs.org if you don't have it.
2. Open a terminal in this `meetingai-app` folder and run:
   ```
   npm install
   npm run dev
   ```
3. Open http://localhost:3000 — the app loads. Because it's now served over
   http(s), Live translate works (no more file:// problem).
4. For now users still enter their own keys via the ⚙ button (we move keys to the
   server in Phase 3).

### Backend routes already included (used in Phase 3)
- `POST /api/transcribe` — AssemblyAI diarized transcript, key hidden on server.
- `POST /api/summarize` — OpenAI summary, key hidden on server.
  Fill `OPENAI_API_KEY` / `ASSEMBLYAI_API_KEY` in `.env.local` (copy from `.env.example`).

---

## Phase 2 — Authentication (Supabase)
- Create a free project at https://supabase.com
- Add login/signup pages; protect the app behind a session.
- We'll wire `NEXT_PUBLIC_SUPABASE_URL` and keys (already in `.env.example`).

## Phase 3 — Hide keys behind the backend
- Switch the UI from calling OpenAI/AssemblyAI directly to calling our
  `/api/*` routes. Users stop entering keys; you provide them server-side.

## Phase 4 — Subscriptions (Lemon Squeezy)
- Lemon Squeezy hosted checkout for a monthly plan + webhook to mark users "active".
- Lemon Squeezy is merchant-of-record (handles VAT/tax, supports Vietnam sellers).
- Store plan + monthly minutes used in Supabase; block when over the limit.

## Phase 5 — Deploy to production (Vercel)
- Push to GitHub, import into https://vercel.com, set env vars, deploy.
- You get an https domain and automatic scaling. Add a custom domain if desired.

---

## Folder structure
```
meetingai-app/
  app/
    layout.tsx          # root layout
    page.tsx            # home -> MeetingApp
    MeetingApp.tsx      # (Phase 1) hosts public/app.html; (Phase 3) native UI
    globals.css
    api/
      transcribe/route.ts   # AssemblyAI proxy (server key)
      summarize/route.ts    # OpenAI proxy (server key)
  public/
    app.html            # the current working single-file UI
  .env.example          # copy to .env.local and fill in
  package.json
```

> Security: never put real keys in `app.html` or commit `.env.local`.
> Server keys live only in `.env.local` (local) and Vercel env vars (production).
