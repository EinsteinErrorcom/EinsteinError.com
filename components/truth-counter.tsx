"use client";

import { createClient } from "@/lib/supabase/client";
import {
  formatTruthCount,
  TRUTH_COUNTER_FALLBACK,
  TRUTH_COUNTER_KEY,
} from "@/lib/truth-counter";
import { isTourMode, SITE_TOUR_QUERY, SITE_TOUR_STORAGE_KEY } from "@/lib/site-tour";
import { useEffect, useState } from "react";

export function TruthCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const loadCount = async () => {
      const { data, error } = await supabase
        .from("site_stats")
        .select("value")
        .eq("key", TRUTH_COUNTER_KEY)
        .maybeSingle();

      if (!cancelled && !error && typeof data?.value === "number") {
        setCount(data.value);
        return;
      }

      try {
        const response = await fetch("/api/counter");
        if (response.ok) {
          const payload = (await response.json()) as { count?: number };
          if (!cancelled && typeof payload.count === "number") {
            setCount(payload.count);
            return;
          }
        }
      } catch {
        // Ignore and use fallback below.
      }

      if (!cancelled) {
        setCount(TRUTH_COUNTER_FALLBACK);
      }
    };

    void loadCount();

    const channel = supabase
      .channel("truth-counter")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "site_stats",
          filter: `key=eq.${TRUTH_COUNTER_KEY}`,
        },
        (payload) => {
          const value = (payload.new as { value?: number }).value;
          if (typeof value === "number") {
            setCount(value);
          }
        }
      )
      .subscribe();

    if (
      !sessionStorage.getItem("hasCounted") &&
      !isTourMode(sessionStorage.getItem(SITE_TOUR_STORAGE_KEY)) &&
      !isTourMode(new URLSearchParams(window.location.search).get(SITE_TOUR_QUERY))
    ) {
      void fetch("/api/counter", { method: "POST" })
        .then(async (response) => {
          if (!response.ok) {
            return;
          }
          const payload = (await response.json()) as { count?: number };
          if (!cancelled && typeof payload.count === "number") {
            setCount(payload.count);
          }
          sessionStorage.setItem("hasCounted", "true");
        })
        .catch(() => {
          // Ignore increment failures; display still shows last known count.
        });
    }

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, []);

  return (
    <h1
      id="counter-display"
      style={{
        color: "#FFFFFF",
        fontWeight: "bold",
        fontStyle: "italic",
        fontSize: "20px",
        textShadow: "2px 2px 4px #000000",
      }}
    >
      #&nbsp;&nbsp;of&nbsp;&nbsp;people&nbsp;&nbsp;who&nbsp;&nbsp;now
      <br />
      know the TRUTH
      <br />
      &nbsp;&nbsp;=&nbsp;&nbsp;{" "}
      <span
        style={{
          color: "#C5A059",
          border: "3px solid #C5A059",
          padding: "4px 12px",
          display: "inline-block",
        }}
      >
        {count !== null ? formatTruthCount(count) : "Loading..."}
      </span>
    </h1>
  );
}
