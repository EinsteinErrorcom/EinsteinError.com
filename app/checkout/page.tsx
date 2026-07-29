"use client";

import { useEffect, useState } from "react";
import { CheckoutButton } from "@/components/checkout-button";
import { createClient } from "@/lib/supabase/client";
import { getLemonSqueezyCheckoutUrl } from "@/lib/lemon-squeezy";

const checkoutUrl = getLemonSqueezyCheckoutUrl();

export default function CheckoutPage() {
  const [status, setStatus] = useState(() =>
    checkoutUrl
      ? "Redirecting to secure checkout..."
      : "Checkout configuration is unavailable. Please contact support."
  );

  useEffect(() => {
    if (!checkoutUrl) {
      return;
    }

    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        window.location.href = checkoutUrl;
        return;
      }

      setStatus("Please sign in before checkout.");
      window.location.href = "/";
    });
  }, []);

  return (
    <main className="page-wrapper">
      <h1>{status}</h1>
      <p>Please wait while we redirect you to finalize your transaction.</p>
      {checkoutUrl ? <CheckoutButton /> : null}
    </main>
  );
}
