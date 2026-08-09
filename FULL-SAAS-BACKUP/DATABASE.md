# Database — Supabase Migrations

Run these **in order** in Supabase SQL Editor (Dashboard → SQL → New query) or via Supabase CLI:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Source files: `supabase/migrations/` (copies in `FULL-SAAS-BACKUP/reference/supabase-migrations/`)

---

## Migration order

| # | File | Purpose |
|---|------|---------|
| 1 | `20260720152500_grant_profiles_access.sql` | GRANT select/insert/update/delete on `profiles` to anon + authenticated |
| 2 | `20260720160000_deny_by_default_rls.sql` | Enable RLS on all public tables; deny-by-default; explicit policies only |
| 3 | `20260802120000_chat_rate_limits.sql` | Chat rate limit table for durable hourly limits |
| 4 | `20260803160000_truth_counter.sql` | Truth counter table / function |
| 5 | `20260804140000_grant_profiles_service_role.sql` | GRANT profiles access to service_role (Stripe webhook fulfillment) |
| 6 | `20260806190000_get_subscribed_purchases.sql` | RPC `get_subscribed_purchases()` fallback for purchases API |

---

## Core table: `profiles`

Used throughout the app for auth, trials, and subscriptions.

**Key columns (typical):**
- `id` (uuid, matches auth.users)
- `is_subscribed` (boolean)
- `trial_start_at`, `trial_end_at` (timestamptz)
- Stripe/customer fields as needed by webhook handler

**RLS:** Users can read/update own row; service_role used by webhooks and purchases API.

---

## If webhook returns "permission denied for table profiles"

Run in SQL Editor:

```sql
grant select, insert, update on table public.profiles to service_role;
```

(Migration 5 above should already do this.)

---

## Purchases API

`/api/get-purchases` tries:
1. Service role direct query on `profiles` where `is_subscribed = true`
2. Fallback RPC: `get_subscribed_purchases()` (migration 6)

Requires `SUPABASE_SERVICE_ROLE_KEY` in Vercel/local env.

---

## Truth counter

Migration 4 sets up server-side counter used by `/api/counter` and `components/truth-counter.tsx`.

---

## Chat rate limits

Migration 3 sets up durable per-user hourly limits (configurable via `CHAT_RATE_LIMIT_PER_HOUR` env var).
