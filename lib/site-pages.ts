/** 10-page site flow — pages 1–8 content, 9–10 product (chat + checkout) */
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
  '/checkout11',
] as const;

export function getNextSitePagePath(pageNumber: number): string | null {
  if (pageNumber < 1 || pageNumber >= SITE_PAGES.length) {
    return null;
  }

  return SITE_PAGES[pageNumber] ?? null;
}
