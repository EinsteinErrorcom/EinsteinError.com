import { TIME_EXPIRED_PATH } from '@/lib/trial-gate';
import { redirect } from 'next/navigation';

export default function LegacyChat11Redirect() {
  redirect(TIME_EXPIRED_PATH);
}
