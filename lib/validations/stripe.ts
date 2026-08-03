import { z } from 'zod';

export const createPaymentIntentSchema = z.object({
  priceId: z.string().min(1, 'priceId is required'),
});
