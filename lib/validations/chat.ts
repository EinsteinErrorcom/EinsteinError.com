import { z } from 'zod';

export const chatRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .max(8000, 'Message exceeds maximum length'),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
