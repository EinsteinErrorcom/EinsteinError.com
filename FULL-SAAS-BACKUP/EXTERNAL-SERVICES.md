# External Services — Quick Links

## GitHub (source code)

- **Repo:** https://github.com/EinsteinErrorcom/EinsteinError.com
- **Branch:** `main`
- **Tag:** `restore-2026-08-04`

---

## Vercel (hosting)

- **Project:** https://vercel.com/alwho-9360s-projects/zzzbestmaxlit
- **Default URL:** https://zzzbestmaxlit.vercel.app
- **Env vars:** Project → Settings → Environment Variables
- **Domains:** Project → Settings → Domains

**Production domains:**
- https://www.einsteinerror.com (primary)
- https://www.einsteingravity.com (alias)

---

## Supabase (database + auth)

- **Dashboard:** https://supabase.com/dashboard
- **API keys:** Settings → API
- **Google provider:** Authentication → Providers → Google
- **Redirect URLs:** Authentication → URL Configuration
- **SQL Editor:** for running migrations

---

## Stripe (payments)

- **Dashboard:** https://dashboard.stripe.com
- **API keys:** Developers → API keys
- **Webhooks:** Developers → Webhooks
- **Products:** Product catalog → MAX-LIT SUPERComputer Access

---

## Google Cloud (OAuth)

- **Console:** https://console.cloud.google.com
- **Credentials:** APIs & Services → Credentials → OAuth 2.0 Web client
- **Client ID used:** see `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `.env.example`

---

## Google AI Studio (Gemini chat)

- **API keys:** https://aistudio.google.com/apikey
- **Billing (if needed):** https://console.cloud.google.com/billing

---

## Contact info (on site)

- WhatsApp: +17802707009
- Email: wild.book0719@fastmail.com

---

## Health checks

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://www.einsteinerror.com/
curl -s -o /dev/null -w "%{http_code}\n" https://www.einsteingravity.com/
```

Both should return `200`.
