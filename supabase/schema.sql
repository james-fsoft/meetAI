-- ============================================================
--  Flash Meet — Supabase schema
--  Run this in Supabase → SQL Editor (once).
-- ============================================================

-- 1) Per-user profile holding the subscription plan + monthly usage.
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text,
  plan          text not null default 'free',          -- free | pro | business | enterprise
  minutes_used  integer not null default 0,            -- minutes consumed this cycle
  cycle_start   timestamptz not null default now(),    -- start of the current billing cycle
  ls_customer_id text,                                 -- Lemon Squeezy customer id (phase 2)
  ls_subscription_id text,                             -- Lemon Squeezy subscription id (phase 2)
  created_at    timestamptz not null default now()
);

-- 2) Row Level Security: a user can only read/update their own row.
alter table public.profiles enable row level security;

drop policy if exists "own profile read" on public.profiles;
create policy "own profile read"   on public.profiles for select using (auth.uid() = id);

drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

-- 3) Auto-create a free profile whenever a new auth user signs up (Google login).
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, plan)
  values (new.id, new.email, 'free')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Monthly plan limits (minutes) for reference / app-side enforcement:
--   free 30 · pro 600 · business 2400 · enterprise NULL (custom)
