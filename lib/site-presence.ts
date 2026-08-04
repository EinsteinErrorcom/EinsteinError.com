export const SITE_PRESENCE_CHANNEL = 'site-onsite-users';
export const VISITOR_ID_STORAGE_KEY = 'maxlit-visitor-id';

export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') {
    return 'server';
  }

  const existing = sessionStorage.getItem(VISITOR_ID_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const visitorId = crypto.randomUUID();
  sessionStorage.setItem(VISITOR_ID_STORAGE_KEY, visitorId);
  return visitorId;
}

export function countPresenceState(
  state: Record<string, unknown[]>
): number {
  return Object.values(state).reduce(
    (total, presences) => total + presences.length,
    0
  );
}
