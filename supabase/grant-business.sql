-- ============================================================
--  Grant a Business plan to james.le@sotatek.com (unlimited use).
--  Run this in Supabase → SQL Editor.
-- ============================================================

-- 1) If the account has already signed in once, upgrade it right now:
update public.profiles p
set plan = 'business'
from auth.users u
where u.id = p.id and u.email = 'james.le@sotatek.com';

-- 2) Also grant Business automatically when this email signs up
--    (in case they haven't logged in yet). Other users still default to 'free'.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, plan)
  values (
    new.id,
    new.email,
    case when new.email = 'james.le@sotatek.com' then 'business' else 'free' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Verify:
-- select email, plan from public.profiles order by created_at desc;
