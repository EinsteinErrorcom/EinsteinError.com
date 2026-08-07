-- Track paid access tier and countdown duration (trial / 3h / 24h / 7d).
alter table public.profiles
  add column if not exists access_tier text not null default 'trial';

update public.profiles
set access_tier = 'paid_3h'
where is_subscribed = true
  and access_tier = 'trial';
