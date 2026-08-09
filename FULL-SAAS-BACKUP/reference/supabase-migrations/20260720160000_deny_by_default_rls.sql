-- Enforce deny-by-default access on all existing public tables.
-- RLS enabled with no permissive policy = deny. Table-level GRANTs are revoked
-- from anon/authenticated; access is granted only where explicit policies exist.

do $$
declare
  tbl record;
begin
  for tbl in
    select tablename
    from pg_tables
    where schemaname = 'public'
  loop
    execute format(
      'alter table public.%I enable row level security',
      tbl.tablename
    );
    execute format(
      'alter table public.%I force row level security',
      tbl.tablename
    );
    execute format(
      'revoke all on table public.%I from anon, authenticated',
      tbl.tablename
    );
  end loop;
end $$;

-- Drop overly permissive policies if they were created during testing.
do $$
declare
  pol record;
begin
  for pol in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and (
        policyname ilike '%allow all%'
        or policyname ilike '%public access%'
        or policyname ilike '%enable all%'
        or policyname ilike '%test%'
      )
  loop
    execute format(
      'drop policy if exists %I on public.%I',
      pol.policyname,
      pol.tablename
    );
  end loop;
end $$;

-- profiles: minimal authenticated self-service access only.
do $$
begin
  if to_regclass('public.profiles') is not null then
    grant select, insert, update on table public.profiles to authenticated;

    drop policy if exists "profiles_select_own" on public.profiles;
    create policy "profiles_select_own"
      on public.profiles
      for select
      to authenticated
      using (auth.uid() = id);

    drop policy if exists "profiles_insert_own" on public.profiles;
    create policy "profiles_insert_own"
      on public.profiles
      for insert
      to authenticated
      with check (auth.uid() = id);

    drop policy if exists "profiles_update_own" on public.profiles;
    create policy "profiles_update_own"
      on public.profiles
      for update
      to authenticated
      using (auth.uid() = id)
      with check (auth.uid() = id);
  end if;
end $$;
