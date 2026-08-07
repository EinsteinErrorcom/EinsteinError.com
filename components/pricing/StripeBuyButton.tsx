'use client';

import Link from 'next/link';
import { CHECKOUT_PATH } from '@/lib/trial-gate';

/** Legacy Stripe buy-button entry — route customers to the app checkout page instead. */
export default function StripeBuyButton() {
  return (
    <p className="pricing-checkout-page__loading">
      Use{' '}
      <Link href={CHECKOUT_PATH} className="pricing-checkout-page__sign-in">
        MAX-LIT Secure Checkout
      </Link>{' '}
      for all payment tiers ($15 / $75 / $400).
    </p>
  );
}
