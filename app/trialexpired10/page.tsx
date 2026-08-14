import { Suspense } from 'react';
import TrialExpired10Client from './TrialExpired10Client';

export default function TrialExpired10Page() {
  return (
    <Suspense fallback={null}>
      <TrialExpired10Client />
    </Suspense>
  );
}
