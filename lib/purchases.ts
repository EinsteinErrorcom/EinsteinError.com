import { formatPurchaseAmount } from '@/lib/access';

export type PurchaseRow = {
  id: string;
  trial_start_at: string | null;
  access_tier?: string | null;
};

const PURCHASE_DATE_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export function formatPurchaseDate(iso: string | null | undefined): string {
  if (!iso) {
    return '—';
  }

  const parsed = Date.parse(iso);
  if (Number.isNaN(parsed)) {
    return '—';
  }

  const date = new Date(parsed);
  const month = PURCHASE_DATE_MONTHS[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = String(date.getUTCFullYear()).slice(-2);

  return `${month} ${day}/${year}`;
}

const PURCHASE_LINE_GAP = '     ';

export function formatPurchaseLine(row: PurchaseRow): string {
  return `${formatPurchaseDate(row.trial_start_at)}${PURCHASE_LINE_GAP}${formatPurchaseAmount(row.access_tier)}`;
}

export function formatPurchaseCsv(rows: PurchaseRow[]): string {
  const headers = ['Date', 'Amount'];
  const csvRows = rows.map(
    (row) =>
      `${formatPurchaseDate(row.trial_start_at)},${formatPurchaseAmount(row.access_tier)}`
  );
  return [headers.join(','), ...csvRows].join('\n');
}

export function formatPurchasesText(rows: PurchaseRow[]): string {
  if (rows.length === 0) {
    return 'No purchases yet.';
  }

  return rows.map(formatPurchaseLine).join('\n\n');
}

export type FreeTrialRow = {
  id: string;
  trial_start_at: string | null;
};

function formatFreeTrialClickCount(count: number): string {
  return count.toLocaleString('en-US');
}

export function formatFreeTrialLine(row: FreeTrialRow): string {
  return formatPurchaseDate(row.trial_start_at);
}

export function formatFreeTrialsText(rows: FreeTrialRow[], totalCount: number): string {
  const countLine = `Count: ${formatFreeTrialClickCount(totalCount)}`;

  if (rows.length === 0) {
    return `${countLine}\n\nNo active FREE Trial\nclick-throughs listed.`;
  }

  return `${countLine}\n\n${rows.map(formatFreeTrialLine).join('\n\n')}`;
}

export type GeniusesStats = {
  purchases: PurchaseRow[];
  freeTrials: FreeTrialRow[];
  freeTrialCount: number;
};

export function downloadPurchaseCsv(rows: PurchaseRow[]) {
  const csvContent = formatPurchaseCsv(rows);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'purchase_list.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function fetchGeniusesStats(): Promise<GeniusesStats> {
  const res = await fetch('/api/get-purchases');
  const data = (await res.json()) as GeniusesStats | { error?: string };

  if (!res.ok) {
    throw new Error('error' in data ? data.error : 'Unable to load Geniuses stats');
  }

  return data as GeniusesStats;
}
