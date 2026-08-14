import { Suspense } from 'react';
import TrialExpired9Client from './TrialExpired9Client';

export default function TrialExpired9Page() {
  return (
    <Suspense fallback={null}>
      <TrialExpired9Client />
    </Suspense>
  );
}
