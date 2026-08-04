import PaymentCheckout from '@/components/pricing/PaymentCheckout';
import Link from 'next/link';
import { Suspense } from 'react';

/** MAX-LIT Secure Checkout — 3 Stripe tiers ($15 / $75 / $400) */
export default function Checkout10Page() {
  return (
    <main className="pricing-checkout-page">
      <div className="pricing-checkout-page__inner">
        <h1 className="pricing-checkout-page__title">MAX-LIT Secure Checkout</h1>
        <Suspense fallback={null}>
          <PaymentCheckout />
        </Suspense>
        <Link href="/" className="pricing-checkout-page__back">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
