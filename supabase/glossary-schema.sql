-- ============================================================
--  Personal dictionary (glossary): names, companies, products,
--  terms and acronyms a user wants Flash Meet to get right.
--  Run in Supabase → SQL Editor (once).
--
--  The dictionary page upserts by (user_id, client_id), where
--  client_id is the id the browser gave the entry, so entries
--  created offline sync into the same row later.
--  Until this table exists the page still works, keeping the
--  entries on the device only.
-- ============================================================

create table if not exists public.glossary_terms (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  client_id     text not null,                          -- browser-side entry id
  term          text not null,                          -- the word or phrase as spoken
  kind          text not null default 'term',           -- person | company | product | term | acronym
  display       text not null default '',               -- preferred spelling in transcript + translation
  aliases       jsonb not null default '[]'::jsonb,     -- other spellings / short forms
  langs         jsonb not null default '[]'::jsonb,     -- [] = every language, else ['vi','en','ko']
  note          text not null default '',
  keep_original boolean not null default true,          -- do not translate this term
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (user_id, client_id)
);

create index if not exists glossary_user_updated_idx on public.glossary_terms (user_id, updated_at desc);

-- Row Level Security: a user only ever sees/edits their own entries.
-- (API routes use the service role and filter by user_id as well.)
alter table public.glossary_terms enable row level security;

drop policy if exists "own glossary read" on public.glossary_terms;
create policy "own glossary read"   on public.glossary_terms for select using (auth.uid() = user_id);

drop policy if exists "own glossary insert" on public.glossary_terms;
create policy "own glossary insert" on public.glossary_terms for insert with check (auth.uid() = user_id);

drop policy if exists "own glossary update" on public.glossary_terms;
create policy "own glossary update" on public.glossary_terms for update using (auth.uid() = user_id);

drop policy if exists "own glossary delete" on public.glossary_terms;
create policy "own glossary delete" on public.glossary_terms for delete using (auth.uid() = user_id);

-- Quick look:
--   select p.email, count(*) as entries
--   from public.glossary_terms g join public.profiles p on p.id = g.user_id
--   group by p.email order by entries desc;
