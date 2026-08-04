import { PRICING_PATH } from '@/lib/trial-gate';
import { redirect } from 'next/navigation';

export default function LegacyPricingCheckoutRedirect() {
  redirect(PRICING_PATH);
}
