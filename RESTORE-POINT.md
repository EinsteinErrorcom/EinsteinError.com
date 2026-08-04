# Restore Point — 2026-08-04

Complete save reference for GitHub code, Vercel secrets, and Stripe config.
**Never commit secret values to GitHub** — they live in Vercel and Stripe dashboards only.

## GitHub

- **Repo:** https://github.com/EinsteinErrorcom/EinsteinError.com
- **Branch:** `main`
- **Tag:** `restore-2026-08-04` (created with this restore point)

## Live domains

- https://www.einsteinerror.com (primary)
- https://www.einsteingravity.com (alias)
- https://zzzbestmaxlit.vercel.app (Vercel default)

## Vercel project

- **Dashboard:** https://vercel.com/alwho-9360s-projects/zzzbestmaxlit
- **Env vars:** Settings → Environment Variables

### Required Production + Preview variables (exact names)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server webhooks, admin, Stripe fulfillment |
| `NEXT_PUBLIC_SITE_URL` | `https://www.einsteinerror.com` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google Sign-In |
| `STRIPE_SECRET_KEY` | Stripe server API |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe client |
| `STRIPE_WEBHOOK_SIGNING_SECRET` | Stripe webhook signature verification |
| `GEMINI_API_KEY` | AI chat |
| `AI_PROVIDER` | `gemini` |
| `GEMINI_CONTEXT_CACHE` | `true` |
| `CHAT_RATE_LIMIT_PER_HOUR` | e.g. `20` |

### Do NOT use (removed / legacy)

- ~~`SUPABASE_URL`~~ — use `NEXT_PUBLIC_SUPABASE_URL`
- ~~`SUPABASE_ANON_KEY`~~ — use `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ~~`STRIPE_WEBHOOK_SECRET`~~ — use `STRIPE_WEBHOOK_SIGNING_SECRET`

Code accepts legacy Supabase names as fallback, but **always set the `NEXT_PUBLIC_*` names in Vercel**.

### After any env var change

1. Redeploy Production (Deployments → ⋯ → Redeploy)
2. Verify home page returns HTTP 200 on both domains

## Stripe

- **Dashboard:** https://dashboard.stripe.com
- **Webhook URL (Production):** `https://www.einsteinerror.com/api/stripe/webhook`
- **Events to listen for:** `checkout.session.completed`, `payment_intent.succeeded`
- **Signing secret:** copy to Vercel as `STRIPE_WEBHOOK_SIGNING_SECRET`

### Pricing tiers (live price IDs in code)

| Tier | Price ID |
|---|---|
| $15 / 3 hours | `price_1U0ACSC39oHx6wOFTQfZCCTF` |
| $75 / 24 hours | `price_1U0ACSC39oHx6wOFWoJosDHi` |
| $400 / 7 days | `price_1U0ACSC39oHx6wOFgtNTWLNV` |

Product ID: `prod_V0AXYbWwPdLkwz`

### If a payment succeeded but user wasn't subscribed

Stripe Dashboard → Developers → Webhooks → select endpoint → **Resend** failed events from before env fix.

## 12-page site routes

| # | Route |
|---|---|
| 1 | `/` |
| 2–7 | `/page2` … `/page7` |
| 8 | `/maxchatbox8` |
| 9 | `/trialexpired9` |
| 10 | `/checkout10` |
| 11 | `/timeexpired11` |
| 12 | `/spare12` |

## Quick health check

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://www.einsteinerror.com/
curl -s -o /dev/null -w "%{http_code}\n" https://www.einsteingravity.com/
```

Both should return `200`.
