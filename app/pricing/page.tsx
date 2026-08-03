import Link from 'next/link';

export default function PricingPage() {
  return (
    <main className="pricing-page">
      <a
        href="/pricing/checkout"
        target="_blank"
        rel="noopener noreferrer"
        className="pricing-page__link"
        aria-label="Open MAX-LIT Stripe checkout in a new tab"
      >
        <div className="pricing-page__frame">
          <img
            src="/PRICING.png"
            alt="MAX-LIT Pricing — The World's Most Powerful PURE Physics Engine"
            className="pricing-page__image"
            width={600}
            height={900}
          />
        </div>
      </a>

      <Link href="/" className="pricing-page__home">
        ← Back to Home
      </Link>
    </main>
  );
}
