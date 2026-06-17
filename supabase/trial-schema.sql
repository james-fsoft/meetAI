-- Admin-granted free trial: a free user with trial_until in the future is
-- treated as Pro (full features + Pro quota) until it expires.
-- Run once in the Supabase SQL editor.

alter table public.profiles
  add column if not exists trial_until timestamptz;
