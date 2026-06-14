-- Track whether the order emails were sent, so admin can see status + resend.
-- Run in Supabase → SQL Editor (once).

alter table public.payments add column if not exists user_email_sent  boolean not null default false;
alter table public.payments add column if not exists admin_email_sent boolean not null default false;
alter table public.payments add column if not exists last_email_at    timestamptz;
