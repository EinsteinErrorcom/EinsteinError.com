import { CHAT8_PATH } from '@/lib/trial-gate';
import { redirect } from 'next/navigation';

export default function LegacyTrialExpiredRedirect() {
  redirect(CHAT8_PATH);
}
