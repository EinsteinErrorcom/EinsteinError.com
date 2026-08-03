import { redirect } from 'next/navigation';
import { PRICING_PATH } from '@/lib/trial-gate';

export default function TrialExpiredPage() {
  redirect(PRICING_PATH);
}
