'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

const BUY_BUTTON_ID =
  process.env.NEXT_PUBLIC_STRIPE_BUY_BUTTON_ID ??
  'buy_btn_1TtgkdC39oHx6wOF47FRLIUa';

const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
  'pk_live_51TpfpIC39oHx6wOFj7JfD9s7fw6gKV6XIMNE6a4AyN0YQA0KOhAKKE86QV8wdcNOICnky8R2iBkMBeilT10WY5Mi00Xi6F4AYd';

export default function StripeBuyButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!scriptReady || !container) {
      return;
    }

    container.replaceChildren();
    const button = document.createElement('stripe-buy-button');
    button.setAttribute('buy-button-id', BUY_BUTTON_ID);
    button.setAttribute('publishable-key', PUBLISHABLE_KEY);
    container.appendChild(button);
  }, [scriptReady]);

  return (
    <>
      <Script
        src="https://js.stripe.com/v3/buy-button.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div ref={containerRef} className="stripe-buy-button-wrap" />
      {!scriptReady && (
        <p className="pricing-checkout-page__loading">Loading secure checkout…</p>
      )}
    </>
  );
}
