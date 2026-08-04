import { CHAT_PATH } from '@/lib/trial-gate';
import { redirect } from 'next/navigation';

export default function LegacyFreeTrialApprovedRedirect() {
  redirect(CHAT_PATH);
}
