import { CHECKOUT_PATH } from '@/lib/trial-gate';
import { redirect } from 'next/navigation';

export default function LegacyCheckout9Redirect() {
  redirect(CHECKOUT_PATH);
}
