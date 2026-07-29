"use client";

import { useEffect } from "react";

export default function Page5() {
  useEffect(() => {
    const downloadPurchases = async () => {
      try {
        // 1. Fetch data from your API route
        const res = await fetch("/api/get-purchases");
        const data = await res.json();

        if (data.error) {
          console.error("Error fetching data:", data.error);
          return;
        }

        // 2. Convert JSON array to CSV format
        const headers = ["ID", "Trial Start"];
        const rows = data.map((row: any) => `${row.id},${row.trial_start_at}`);
        const csvContent = [headers.join(","), ...rows].join("\n");

        // 3. Create a Blob and trigger the download
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
  }, []);

  return (
    <div style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>Report Generating...</h1>
      <p>Your purchase list is being downloaded automatically.</p>
    </div>
  );
}