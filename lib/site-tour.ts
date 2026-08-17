export type SiteTourStep = {
  path: string;
  label: string;
};

export const SITE_TOUR_QUERY = 'tour';
export const SITE_TOUR_STORAGE_KEY = 'maxlit-site-tour';

export const SITE_TOUR_STEPS: SiteTourStep[] = [
  { path: '/', label: 'Home' },
  { path: '/page2', label: 'Page 2' },
  { path: '/page3', label: 'Page 3' },
  { path: '/page4', label: 'Page 4' },
  { path: '/page5', label: 'Page 5' },
  { path: '/page6', label: 'Page 6' },
  { path: '/page8', label: 'Page 8' },
  { path: '/maxchatbox9', label: 'AI Chatbox' },
  { path: '/checkout11', label: 'Checkout' },
];

export function getTourHref(path: string): string {
  return `${path}?${SITE_TOUR_QUERY}=1`;
}

export function isTourMode(value: string | null | undefined): boolean {
  return value === '1';
}

export function normalizeTourPath(pathname: string): string {
  if (!pathname || pathname === '') {
    return '/';
  }
  return pathname.endsWith('/') && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;
}

export function getTourStepIndex(pathname: string): number {
  const clean = normalizeTourPath(pathname.split('?')[0] ?? '/');
  return SITE_TOUR_STEPS.findIndex((step) => step.path === clean);
}

export function getTourStep(pathname: string): SiteTourStep | null {
  const index = getTourStepIndex(pathname);
  return index >= 0 ? SITE_TOUR_STEPS[index] : null;
}
