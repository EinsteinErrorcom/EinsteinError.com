-- Admin purchases list for /api/get-purchases (server-side; also used when service role is unavailable locally).
create or replace function public.get_subscribed_purchases()
returns table (id uuid, trial_start_at timestamptz)
language sql
security definer
set search_path = public
stable
as $$
  select p.id, p.trial_start_at
  from public.profiles as p
  where p.is_subscribed = true
  order by p.trial_start_at desc nulls last;
$$;

revoke all on function public.get_subscribed_purchases() from public;
grant execute on function public.get_subscribed_purchases() to anon, authenticated, service_role;
