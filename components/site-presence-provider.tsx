'use client';

import { createClient } from '@/lib/supabase/client';
import {
  countPresenceState,
  getOrCreateVisitorId,
  SITE_PRESENCE_CHANNEL,
} from '@/lib/site-presence';
import { isTourMode, SITE_TOUR_QUERY, SITE_TOUR_STORAGE_KEY } from '@/lib/site-tour';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type SitePresenceContextValue = {
  count: number;
};

const SitePresenceContext = createContext<SitePresenceContextValue>({
  count: 0,
});

function shouldSkipPresenceTracking(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  return (
    isTourMode(sessionStorage.getItem(SITE_TOUR_STORAGE_KEY)) ||
    isTourMode(new URLSearchParams(window.location.search).get(SITE_TOUR_QUERY))
  );
}

export function SitePresenceProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (shouldSkipPresenceTracking()) {
      return;
    }

    const supabase = createClient();
    const visitorId = getOrCreateVisitorId();

    const channel = supabase.channel(SITE_PRESENCE_CHANNEL, {
      config: {
        presence: {
          key: visitorId,
        },
      },
    });

    channel.on('presence', { event: 'sync' }, () => {
      setCount(countPresenceState(channel.presenceState()));
    });

    channel.subscribe(async (status) => {
      if (status !== 'SUBSCRIBED') {
        return;
      }

      await channel.track({
        online_at: new Date().toISOString(),
      });
      setCount(countPresenceState(channel.presenceState()));
    });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const value = useMemo(() => ({ count }), [count]);

  return (
    <SitePresenceContext.Provider value={value}>
      {children}
    </SitePresenceContext.Provider>
  );
}

export function useUsersOnsiteCount(): number {
  return useContext(SitePresenceContext).count;
}
