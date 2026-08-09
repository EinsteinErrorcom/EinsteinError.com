-- RLS policies alone are not enough: PostgreSQL also requires table-level GRANTs
-- for the anon/authenticated roles Supabase uses via the API.
--
-- Without these, queries fail with:
--   permission denied for table profiles (SQLSTATE 42501)

grant select, insert, update, delete on table public.profiles to anon, authenticated;
