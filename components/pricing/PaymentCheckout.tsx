'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { PRICING_TIERS, type PricingTier } from '@/lib/stripe/pricing';
import { isTourMode, SITE_TOUR_QUERY } from '@/lib/site-tour';
import { SIGN_IN_PATH } from '@/lib/trial-gate';

function renderTierLabel(label: string) {
  const match = label.match(/^(.*?)(\( Cost = )(\d+)( dollars per Hour \))(.*)$/s);
  if (!match) {
    return label;
  }

  const [, before, costPrefix, costNumber, costSuffix, after] = match;

  return (
    <>
      {before}
      {costPrefix}
      <span className="payment-checkout__cost-hour">{costNumber}</span>
      {costSuffix}
      {after}
    </>
  );
}

export default function PaymentCheckout() {
  const searchParams = useSearchParams();
  const tourMode = isTourMode(searchParams.get(SITE_TOUR_QUERY));
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [loadingTierId, setLoadingTierId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = useCallback(async (tier: PricingTier) => {
    if (tourMode) {
      return;
    }
    setSelectedTierId(tier.priceId);
    setLoadingTierId(tier.priceId);
    setError(null);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ priceId: tier.priceId }),
      });

      const data = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? 'Unable to start checkout');
      }

      if (!data.url) {
        throw new Error('Missing Stripe checkout URL');
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start checkout');
      setSelectedTierId(null);
      setLoadingTierId(null);
    }
  }, [tourMode]);

  return (
    <div className="payment-checkout">
      {tourMode && (
        <p className="payment-checkout__tour-note" role="status">
          Tour preview — payment buttons are disabled.
        </p>
      )}
      <p className="payment-checkout__intro">
        Choose your MAX-LIT access cost
        <br />
        and your payment will be SECURELY made using STRIPE.
      </p>

      <div className="payment-checkout__tiers" data-tour-block={tourMode ? 'true' : undefined}>
        {PRICING_TIERS.map((tier) => {
          const isSelected = selectedTierId === tier.priceId;
          const isLoading = loadingTierId === tier.priceId;

          return (
            <button
              key={tier.priceId}
              type="button"
              className={`payment-checkout__tier${isSelected ? ' payment-checkout__tier--selected' : ''}`}
              onClick={() => startCheckout(tier)}
              disabled={Boolean(loadingTierId)}
            >
              <span className="payment-checkout__tier-label">
                {'\t'}
                <span className="payment-checkout__tier-price">{tier.price}</span>
                {renderTierLabel(tier.label)}
              </span>
              <span className="payment-checkout__tier-desc">{tier.description}</span>
              {isLoading && (
                <span className="payment-checkout__tier-loading">
                  Redirecting to Stripe…
                </span>
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="payment-checkout__error-block" role="alert">
          <p>{error}</p>
          {error.includes('STRIPE_NOT_CONFIGURED') || error.includes('STRIPE_SECRET_KEY') ? (
            <p className="payment-checkout__stripe-setup">
              Open{' '}
              <a
                href="https://dashboard.stripe.com/apikeys"
                target="_blank"
                rel="noopener noreferrer"
                className="payment-checkout__sign-in"
              >
                Stripe Dashboard → API keys
              </a>
              , copy the <strong>Secret key</strong> (<code>sk_live_...</code>), paste into{' '}
              <code>.env.local</code> as <code>STRIPE_SECRET_KEY=...</code>, then restart{' '}
              <code>npm run dev</code>.
            </p>
          ) : null}
          {error.includes('Sign in') && (
            <Link href={SIGN_IN_PATH} className="payment-checkout__sign-in">
              Go to Sign-in
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
