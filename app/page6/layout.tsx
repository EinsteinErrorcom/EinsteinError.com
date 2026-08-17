import { Suspense } from 'react';

export default function Page6Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
