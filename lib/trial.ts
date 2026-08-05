export const TRIAL_DURATION_MS = 1 * 60 * 60 * 1000;
export const TRIAL_COOKIE = "maxlit_trial_started_at";

export function getTrialEndsAt(startedAtMs: number): number {
  return startedAtMs + TRIAL_DURATION_MS;
}

export function isTrialExpired(startedAtMs: number, now = Date.now()): boolean {
  return now >= getTrialEndsAt(startedAtMs);
}

export function parseTrialStartedAt(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function getRemainingTrialMs(startedAtMs: number, now = Date.now()): number {
  return Math.max(0, getTrialEndsAt(startedAtMs) - now);
}

export type ProfileTrial = {
  trial_start_at: string | null;
  is_subscribed: boolean | null;
};

export function isProfileTrialActive(profile: ProfileTrial, now = Date.now()): boolean {
  if (profile.is_subscribed) {
    return true;
  }

  if (!profile.trial_start_at) {
    return false;
  }

  const startedAt = Date.parse(profile.trial_start_at);
  if (Number.isNaN(startedAt)) {
    return false;
  }

  return now - startedAt < TRIAL_DURATION_MS;
}
