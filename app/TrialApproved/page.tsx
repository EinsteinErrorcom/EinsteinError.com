import { CHAT_PATH } from '@/lib/trial-gate';
import { redirect } from 'next/navigation';

export default function LegacyTrialApprovedLowercaseRedirect() {
  redirect(CHAT_PATH);
}
