-- ============================================================
--  Usage metering columns for public.profiles
--  Run in Supabase → SQL Editor (once).
-- ============================================================

alter table public.profiles add column if not exists seconds_today integer not null default 0;
alter table public.profiles add column if not exists day_key date;
alter table public.profiles add column if not exists seconds_month integer not null default 0;
alter table public.profiles add column if not exists month_key text;

-- Quick view of usage (minutes) this month/day:
--   select email, plan,
--          round(seconds_today/60.0,1)  as min_today,
--          round(seconds_month/60.0,1)  as min_month
--   from public.profiles order by seconds_month desc;
