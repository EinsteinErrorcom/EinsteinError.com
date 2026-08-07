import { getPricingTier } from '@/lib/stripe/pricing';

export const ACCESS_TIER_TRIAL = 'trial' as const;
export const ACCESS_TIER_PAID_3H = 'paid_3h' as const;
export const ACCESS_TIER_PAID_24H = 'paid_24h' as const;
export const ACCESS_TIER_PAID_7D = 'paid_7d' as const;

export type AccessTier =
  | typeof ACCESS_TIER_TRIAL
  | typeof ACCESS_TIER_PAID_3H
  | typeof ACCESS_TIER_PAID_24H
  | typeof ACCESS_TIER_PAID_7D;

export type ProfileAccess = {
  trial_start_at: string | null;
  is_subscribed?: boolean | null;
  access_tier?: AccessTier | string | null;
};

export const ACCESS_DURATION_MS: Record<AccessTier, number> = {
  trial: 1 * 60 * 60 * 1000,
  paid_3h: 3 * 60 * 60 * 1000,
  paid_24h: 24 * 60 * 60 * 1000,
  paid_7d: 7 * 24 * 60 * 60 * 1000,
};

export const ACCESS_TIER_LABELS: Record<AccessTier, string> = {
  trial: '1 Hour',
  paid_3h: '3 Hours',
  paid_24h: '24 Hours',
  paid_7d: '7 Days',
};

const PRICE_ID_TO_ACCESS_TIER: Record<string, AccessTier> = {
  price_1U0ACSC39oHx6wOFTQfZCCTF: ACCESS_TIER_PAID_3H,
  price_1U0ACSC39oHx6wOFWoJosDHi: ACCESS_TIER_PAID_24H,
  price_1U0ACSC39oHx6wOFgtNTWLNV: ACCESS_TIER_PAID_7D,
};

export function normalizeAccessTier(
  tier: string | null | undefined,
  isSubscribed?: boolean | null
): AccessTier {
  if (
    tier === ACCESS_TIER_TRIAL ||
    tier === ACCESS_TIER_PAID_3H ||
    tier === ACCESS_TIER_PAID_24H ||
    tier === ACCESS_TIER_PAID_7D
  ) {
    return tier;
  }

  if (isSubscribed) {
    return ACCESS_TIER_PAID_3H;
  }

  return ACCESS_TIER_TRIAL;
}

export function getAccessTierFromPriceId(priceId: string): AccessTier | null {
  const mapped = PRICE_ID_TO_ACCESS_TIER[priceId];
  if (mapped) {
    return mapped;
  }

  const tier = getPricingTier(priceId);
  if (!tier) {
    return null;
  }

  return PRICE_ID_TO_ACCESS_TIER[tier.priceId] ?? null;
}

export function parseAccessStartedAt(profile: ProfileAccess): number | null {
  if (!profile.trial_start_at) {
    return null;
  }

  const parsed = Date.parse(profile.trial_start_at);
  return Number.isNaN(parsed) ? null : parsed;
}

export function getAccessDurationMs(profile: ProfileAccess): number {
  const tier = normalizeAccessTier(profile.access_tier, profile.is_subscribed);
  return ACCESS_DURATION_MS[tier];
}

export function getAccessEndsAtMs(profile: ProfileAccess, now = Date.now()): number | null {
  const startedAt = parseAccessStartedAt(profile);
  if (startedAt === null) {
    return null;
  }

  return startedAt + getAccessDurationMs(profile);
}

export function getRemainingAccessMs(profile: ProfileAccess, now = Date.now()): number {
  const endsAt = getAccessEndsAtMs(profile, now);
  if (endsAt === null) {
    return 0;
  }

  return Math.max(0, endsAt - now);
}

export function isAccessActive(profile: ProfileAccess, now = Date.now()): boolean {
  return getRemainingAccessMs(profile, now) > 0;
}

export function isPaidAccessTier(tier: AccessTier): boolean {
  return tier !== ACCESS_TIER_TRIAL;
}

export function resolveCountdownProps(profile: ProfileAccess): {
  accessTier: AccessTier;
  accessStartedAt: string;
} | null {
  const accessStartedAt = profile.trial_start_at;
  if (!accessStartedAt) {
    return null;
  }

  return {
    accessTier: normalizeAccessTier(profile.access_tier, profile.is_subscribed),
    accessStartedAt,
  };
}
