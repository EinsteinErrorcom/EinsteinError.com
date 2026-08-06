export type PurchaseRow = {
  id: string;
  trial_start_at: string | null;
};

export function formatPurchaseCsv(rows: PurchaseRow[]): string {
  const headers = ['ID', 'Trial Start'];
  const csvRows = rows.map((row) => `${row.id},${row.trial_start_at ?? ''}`);
  return [headers.join(','), ...csvRows].join('\n');
}

export function formatPurchasesText(rows: PurchaseRow[]): string {
  if (rows.length === 0) {
    return 'No purchases yet.';
  }

  return rows
    .map((row) => `${row.id}\n${row.trial_start_at ?? '—'}`)
    .join('\n\n\n');
}

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

export async function fetchPurchases(): Promise<PurchaseRow[]> {
  const res = await fetch('/api/get-purchases');
  const data = (await res.json()) as PurchaseRow[] | { error?: string };

  if (!res.ok) {
    throw new Error('error' in data ? data.error : 'Unable to load purchases');
  }

  return data as PurchaseRow[];
}
