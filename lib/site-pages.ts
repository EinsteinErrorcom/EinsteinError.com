/** 12-page site flow — pages 1–8 content, 9–12 product */
export const SITE_PAGES = [
  '/',
  '/page2',
  '/page3',
  '/page4',
  '/page5',
  '/page6',
  '/page7',
  '/page8',
  '/maxchatbox9',
  '/trialexpired10',
  '/checkout11',
  '/timeexpired12',
] as const;

export function getNextSitePagePath(pageNumber: number): string | null {
  if (pageNumber < 1 || pageNumber >= SITE_PAGES.length) {
    return null;
  }

  return SITE_PAGES[pageNumber] ?? null;
}
