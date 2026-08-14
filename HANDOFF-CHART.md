# MAX-LIT Handoff Chart

Visual handoff for **zzzbestmaxlit** — project, deploy, site flow, AI pipeline, Stripe, and Vercel env (names only, no secret values).

> **View:** Markdown preview on this file (`Cmd+Shift+V`), or open [`public/handoff-chart.svg`](public/handoff-chart.svg) directly.

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 2100" width="400" role="img" aria-label="MAX-LIT zzzbestmaxlit handoff chart">
  <defs>
    <marker id="handoff-arr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#94a3b8"/></marker>
    <style>
      .h1{font:700 16px ui-sans-serif,system-ui,sans-serif;fill:#0f172a}
      .sec{font:700 11px ui-sans-serif,system-ui,sans-serif;fill:#fff;letter-spacing:.06em}
      .t{font:600 12px ui-sans-serif,system-ui,sans-serif;fill:#0f172a}
      .d{font:400 10px ui-sans-serif,system-ui,sans-serif;fill:#475569}
      .r{font:400 9px ui-monospace,Menlo,monospace;fill:#64748b}
      .n{font:400 9px ui-monospace,Menlo,monospace;fill:#334155}
    </style>
  </defs>

  <text x="200" y="28" text-anchor="middle" class="h1">MAX-LIT Handoff Chart</text>
  <text x="200" y="46" text-anchor="middle" class="d">zzzbestmaxlit - top to bottom</text>

  <!-- DEPLOY -->
  <rect x="10" y="58" width="380" height="22" rx="4" fill="#334155"/>
  <text x="200" y="73" text-anchor="middle" class="sec">PROJECT AND DEPLOY</text>

  <rect x="20" y="88" width="360" height="58" rx="6" fill="#f1f5f9" stroke="#64748b" stroke-width="1"/>
  <text x="32" y="106" class="t">Local project</text>
  <text x="32" y="122" class="r">/Users/ALZ/Desktop/MAX-LITMASTER/zzzbestmaxlit</text>
  <line x1="200" y1="146" x2="200" y2="162" stroke="#94a3b8" stroke-width="1" marker-end="url(#handoff-arr)"/>

  <rect x="20" y="162" width="360" height="58" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1"/>
  <text x="32" y="180" class="t">GitHub</text>
  <text x="32" y="196" class="r">EinsteinErrorcom/EinsteinError.com</text>
  <text x="32" y="210" class="d">branch main | tag restore-2026-08-04</text>
  <line x1="200" y1="220" x2="200" y2="236" stroke="#94a3b8" stroke-width="1" marker-end="url(#handoff-arr)"/>

  <rect x="20" y="236" width="360" height="58" rx="6" fill="#faf5ff" stroke="#8b5cf6" stroke-width="1"/>
  <text x="32" y="254" class="t">Vercel</text>
  <text x="32" y="270" class="r">alwho-9360s-projects/zzzbestmaxlit</text>
  <text x="32" y="284" class="d">Secrets live in Vercel only - never GitHub</text>
  <line x1="200" y1="294" x2="200" y2="310" stroke="#94a3b8" stroke-width="1" marker-end="url(#handoff-arr)"/>

  <rect x="20" y="310" width="360" height="58" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="1"/>
  <text x="32" y="328" class="t">Live domains (200 OK)</text>
  <text x="32" y="344" class="r">www.einsteinerror.com (primary)</text>
  <text x="32" y="358" class="r">www.einsteingravity.com (alias)</text>
  <line x1="200" y1="368" x2="200" y2="388" stroke="#94a3b8" stroke-width="1" marker-end="url(#handoff-arr)"/>

  <!-- SITE FLOW -->
  <rect x="10" y="388" width="380" height="22" rx="4" fill="#1d4ed8"/>
  <text x="200" y="403" text-anchor="middle" class="sec">12-PAGE SITE FLOW (footer Next Page chain)</text>
  <text x="200" y="422" text-anchor="middle" class="d">constants in lib/trial-gate.ts and lib/site-pages.ts</text>

  <rect x="20" y="432" width="360" height="52" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1"/>
  <text x="32" y="450" class="t">1. HOME</text>
  <text x="32" y="466" class="r">/ - Google Sign-In at #auth-section, truth counter</text>
  <line x1="200" y1="484" x2="200" y2="500" stroke="#94a3b8" stroke-width="1" marker-end="url(#handoff-arr)"/>

  <rect x="20" y="500" width="360" height="52" rx="6" fill="#f8fafc" stroke="#64748b" stroke-width="1"/>
  <text x="32" y="518" class="t">2-8. CONTENT</text>
  <text x="32" y="534" class="r">/page2 through /page8 - marketing and proof</text>
  <line x1="200" y1="552" x2="200" y2="568" stroke="#94a3b8" stroke-width="1" marker-end="url(#handoff-arr)"/>

  <rect x="20" y="568" width="360" height="52" rx="6" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
  <text x="32" y="586" class="t">9. CHATBOX</text>
  <text x="32" y="602" class="r">/maxchatbox9 - MAX-LIT AI chat (1 hr free trial)</text>
  <line x1="200" y1="620" x2="200" y2="636" stroke="#94a3b8" stroke-width="1" marker-end="url(#handoff-arr)"/>

  <rect x="20" y="636" width="360" height="52" rx="6" fill="#fff7ed" stroke="#f97316" stroke-width="1"/>
  <text x="32" y="654" class="t">10. TRIAL EXPIRED</text>
  <text x="32" y="670" class="r">/trialexpired10 - free trial ended</text>
  <line x1="200" y1="688" x2="200" y2="704" stroke="#94a3b8" stroke-width="1" marker-end="url(#handoff-arr)"/>

  <rect x="20" y="704" width="360" height="52" rx="6" fill="#faf5ff" stroke="#8b5cf6" stroke-width="1"/>
  <text x="32" y="722" class="t">11. CHECKOUT / STRIPE</text>
  <text x="32" y="738" class="r">/checkout11 - $15 / $75 / $400 tiers</text>
  <line x1="200" y1="756" x2="200" y2="772" stroke="#94a3b8" stroke-width="1" marker-end="url(#handoff-arr)"/>

  <rect x="20" y="772" width="360" height="52" rx="6" fill="#fef2f2" stroke="#ef4444" stroke-width="1"/>
  <text x="32" y="790" class="t">12. TIME EXPIRED</text>
  <text x="32" y="806" class="r">/timeexpired12 - cookie gate</text>
  <line x1="200" y1="824" x2="200" y2="912" stroke="#94a3b8" stroke-width="1" marker-end="url(#handoff-arr)"/>

  <!-- AI -->
  <rect x="10" y="912" width="380" height="22" rx="4" fill="#6d28d9"/>
  <text x="200" y="927" text-anchor="middle" class="sec">AI CHAT PIPELINE</text>

  <rect x="20" y="942" width="360" height="44" rx="6" fill="#f5f3ff" stroke="#7c3aed" stroke-width="1"/>
  <text x="32" y="960" class="t">Brain</text>
  <text x="32" y="974" class="r">lib/ai/system-instructions.ts - MASTER_SYSTEM_INSTRUCTIONS</text>
  <line x1="200" y1="986" x2="200" y2="1002" stroke="#94a3b8" stroke-width="1" marker-end="url(#handoff-arr)"/>

  <rect x="20" y="1002" width="360" height="44" rx="6" fill="#f5f3ff" stroke="#7c3aed" stroke-width="1"/>
  <text x="32" y="1020" class="t">API route</text>
  <text x="32" y="1034" class="r">/api/chat - gatekeeper validates session + trial/subscription</text>
  <line x1="200" y1="1046" x2="200" y2="1062" stroke="#94a3b8" stroke-width="1" marker-end="url(#handoff-arr)"/>

  <rect x="20" y="1062" width="360" height="44" rx="6" fill="#f5f3ff" stroke="#7c3aed" stroke-width="1"/>
  <text x="32" y="1080" class="t">Process</text>
  <text x="32" y="1094" class="r">processPrompt() - AI_PROVIDER=gemini - GEMINI_API_KEY</text>
  <line x1="200" y1="1106" x2="200" y2="1122" stroke="#94a3b8" stroke-width="1" marker-end="url(#handoff-arr)"/>

  <rect x="20" y="1122" width="360" height="44" rx="6" fill="#f5f3ff" stroke="#7c3aed" stroke-width="1"/>
  <text x="32" y="1140" class="t">Plain text</text>
  <text x="32" y="1154" class="r">lib/chat/plain-text-response.ts - strips LaTeX</text>
  <line x1="200" y1="1166" x2="200" y2="1182" stroke="#94a3b8" stroke-width="1" marker-end="url(#handoff-arr)"/>

  <rect x="20" y="1182" width="360" height="44" rx="6" fill="#f5f3ff" stroke="#7c3aed" stroke-width="1"/>
  <text x="32" y="1200" class="t">UI render</text>
  <text x="32" y="1214" class="r">components/chat/Chatbox.tsx - sentences split with blank lines</text>
  <line x1="200" y1="1226" x2="200" y2="1246" stroke="#94a3b8" stroke-width="1" marker-end="url(#handoff-arr)"/>

  <!-- STRIPE -->
  <rect x="10" y="1246" width="380" height="22" rx="4" fill="#047857"/>
  <text x="200" y="1261" text-anchor="middle" class="sec">STRIPE AND WEBHOOK</text>

  <rect x="20" y="1276" width="360" height="52" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="1"/>
  <text x="32" y="1294" class="t">Checkout success URL</text>
  <text x="32" y="1310" class="r">/maxchatbox9?session_id={CHECKOUT_SESSION_ID}</text>
  <line x1="200" y1="1328" x2="200" y2="1344" stroke="#94a3b8" stroke-width="1" marker-end="url(#handoff-arr)"/>

  <rect x="20" y="1344" width="360" height="52" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="1"/>
  <text x="32" y="1362" class="t">Live webhook (one endpoint)</text>
  <text x="32" y="1378" class="r">https://www.einsteinerror.com/api/stripe/webhook</text>
  <line x1="200" y1="1396" x2="200" y2="1412" stroke="#94a3b8" stroke-width="1" marker-end="url(#handoff-arr)"/>

  <rect x="20" y="1412" width="360" height="58" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="1"/>
  <text x="32" y="1430" class="t">Supabase grant (required for 200)</text>
  <text x="32" y="1446" class="n">grant select, insert, update on public.profiles</text>
  <text x="32" y="1460" class="n">to service_role;</text>
  <line x1="200" y1="1470" x2="200" y2="1490" stroke="#94a3b8" stroke-width="1" marker-end="url(#handoff-arr)"/>

  <!-- SECRETS -->
  <rect x="10" y="1490" width="380" height="22" rx="4" fill="#b45309"/>
  <text x="200" y="1505" text-anchor="middle" class="sec">VERCEL PRODUCTION ENV (names only)</text>

  <rect x="20" y="1520" width="360" height="130" rx="6" fill="#fffbeb" stroke="#d97706" stroke-width="1"/>
  <text x="32" y="1538" class="t">Required variables - set in Vercel dashboard</text>
  <text x="32" y="1554" class="n">NEXT_PUBLIC_SUPABASE_URL</text>
  <text x="32" y="1568" class="n">NEXT_PUBLIC_SUPABASE_ANON_KEY</text>
  <text x="32" y="1582" class="n">SUPABASE_SERVICE_ROLE_KEY</text>
  <text x="32" y="1596" class="n">NEXT_PUBLIC_SITE_URL | NEXT_PUBLIC_GOOGLE_CLIENT_ID</text>
  <text x="32" y="1610" class="n">STRIPE_SECRET_KEY | NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</text>
  <text x="32" y="1624" class="n">STRIPE_WEBHOOK_SIGNING_SECRET | GEMINI_API_KEY</text>
  <text x="32" y="1638" class="n">AI_PROVIDER=gemini</text>
  <line x1="200" y1="1650" x2="200" y2="1670" stroke="#94a3b8" stroke-width="1" marker-end="url(#handoff-arr)"/>

  <!-- REFERENCE -->
  <rect x="10" y="1670" width="380" height="22" rx="4" fill="#334155"/>
  <text x="200" y="1685" text-anchor="middle" class="sec">REFERENCE AND RULES</text>

  <rect x="20" y="1700" width="360" height="88" rx="6" fill="#f1f5f9" stroke="#64748b" stroke-width="1"/>
  <text x="32" y="1718" class="t">Docs</text>
  <text x="32" y="1734" class="r">RESTORE-POINT.md - deploy, secrets, Stripe</text>
  <text x="32" y="1750" class="r">USER-FLOWS.md - routes and user journeys</text>
  <text x="32" y="1766" class="t">Working rules</text>
  <text x="32" y="1780" class="d">One step at a time | no secrets in chat | commit/push only when asked</text>
</svg>

</div>

---

## Quick text index

| Section | Key facts |
|---------|-----------|
| **Project** | `/Users/ALZ/Desktop/MAX-LITMASTER/zzzbestmaxlit` |
| **GitHub** | [EinsteinError.com](https://github.com/EinsteinErrorcom/EinsteinError.com) · `main` · tag `restore-2026-08-04` |
| **Vercel** | [alwho-9360s-projects/zzzbestmaxlit](https://vercel.com/alwho-9360s-projects/zzzbestmaxlit) |
| **Domains** | [einsteinerror.com](https://www.einsteinerror.com) (primary), [einsteingravity.com](https://www.einsteingravity.com) |
| **Site flow** | `/` → `/page2`–`/page8` → `/maxchatbox9` → `/trialexpired10` → `/checkout11` → `/timeexpired12` |
| **Path constants** | `lib/trial-gate.ts`, `lib/site-pages.ts` |
| **AI brain** | `lib/ai/system-instructions.ts` (`MASTER_SYSTEM_INSTRUCTIONS`) |
| **Chat path** | `/api/chat` → `processPrompt()` → Gemini |
| **Response cleanup** | `lib/chat/plain-text-response.ts` (LaTeX stripped) → `components/chat/Chatbox.tsx` (blank lines between sentences) |
| **Stripe webhook** | `https://www.einsteinerror.com/api/stripe/webhook` (one Live endpoint) |
| **Supabase grant** | `grant select, insert, update on table public.profiles to service_role;` |
| **Reference** | [RESTORE-POINT.md](./RESTORE-POINT.md) · [USER-FLOWS.md](./USER-FLOWS.md) |

**Working rules:** one step at a time · no secrets pasted in chat · commit/push only when asked.
