# Stripe & Payments

## Dashboard

https://dashboard.stripe.com

---

## Live product & prices (in code)

**Product ID:** `prod_V0AXYbWwPdLkwz`  
**Product name:** MAX-LIT SUPERComputer Access

| Tier | Price ID | Display | Amount |
|------|----------|---------|--------|
| 3 hours | `price_1U0ACSC39oHx6wOFTQfZCCTF` | $15 | 1500 cents |
| 24 hours | `price_1U0ACSC39oHx6wOFWoJosDHi` | $75 | 7500 cents |
| 7 days | `price_1U0ACSC39oHx6wOFgtNTWLNV` | $400 | 40000 cents |

Defined in: `lib/stripe/pricing.ts`  
Reference CSV: `STRIPE/MAX-LIT PRICES STRIPE.csv`

---

## Webhook (Production)

**URL:** `https://www.einsteinerror.com/api/stripe/webhook`

**Events to listen for:**
- `checkout.session.completed`
- `payment_intent.succeeded`

**Signing secret** → Vercel env: `STRIPE_WEBHOOK_SIGNING_SECRET`

Handler: `app/api/stripe/webhook/route.ts`  
Fulfillment logic: `lib/stripe/subscription.ts`

---

## If payment succeeded but user not subscribed

1. Stripe Dashboard → Developers → Webhooks → select endpoint
2. Find failed event → **Resend**
3. Check Vercel function logs for errors
4. If "permission denied for table profiles" → run grant in `DATABASE.md`

---

## Client checkout

- Page: `/checkout10` (`app/checkout10/page.tsx`)
- Component: `components/pricing/PaymentCheckout.tsx`
- Creates PaymentIntent via `/api/stripe/create-payment-intent`

---

## Env vars

| Variable | Stripe location |
|----------|-----------------|
| `STRIPE_SECRET_KEY` | Developers → API keys → Secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Developers → API keys → Publishable key |
| `STRIPE_WEBHOOK_SIGNING_SECRET` | Developers → Webhooks → endpoint → Signing secret |

Use **live** keys in Vercel Production; **test** keys for local dev if testing payments.

---

## Edge function (optional legacy)

`supabase/functions/stripe-webhook/` — Supabase Edge Function variant.  
Primary webhook in production is the Next.js route above.
