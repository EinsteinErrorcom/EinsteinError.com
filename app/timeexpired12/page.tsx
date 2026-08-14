import { Suspense } from 'react';
import TimeExpired12Client from './TimeExpired12Client';

export default function TimeExpired12Page() {
  return (
    <Suspense fallback={null}>
      <TimeExpired12Client />
    </Suspense>
  );
}
