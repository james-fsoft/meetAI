-- ============================================================
--  Flash Meet — bank-transfer (VietQR) payments
--  Run this in Supabase → SQL Editor (once).
-- ============================================================

create table if not exists public.payments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete set null,
  email       text,
  plan        text not null,                       -- pro | business
  billing     text not null default 'monthly',     -- monthly | annual
  amount      integer not null,                    -- VND
  content     text not null,                        -- transfer memo / matching code
  status      text not null default 'pending',     -- pending | awaiting | confirmed | rejected
  created_at  timestamptz not null default now(),
  confirmed_at timestamptz,
  confirmed_by text
);

create index if not exists payments_status_idx on public.payments (status, created_at desc);
create index if not exists payments_user_idx   on public.payments (user_id);

alter table public.payments enable row level security;

-- Users may see their own payments; all writes go through the service-role API.
drop policy if exists "own payments select" on public.payments;
create policy "own payments select" on public.payments
  for select using (auth.uid() = user_id);
