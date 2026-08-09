-- Manual Supabase data export (run in Supabase Dashboard → SQL Editor)
-- Copy each result set to CSV/JSON and store in FULL-SAAS-BACKUP/snapshots/
-- Date: fill in when exported

-- 1. User profiles (subscriptions, trials)
select *
from public.profiles
order by trial_start_at desc nulls last;

-- 2. Truth counter
select *
from public.site_stats;

-- 3. Chat rate-limit log (optional; can be large)
select id, user_id, created_at
from public.chat_requests
order by created_at desc
limit 10000;

-- NOTE: auth.users is in the auth schema.
-- For full auth recovery use:
--   Supabase Dashboard → Database → Backups
-- or Supabase CLI: supabase db dump --linked
