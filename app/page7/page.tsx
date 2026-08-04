"use client";

import { isTourMode, SITE_TOUR_QUERY } from "@/lib/site-tour";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Page7() {
  const searchParams = useSearchParams();
  const tourMode = isTourMode(searchParams.get(SITE_TOUR_QUERY));

  useEffect(() => {
    if (tourMode) {
      return;
    }

    const downloadPurchases = async () => {
      try {
        const res = await fetch("/api/get-purchases");
        const data = await res.json();

        if (data.error) {
          console.error("Error fetching data:", data.error);
          return;
        }

        const headers = ["ID", "Trial Start"];
        const rows = data.map((row: { id: string; trial_start_at: string }) =>
          `${row.id},${row.trial_start_at}`
        );
        const csvContent = [headers.join(","), ...rows].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "purchase_list.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error("Failed to download:", err);
      }
    };

    downloadPurchases();
  }, [tourMode]);

  return (
    <div className="page-shell">
      <main className="page-wrapper" style={{ padding: "50px", textAlign: "center" }}>
        <h1 style={{ color: '#00FFFF' }}>Report Generating...</h1>
        <p>
          {tourMode
            ? 'Tour preview — CSV download is disabled on this page.'
            : 'Your purchase list is being downloaded automatically.'}
        </p>
        <footer className="page-footer">
          <a className="page-footer__back" href="/page6">← Back to Page 6</a>
          <a className="page-footer__back" href="/">← Back to Home</a>
        </footer>
      </main>
    </div>
  );
}
