'use client';

import { SIGN_IN_SECTION_ID } from '@/lib/trial-gate';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

function scrollToSignIn() {
  if (window.location.hash !== `#${SIGN_IN_SECTION_ID}`) {
    return;
  }

  const section = document.getElementById(SIGN_IN_SECTION_ID);
  section?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

export function ScrollToAuthSection() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') {
      return;
    }

    const timer = window.setTimeout(scrollToSignIn, 0);
    window.addEventListener('hashchange', scrollToSignIn);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('hashchange', scrollToSignIn);
    };
  }, [pathname]);

  return null;
}
