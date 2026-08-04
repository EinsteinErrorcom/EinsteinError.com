import { CHECKOUT_PATH } from '@/lib/trial-gate';
import { redirect } from 'next/navigation';

export default function LegacyCheckoutRedirect() {
  redirect(CHECKOUT_PATH);
}
