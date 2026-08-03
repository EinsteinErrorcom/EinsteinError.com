-- Global truth visitor counter (replaces legacy Firebase Realtime DB counter).

create table if not exists public.site_stats (
  key text primary key,
  value bigint not null,
  updated_at timestamptz not null default now()
);

insert into public.site_stats (key, value)
values ('truth_counter', 5731486)
on conflict (key) do nothing;

alter table public.site_stats enable row level security;
alter table public.site_stats force row level security;

grant select on table public.site_stats to anon, authenticated;

drop policy if exists "site_stats_public_read" on public.site_stats;
create policy "site_stats_public_read"
  on public.site_stats
  for select
  to anon, authenticated
  using (true);

create or replace function public.increment_truth_counter()
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
  where key = 'truth_counter'
  returning value into new_count;

  if new_count is null then
    insert into public.site_stats (key, value)
    values ('truth_counter', 5731486)
    on conflict (key) do update
      set value = public.site_stats.value + 1,
          updated_at = now()
    returning value into new_count;
  end if;

  return new_count;
end;
$$;

revoke all on function public.increment_truth_counter() from public;
grant execute on function public.increment_truth_counter() to service_role;

alter publication supabase_realtime add table public.site_stats;
