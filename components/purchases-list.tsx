import { formatPurchaseLine, type PurchaseRow } from '@/lib/purchases';

type PurchasesListProps = {
  purchases: PurchaseRow[];
};

export function PurchasesList({ purchases }: PurchasesListProps) {
  if (purchases.length === 0) {
    return <p>No purchases yet.</p>;
  }

  return (
    <>
      {purchases.map((row, index) => (
        <div key={row.id}>
          {index > 0 ? <br /> : null}
          {formatPurchaseLine(row)}
        </div>
      ))}
    </>
  );
}
