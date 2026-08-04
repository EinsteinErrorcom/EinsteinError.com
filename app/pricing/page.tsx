import { PRICING_PATH } from '@/lib/trial-gate';
import { redirect } from 'next/navigation';

export default function LegacyPricingRedirect() {
  redirect(PRICING_PATH);
}
