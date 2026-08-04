export type PricingTier = {
  priceId: string;
  label: string;
  description: string;
  amountCents: number;
  currency: 'usd';
};

export const STRIPE_PRODUCT_ID = 'prod_V0AXYbWwPdLkwz';

export const PRICING_TIERS: PricingTier[] = [
  {
    priceId: 'price_1U0ACSC39oHx6wOFTQfZCCTF',
    label: '$15 \t\t( for 3 Hours Time ) \t( Cost = 5 dollars per Hour )',
    description: '',
    amountCents: 1500,
    currency: 'usd',
  },
  {
    priceId: 'price_1U0ACSC39oHx6wOFWoJosDHi',
    label: '$75 \t\t( for 24 Hours Time )\t( Cost = 4 dollars per Hour )',
    description: '',
    amountCents: 7500,
    currency: 'usd',
  },
  {
    priceId: 'price_1U0ACSC39oHx6wOFgtNTWLNV',
    label: '$400\t( for 7 Days Time )  \t( Cost = 3 dollars per Hour )',
    description: '',
    amountCents: 40000,
    currency: 'usd',
  },
];

export function getPricingTier(priceId: string): PricingTier | undefined {
  return PRICING_TIERS.find((tier) => tier.priceId === priceId);
}
