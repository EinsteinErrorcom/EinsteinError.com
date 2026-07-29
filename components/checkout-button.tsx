"use client";

import { createClient } from "@/lib/supabase/client";

import { getLemonSqueezyCheckoutUrl } from "@/lib/lemon-squeezy";

const checkoutUrl = getLemonSqueezyCheckoutUrl();

type CheckoutButtonProps = {
  children?: React.ReactNode;
  className?: string;
  id?: string;
};

export function CheckoutButton({
  children = "Proceed to Checkout",
  className,
  id,
}: CheckoutButtonProps) {
  async function handleCheckout() {
    if (!checkoutUrl) {
      window.location.href = "/checkout";
      return;
    }

    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      window.location.href = checkoutUrl;
      return;
    }

    window.location.href = "/checkout";
  }

  return (
    <button type="button" id={id} className={className} onClick={handleCheckout}>
      {children}
    </button>
  );
}
