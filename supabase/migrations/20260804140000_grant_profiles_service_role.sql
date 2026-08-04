-- Stripe webhooks use SUPABASE_SERVICE_ROLE_KEY to set is_subscribed.
-- deny_by_default_rls revoked anon/authenticated grants; ensure service_role
-- always has table-level access for server-side subscription fulfillment.

grant select, insert, update on table public.profiles to service_role;
