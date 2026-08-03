import PaymentCheckout from '@/components/pricing/PaymentCheckout';
import Link from 'next/link';

export default function PricingCheckoutPage() {
  return (
    <main className="pricing-checkout-page">
      <div className="pricing-checkout-page__inner">
        <h1 className="pricing-checkout-page__title">MAX-LIT Secure Checkout</h1>
        <PaymentCheckout />
        <Link href="/pricing" className="pricing-checkout-page__back">
          ← Back to pricing
        </Link>
      </div>
    </main>
  );
}
