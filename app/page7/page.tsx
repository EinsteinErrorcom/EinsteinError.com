"use client";

import { PageEndFooter } from "@/components/page-end-footer";
import { PurchasesList } from "@/components/purchases-list";
import { downloadPurchaseCsv, fetchPurchases, type PurchaseRow } from "@/lib/purchases";
import { isTourMode, SITE_TOUR_QUERY } from "@/lib/site-tour";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page7() {
  const searchParams = useSearchParams();
  const tourMode = isTourMode(searchParams.get(SITE_TOUR_QUERY));
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tourMode) {
      setLoading(false);
      return;
    }

    const loadPurchases = async () => {
      try {
        const rows = await fetchPurchases();
        setPurchases(rows);
        downloadPurchaseCsv(rows);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load purchases");
      } finally {
        setLoading(false);
      }
    };

    void loadPurchases();
  }, [tourMode]);

  return (
    <div className="page-shell">
      <main className="page-wrapper" style={{ padding: "50px 16px", textAlign: "center" }}>
        <h1 style={{ color: "#00FFFF", fontStyle: "italic" }}>All Purchases</h1>
        {tourMode && (
          <p style={{ color: "#FFFF00", fontStyle: "italic" }}>
            Tour preview — purchase list and download are disabled.
          </p>
        )}
        {loading && <p style={{ color: "#C5A059" }}>Loading purchases…</p>}
        {error && <p style={{ color: "#FF6B6B" }}>{error}</p>}
        {!loading && !error && !tourMode && (
          <>
            <p style={{ color: "#C5A059", marginBottom: "32px" }}>
              Your purchase list has been downloaded automatically.
            </p>
            <div
              style={{
                fontWeight: "bold",
                fontStyle: "italic",
                color: "#00FFFF",
                fontSize: "20px",
              }}
            >
              <PurchasesList purchases={purchases} />
            </div>
          </>
        )}
        <PageEndFooter pageNumber={7} />
      </main>
    </div>
  );
}
