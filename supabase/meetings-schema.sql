-- ============================================================
--  Saved meetings (cloud history for signed-in users)
--  Run in Supabase → SQL Editor (once).
--
--  The web app upserts a row when a meeting ends and again when its
--  summary is ready. client_id is the id the browser assigned to the
--  meeting, so repeated saves update the same row.
-- ============================================================

create table if not exists public.meetings (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  client_id     bigint not null,                        -- browser-side meeting id (ms timestamp)
  title         text not null default '',
  summary       text not null default '',
  transcript    text not null default '',
  live          jsonb not null default '[]'::jsonb,     -- [{src, tgt, spk}] live-translation turns
  started_at    timestamptz not null default now(),
  duration_sec  integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (user_id, client_id)
);

create index if not exists meetings_user_started_idx on public.meetings (user_id, started_at desc);

-- Row Level Security: a user only ever sees/edits their own meetings.
-- (API routes use the service role and filter by user_id as well.)
alter table public.meetings enable row level security;

drop policy if exists "own meetings read" on public.meetings;
create policy "own meetings read"   on public.meetings for select using (auth.uid() = user_id);

drop policy if exists "own meetings insert" on public.meetings;
create policy "own meetings insert" on public.meetings for insert with check (auth.uid() = user_id);

drop policy if exists "own meetings update" on public.meetings;
create policy "own meetings update" on public.meetings for update using (auth.uid() = user_id);

drop policy if exists "own meetings delete" on public.meetings;
create policy "own meetings delete" on public.meetings for delete using (auth.uid() = user_id);

-- Quick look:
--   select p.email, count(*) as meetings, round(sum(m.duration_sec)/3600.0,1) as hours
--   from public.meetings m join public.profiles p on p.id = m.user_id
--   group by p.email order by meetings desc;
