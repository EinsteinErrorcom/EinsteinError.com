-- Per-user chat rate limiting for production abuse protection.
-- Run via Supabase CLI or Dashboard SQL editor before public launch.

create table if not exists public.chat_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists chat_requests_user_created_idx
  on public.chat_requests (user_id, created_at desc);

alter table public.chat_requests enable row level security;

drop policy if exists "Users insert own chat requests" on public.chat_requests;
create policy "Users insert own chat requests"
  on public.chat_requests
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users read own chat requests" on public.chat_requests;
create policy "Users read own chat requests"
  on public.chat_requests
  for select
  to authenticated
  using (auth.uid() = user_id);

grant select, insert on table public.chat_requests to authenticated;
