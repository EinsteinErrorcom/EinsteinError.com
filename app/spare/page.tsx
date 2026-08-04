import { SPARE_PATH } from '@/lib/trial-gate';
import { redirect } from 'next/navigation';

export default function LegacySpareRedirect() {
  redirect(SPARE_PATH);
}
