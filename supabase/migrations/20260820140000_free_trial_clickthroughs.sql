-- FREE Trial click-through counter and list for Geniuses window.

insert into public.site_stats (key, value)
values ('free_trial_clicks', 0)
on conflict (key) do nothing;

-- Seed from existing profiles (each profile represents a successful sign-in / trial start).
update public.site_stats
set value = (select count(*)::bigint from public.profiles),
    updated_at = now()
where key = 'free_trial_clicks';

create or replace function public.increment_free_trial_clicks()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count bigint;
begin
  update public.site_stats
  set value = value + 1,
      updated_at = now()
  where key = 'free_trial_clicks'
  returning value into new_count;

  if new_count is null then
    insert into public.site_stats (key, value)
    values ('free_trial_clicks', 1)
    on conflict (key) do update
      set value = public.site_stats.value + 1,
          updated_at = now()
    returning value into new_count;
  end if;

  return new_count;
end;
$$;

revoke all on function public.increment_free_trial_clicks() from public;
grant execute on function public.increment_free_trial_clicks() to service_role;

create or replace function public.get_free_trial_clickthroughs()
returns table (id uuid, trial_start_at timestamptz)
language sql
security definer
set search_path = public
stable
as $$
  select p.id, p.trial_start_at
  from public.profiles as p
  where p.is_subscribed = false
    and p.access_tier = 'trial'
    and p.trial_start_at is not null
  order by p.trial_start_at desc;
$$;

revoke all on function public.get_free_trial_clickthroughs() from public;
grant execute on function public.get_free_trial_clickthroughs() to anon, authenticated, service_role;

create or replace function public.get_free_trial_click_count()
returns bigint
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select s.value from public.site_stats as s where s.key = 'free_trial_clicks'),
    0::bigint
  );
$$;

revoke all on function public.get_free_trial_click_count() from public;
grant execute on function public.get_free_trial_click_count() to anon, authenticated, service_role;
