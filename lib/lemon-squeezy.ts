function normalizeStoreSlug(value: string): string {
  return value
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\.lemonsqueezy\.com\/?$/, "")
    .replace(/\/$/, "");
}

export function getLemonSqueezyPricesUrl(): string | null {
  const explicitUrl = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRICES_URL?.trim();
  if (explicitUrl) {
    return explicitUrl;
  }

  const storeSlug = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_SLUG?.trim();
  if (!storeSlug) {
    return null;
  }

  return `https://${normalizeStoreSlug(storeSlug)}.lemonsqueezy.com`;
}

export function getLemonSqueezyCheckoutUrl(): string | null {
  const explicitUrl = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL?.trim();
  if (explicitUrl) {
    return explicitUrl;
  }

  const storeSlug = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_SLUG?.trim();
  const variantId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_VARIANT_ID?.trim();
  if (!storeSlug || !variantId) {
    return null;
  }

  return `https://${normalizeStoreSlug(storeSlug)}.lemonsqueezy.com/checkout/buy/${variantId}`;
}
