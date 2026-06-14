-- ============================================================
--  Flash Meet — referral program (both sides get +60 bonus minutes)
--  Run this in Supabase → SQL Editor (once).
-- ============================================================

alter table public.profiles add column if not exists ref_code      text;
alter table public.profiles add column if not exists referred_by   uuid;
alter table public.profiles add column if not exists bonus_minutes integer not null default 0;

create unique index if not exists profiles_ref_code_idx
  on public.profiles (ref_code) where ref_code is not null;
