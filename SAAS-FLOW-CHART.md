# MAX-LIT SaaS Flow Chart

**Open this file and press `Cmd+Shift+V`** (Markdown Preview) to see the chart below.

Or open in your browser: **`http://localhost:3000/saas-paths.html`** (run `npm run dev` first).

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 980" width="820" role="img" aria-label="MAX-LIT SaaS paths flow chart">
  <defs>
    <marker id="arr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#64748b"/></marker>
    <style>
      .h{font:700 18px ui-sans-serif,system-ui,sans-serif;fill:#0f172a}
      .sub{font:400 12px ui-sans-serif,system-ui,sans-serif;fill:#64748b}
      .box{font:700 12px ui-sans-serif,system-ui,sans-serif;fill:#fff}
      .url{font:400 9px ui-monospace,Menlo,monospace;fill:rgba(255,255,255,.92)}
      .br{font:400 8.5px ui-sans-serif,system-ui,sans-serif;fill:#475569}
      .brb{font:600 8.5px ui-sans-serif,system-ui,sans-serif;fill:#0f172a}
      .dn{font:400 16px ui-sans-serif,system-ui,sans-serif;fill:#64748b;text-anchor:middle}
    </style>
  </defs>

  <rect width="820" height="980" fill="#eef2f7"/>
  <text x="410" y="32" text-anchor="middle" class="h">MAX-LIT SaaS Paths</text>
  <text x="410" y="52" text-anchor="middle" class="sub">All user paths — HOMEPage (top) → ChatBox Time Expired (bottom)</text>

  <!-- row helper: spine center x=410, box w=170 h=38 -->

  <!-- 1 HOMEPage -->
  <rect x="130" y="68" width="130" height="52" rx="5" fill="#fff" stroke="#94a3b8" stroke-dasharray="4 3"/>
  <text x="138" y="82" class="br"><tspan class="brb">Content</tspan> /page2–8</text>
  <text x="138" y="94" class="br"><tspan class="brb">Tour</tspan> ?tour=1</text>
  <text x="138" y="106" class="br"><tspan class="brb">Banner</tspan> → Price</text>

  <rect x="325" y="68" width="170" height="38" rx="7" fill="#3b82f6" stroke="#2563eb" stroke-width="2"/>
  <text x="410" y="85" text-anchor="middle" class="box">HOMEPage</text>
  <text x="410" y="98" text-anchor="middle" class="url">/</text>

  <rect x="560" y="68" width="130" height="52" rx="5" fill="#fff" stroke="#94a3b8" stroke-dasharray="4 3"/>
  <text x="568" y="82" class="br"><tspan class="brb">Purchases</tspan> panel</text>
  <text x="568" y="94" class="br">no route change</text>
  <text x="568" y="106" class="br">browse no login OK</text>

  <text x="410" y="128" class="dn">↓</text>

  <!-- 2 Google Log-In -->
  <rect x="130" y="136" width="130" height="52" rx="5" fill="#fff" stroke="#94a3b8" stroke-dasharray="4 3"/>
  <text x="138" y="150" class="br"><tspan class="brb">OAuth</tspan> /auth/google</text>
  <text x="138" y="162" class="br"><tspan class="brb">Auth error</tspan> → HOME</text>
  <text x="138" y="174" class="br"><tspan class="brb">Stripe</tspan> no session</text>

  <rect x="325" y="136" width="170" height="38" rx="7" fill="#10b981" stroke="#059669" stroke-width="2"/>
  <text x="410" y="153" text-anchor="middle" class="box">Google Log-In</text>
  <text x="410" y="166" text-anchor="middle" class="url">/#auth-section</text>

  <rect x="560" y="136" width="130" height="52" rx="5" fill="#fff" stroke="#94a3b8" stroke-dasharray="4 3"/>
  <text x="568" y="150" class="br"><tspan class="brb">Chat</tspan> logged out → here</text>
  <text x="568" y="162" class="br"><tspan class="brb">Trial used</tspan> → Expired</text>
  <text x="568" y="174" class="br">checkout_session_id</text>

  <text x="410" y="196" class="dn">↓</text>

  <!-- 3 Trial -->
  <rect x="130" y="204" width="130" height="40" rx="5" fill="#fff" stroke="#94a3b8" stroke-dasharray="4 3"/>
  <text x="138" y="220" class="br"><tspan class="brb">First sign-in</tspan> profile</text>
  <text x="138" y="232" class="br">trial_start_at = now</text>

  <rect x="325" y="204" width="170" height="38" rx="7" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>
  <text x="410" y="221" text-anchor="middle" class="box">1-Hour FREE Trial</text>
  <text x="410" y="234" text-anchor="middle" class="url">profiles.trial_start_at</text>

  <rect x="560" y="204" width="130" height="40" rx="5" fill="#fff" stroke="#94a3b8" stroke-dasharray="4 3"/>
  <text x="568" y="220" class="br"><tspan class="brb">Webhook paid</tspan> (F3)</text>
  <text x="568" y="232" class="br">sign in → Chat PAID</text>

  <text x="410" y="262" class="dn">↓</text>

  <!-- 4 ChatBox -->
  <rect x="130" y="270" width="130" height="52" rx="5" fill="#fff" stroke="#94a3b8" stroke-dasharray="4 3"/>
  <text x="138" y="284" class="br"><tspan class="brb">Home</tspan> → HOMEPage</text>
  <text x="138" y="296" class="br"><tspan class="brb">Sign out</tspan> → HOMEPage</text>
  <text x="138" y="308" class="br"><tspan class="brb">/api/chat</tspan> gatekeeper</text>

  <rect x="325" y="270" width="170" height="38" rx="7" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
  <text x="410" y="287" text-anchor="middle" class="box">MAX-LIT ChatBox</text>
  <text x="410" y="300" text-anchor="middle" class="url">/maxchatbox9</text>

  <rect x="560" y="270" width="130" height="52" rx="5" fill="#fff" stroke="#94a3b8" stroke-dasharray="4 3"/>
  <text x="568" y="284" class="br"><tspan class="brb">Paid</tspan> → Chat PAID</text>
  <text x="568" y="296" class="br"><tspan class="brb">Trial &gt; 1 hr</tspan> → Expired</text>
  <text x="568" y="308" class="br"><tspan class="brb">API</tspan> 403 if expired</text>

  <text x="410" y="336" class="dn">↓</text>

  <!-- 5 Trial Expired -->
  <rect x="130" y="344" width="130" height="52" rx="5" fill="#fff" stroke="#94a3b8" stroke-dasharray="4 3"/>
  <text x="138" y="358" class="br"><tspan class="brb">Click</tspan> → Price Page</text>
  <text x="138" y="370" class="br"><tspan class="brb">Footer Next</tspan> → Price</text>
  <text x="138" y="382" class="br">sign-in redirect</text>

  <rect x="325" y="344" width="170" height="38" rx="7" fill="#f97316" stroke="#ea580c" stroke-width="2"/>
  <text x="410" y="361" text-anchor="middle" class="box">Trial Expired</text>
  <text x="410" y="374" text-anchor="middle" class="url">/checkout10</text>

  <rect x="560" y="344" width="130" height="40" rx="5" fill="#fff" stroke="#94a3b8" stroke-dasharray="4 3"/>
  <text x="568" y="360" class="br"><tspan class="brb">Auto</tspan> after 1 hr</text>
  <text x="568" y="372" class="br">logged in, not paid</text>

  <text x="410" y="410" class="dn">↓</text>

  <!-- 6 Price Page -->
  <rect x="130" y="418" width="130" height="52" rx="5" fill="#fff" stroke="#94a3b8" stroke-dasharray="4 3"/>
  <text x="138" y="432" class="br"><tspan class="brb">Footer Next</tspan> → Time Exp.</text>
  <text x="138" y="444" class="br"><tspan class="brb">Stripe cancel</tspan> → here</text>
  <text x="138" y="456" class="br"><tspan class="brb">Banner skip</tspan> from HOME</text>

  <rect x="325" y="418" width="170" height="38" rx="7" fill="#8b5cf6" stroke="#7c3aed" stroke-width="2"/>
  <text x="410" y="435" text-anchor="middle" class="box">Price Page</text>
  <text x="410" y="448" text-anchor="middle" class="url">/checkout10 · $15/$75/$400</text>

  <rect x="560" y="418" width="130" height="52" rx="5" fill="#fff" stroke="#94a3b8" stroke-dasharray="4 3"/>
  <text x="568" y="432" class="br"><tspan class="brb">Not signed in</tspan> → Log-In</text>
  <text x="568" y="444" class="br"><tspan class="brb">Pick tier</tspan> → Stripe</text>
  <text x="568" y="456" class="br">pages 1–8 no login</text>

  <text x="410" y="484" class="dn">↓</text>

  <!-- 7 Stripe -->
  <rect x="130" y="492" width="130" height="40" rx="5" fill="#fff" stroke="#94a3b8" stroke-dasharray="4 3"/>
  <text x="138" y="508" class="br"><tspan class="brb">Cancel</tspan> → Price (F4)</text>
  <text x="138" y="520" class="br">cancel_url checkout10</text>

  <rect x="325" y="492" width="170" height="38" rx="7" fill="#14b8a6" stroke="#0d9488" stroke-width="2"/>
  <text x="410" y="509" text-anchor="middle" class="box">Stripe Checkout</text>
  <text x="410" y="522" text-anchor="middle" class="url">3 hr / 24 hr / 7 day tiers</text>

  <rect x="560" y="492" width="130" height="52" rx="5" fill="#fff" stroke="#94a3b8" stroke-dasharray="4 3"/>
  <text x="568" y="506" class="br"><tspan class="brb">Success</tspan> → Chat PAID (F1)</text>
  <text x="568" y="518" class="br"><tspan class="brb">No session</tspan> → Log-In (F2)</text>
  <text x="568" y="530" class="br"><tspan class="brb">Webhook</tspan> is_subscribed</text>

  <text x="410" y="558" class="dn">↓</text>

  <!-- 8 Chat PAID -->
  <rect x="130" y="566" width="130" height="52" rx="5" fill="#fff" stroke="#94a3b8" stroke-dasharray="4 3"/>
  <text x="138" y="580" class="br"><tspan class="brb">Sign out</tspan> → HOMEPage</text>
  <text x="138" y="592" class="br"><tspan class="brb">Re-sign-in</tspan> → ChatBox</text>
  <text x="138" y="604" class="br">no trial expiry</text>

  <rect x="325" y="566" width="170" height="38" rx="7" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
  <text x="410" y="583" text-anchor="middle" class="box">MAX-LIT ChatBox PAID</text>
  <text x="410" y="596" text-anchor="middle" class="url">is_subscribed = true</text>

  <rect x="560" y="566" width="130" height="52" rx="5" fill="#fff" stroke="#94a3b8" stroke-dasharray="4 3"/>
  <text x="568" y="580" class="br"><tspan class="brb">session_id</tspan> fulfill</text>
  <text x="568" y="592" class="br">maxchatbox9?session_id=</text>
  <text x="568" y="604" class="br">always chat access</text>

  <text x="410" y="632" class="dn">↓</text>

  <!-- 9 BOTTOM: ChatBox Time Expired -->
  <rect x="130" y="640" width="130" height="52" rx="5" fill="#fff" stroke="#94a3b8" stroke-dasharray="4 3"/>
  <text x="138" y="654" class="br"><tspan class="brb">Click</tspan> → Price Page</text>
  <text x="138" y="666" class="br"><tspan class="brb">/chat11</tspan> legacy</text>
  <text x="138" y="678" class="br">cookie gate expired</text>

  <rect x="325" y="640" width="170" height="38" rx="7" fill="#ef4444" stroke="#dc2626" stroke-width="2"/>
  <text x="410" y="655" text-anchor="middle" class="box">ChatBox Time Expired</text>
  <text x="410" y="668" text-anchor="middle" class="url">/checkout10</text>

  <rect x="560" y="640" width="130" height="52" rx="5" fill="#fff" stroke="#94a3b8" stroke-dasharray="4 3"/>
  <text x="568" y="654" class="br"><tspan class="brb">Footer chain</tspan> from Price</text>
  <text x="568" y="666" class="br"><tspan class="brb">Site Tour</tspan> step-through</text>
  <text x="568" y="678" class="br"><tspan class="brb">Next Page</tspan> → end of site tour</text>

  <!-- spine arrows -->
  <line x1="410" y1="106" x2="410" y2="136" stroke="#64748b" stroke-width="1.5" marker-end="url(#arr)"/>
  <line x1="410" y1="174" x2="410" y2="204" stroke="#64748b" stroke-width="1.5" marker-end="url(#arr)"/>
  <line x1="410" y1="242" x2="410" y2="270" stroke="#64748b" stroke-width="1.5" marker-end="url(#arr)"/>
  <line x1="410" y1="308" x2="410" y2="344" stroke="#64748b" stroke-width="1.5" marker-end="url(#arr)"/>
  <line x1="410" y1="382" x2="410" y2="418" stroke="#64748b" stroke-width="1.5" marker-end="url(#arr)"/>
  <line x1="410" y1="456" x2="410" y2="492" stroke="#64748b" stroke-width="1.5" marker-end="url(#arr)"/>
  <line x1="410" y1="530" x2="410" y2="566" stroke="#64748b" stroke-width="1.5" marker-end="url(#arr)"/>
  <line x1="410" y1="604" x2="410" y2="640" stroke="#64748b" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- legend -->
  <text x="410" y="720" text-anchor="middle" class="sub">Color key</text>
  <rect x="60" y="732" width="14" height="14" rx="2" fill="#3b82f6"/><text x="80" y="743" class="br">HOMEPage</text>
  <rect x="160" y="732" width="14" height="14" rx="2" fill="#10b981"/><text x="180" y="743" class="br">Log-In</text>
  <rect x="240" y="732" width="14" height="14" rx="2" fill="#eab308"/><text x="260" y="743" class="br">Trial</text>
  <rect x="310" y="732" width="14" height="14" rx="2" fill="#2563eb"/><text x="330" y="743" class="br">ChatBox</text>
  <rect x="400" y="732" width="14" height="14" rx="2" fill="#f97316"/><text x="420" y="743" class="br">Trial Expired</text>
  <rect x="520" y="732" width="14" height="14" rx="2" fill="#8b5cf6"/><text x="540" y="743" class="br">Price</text>
  <rect x="600" y="732" width="14" height="14" rx="2" fill="#14b8a6"/><text x="620" y="743" class="br">Stripe</text>
  <rect x="690" y="732" width="14" height="14" rx="2" fill="#ef4444"/><text x="710" y="743" class="br">Time Expired</text>
</svg>

</div>
