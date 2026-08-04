import { CHECKOUT_PATH } from '@/lib/trial-gate';
import { UsersOnsiteDisplay } from '@/components/users-onsite-display';

export function CheckoutBannerLink() {
  return (
    <div className="checkout-banner-link">
      <p className="checkout-banner-link__text">
        <a href={CHECKOUT_PATH}>Link to MAX-LIT SUPERComputer</a>
      </p>
      <UsersOnsiteDisplay />
    </div>
  );
}
