import { TRIAL_EXPIRED_PATH } from '@/lib/trial-gate';
import { redirect } from 'next/navigation';

export default function LegacyTrialExpiredRedirect() {
  redirect(TRIAL_EXPIRED_PATH);
}
