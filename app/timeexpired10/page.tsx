import { CHECKOUT10_PATH } from '@/lib/trial-gate';
import { redirect } from 'next/navigation';

export default function LegacyTimeExpired10Redirect() {
  redirect(CHECKOUT10_PATH);
}
