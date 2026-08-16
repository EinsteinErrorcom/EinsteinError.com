export type PricingTier = {
  priceId: string;
  price: string;
  label: string;
  description: string;
  amountCents: number;
  currency: 'usd';
};

export const STRIPE_PRODUCT_ID = 'prod_V0AXYbWwPdLkwz';

export const PRICING_TIERS: PricingTier[] = [
  {
    priceId: 'price_1U0ACSC39oHx6wOFTQfZCCTF',
    price: '$15',
    label: '\t( for 3 Hours Time )\n( Cost = 5 dollars per Hour )',
    description: '',
    amountCents: 1500,
    currency: 'usd',
  },
  {
    priceId: 'price_1U0ACSC39oHx6wOFWoJosDHi',
    price: '$75',
    label: '\t( for 24 Hours Time )\n( Cost = 4 dollars per Hour )',
    description: '',
    amountCents: 7500,
    currency: 'usd',
  },
  {
    priceId: 'price_1U0ACSC39oHx6wOFgtNTWLNV',
    price: '$400',
    label: '\t( for 7 Days Time )\n( Cost = 3 dollars per Hour )',
    description: '',
    amountCents: 40000,
    currency: 'usd',
  },
];

export function getPricingTier(priceId: string): PricingTier | undefined {
  return PRICING_TIERS.find((tier) => tier.priceId === priceId);
}
