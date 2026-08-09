# Architecture — zzzbestmaxlit (MAX-LIT)

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database / Auth | Supabase (RLS enforced) |
| Payments | Stripe Payment Element |
| AI | Adapter pattern — Gemini default (`lib/ai/`) |
| Hosting | Vercel |
| Validation | Zod |

---

## Folder structure

```
app/                    Route segments (pages + API routes)
  page.tsx              Landing page (Page 1)
  page2/ … page7/       Marketing / info pages
  maxchatbox8/          AI chat (Page 8)
  trialexpired9/        Trial expired (Page 9)
  checkout10/           Stripe checkout (Page 10)
  timeexpired11/        Time expired (Page 11)
  spare12/              Spare (Page 12)
  api/                  Server API routes (gatekeeper pattern)
  auth/                 OAuth callback + Google route
  actions/              Server actions (chat, profile)

components/             UI components (presentation)
lib/                    Business logic, Supabase, Stripe, AI
  supabase/             Server/client/admin Supabase wrappers
  stripe/               Pricing, subscription, stripe-service
  ai/                   Provider adapter (Gemini, OpenAI, etc.)
  validations/          Zod schemas

public/                 Static assets (~300 PNG/GIF images)
supabase/migrations/    SQL migrations (run in order)
STRIPE/                 Stripe product/price reference CSV
FULL-SAAS-BACKUP/       Disaster recovery (this folder)
```

---

## 12-page site flow

Defined in `lib/site-pages.ts`:

| # | Route | Purpose |
|---|-------|---------|
| 1 | `/` | Landing, sign-in, truth counter |
| 2 | `/page2` | Proof / physics content |
| 3 | `/page3` | … |
| 4 | `/page4` | … |
| 5 | `/page5` | … |
| 6 | `/page6` | … |
| 7 | `/page7` | Purchases list (site tour step) |
| 8 | `/maxchatbox8` | MAX-LIT AI chat |
| 9 | `/trialexpired9` | Trial expired message |
| 10 | `/checkout10` | Stripe pricing / payment |
| 11 | `/timeexpired11` | Subscription time expired |
| 12 | `/spare12` | Spare page |

Site Tour: `components/site-tour-bar.tsx` — floating nav between pages.

---

## API routes (server gatekeeper)

| Route | Purpose |
|-------|---------|
| `/api/chat` | AI chat (subscription + rate limit check) |
| `/api/counter` | Truth counter increment/read |
| `/api/get-purchases` | Subscribed purchases list |
| `/api/stripe/create-payment-intent` | Stripe PaymentIntent |
| `/api/stripe/create-checkout-session` | Stripe Checkout session |
| `/api/stripe/webhook` | Stripe webhook → update profiles |
| `/api/auth/session` | Session info |
| `/api/auth/ensure-profile` | Create profile on sign-in |
| `/api/auth/google-client-id` | Google client ID for client |
| `/api/dev/reset` | Local dev trial reset (service role) |

---

## Security rules (from `.cursorrules`)

1. All AI calls from server-side API routes only
2. Every protected route validates session + subscription via Supabase
3. Never bypass RLS; use `@/lib/supabase/server`
4. Service role only in server admin paths (`lib/supabase/admin.ts`)
5. Zod validation on all incoming API data

---

## Key feature files

| Feature | Files |
|---------|-------|
| Google sign-in | `components/google-login-button.tsx`, `app/auth/callback/route.ts` |
| Trial gate | `lib/trial-gate.ts`, `lib/trial.ts` |
| Chat | `components/chat/Chatbox.tsx`, `app/api/chat/route.ts`, `lib/chat-gatekeeper.ts` |
| Purchases overlay | `components/purchases-link.tsx`, `lib/purchases.ts` |
| Truth counter | `components/truth-counter.tsx`, `lib/truth-counter.ts` |
| Checkout | `components/pricing/PaymentCheckout.tsx`, `lib/stripe/pricing.ts` |
| Page footers | `components/page-end-footer.tsx`, `lib/site-pages.ts` |

---

## Redirects (next.config.ts)

Legacy URLs redirect to current 12-page routes:
- `/pricing9`, `/checkout9`, `/timeexpired10` → `/checkout10`
- `/trialexpired8` → `/trialexpired9`
- `/chat8` → `/maxchatbox8`
- `/chat11`, `/timeexpired` → `/timeexpired11`
- `/spare` → `/spare12`

---

## npm scripts

```bash
npm run dev          # Local dev (webpack)
npm run dev:clean    # Clear .next cache + dev
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run check:gemini # Test Gemini API key
```

---

## Dependencies (package.json)

**Runtime:** next, react, @supabase/ssr, stripe, @stripe/react-stripe-js, @google/generative-ai, zod, dotenv

**Dev:** typescript, tailwindcss, eslint, eslint-config-next

Pin versions in `package-lock.json` — always commit lockfile with code.
