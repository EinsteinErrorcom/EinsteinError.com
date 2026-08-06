/** 12-page site flow — page numbers match RESTORE-POINT.md */
export const SITE_PAGES = [
  '/',
  '/page2',
  '/page3',
  '/page4',
  '/page5',
  '/page6',
  '/page7',
  '/maxchatbox8',
  '/trialexpired9',
  '/checkout10',
  '/timeexpired11',
  '/spare12',
] as const;

export function getNextSitePagePath(pageNumber: number): string | null {
  if (pageNumber < 1 || pageNumber >= SITE_PAGES.length) {
    return null;
  }

  return SITE_PAGES[pageNumber] ?? null;
}
