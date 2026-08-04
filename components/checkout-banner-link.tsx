import { CHECKOUT_PATH } from '@/lib/trial-gate';

export function CheckoutBannerLink() {
  return (
    <p className="checkout-banner-link">
      <a href={CHECKOUT_PATH}>Link to MAX-LIT SUPERComputer</a>
    </p>
  );
}
