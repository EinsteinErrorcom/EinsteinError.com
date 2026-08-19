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

export const PAGE_TITLES: Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8, string> = {
  1: 'MAX-LIT SUPERComputer',
  2: "PROOFS of Einstein's ERROR",
  3: "PROOFS of Einstein's ERROR",
  4: 'Amazing PHYSICS',
  5: 'Videos of PROOF',
  6: 'The TRUE Universe',
  7: 'NUMBERS of the True Universe',
  8: 'SolarMathTM CHARTS',
};

const NEXT_PAGE_PATH: Partial<Record<number, string>> = {
  1: '/page2',
  2: '/page3',
  3: '/page4',
  4: '/page5',
  5: '/page6',
  6: '/page7',
  7: '/page8',
  8: '/maxchatbox9',
};

export function getNextSitePagePath(pageNumber: number): string | null {
  return NEXT_PAGE_PATH[pageNumber] ?? null;
}
