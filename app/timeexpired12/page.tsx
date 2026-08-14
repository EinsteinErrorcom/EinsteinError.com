import { Suspense } from 'react';
import TimeExpired11Client from './TimeExpired11Client';

export default function TimeExpired11Page() {
  return (
    <Suspense fallback={null}>
      <TimeExpired11Client />
    </Suspense>
  );
}
