import { z } from 'zod';

const phone = z
  .string()
  .trim()
  .regex(/^[+\d][\d\s-]{7,16}$/, 'Enter a valid phone number');

/** Fields people fill in. Shared by the client forms and the API. */
export const leadClientSchema = z.object({
  name: z.string().trim().min(2, 'Please tell us your name').max(80),
  company: z.string().trim().max(120).optional().or(z.literal('')),
  phone: phone,
  email: z.string().trim().email('Enter a valid email').max(160),
  city: z.string().trim().max(80).optional().or(z.literal('')),
  industry: z.string().trim().max(80).optional().or(z.literal('')),
  budgetBand: z.string().trim().max(40).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  /** Honeypot. Must stay empty. */
  website: z.string().max(0).optional().or(z.literal('')),
});
export type LeadClientInput = z.infer<typeof leadClientSchema>;

export const leadApiSchema = z.discriminatedUnion('kind', [
  leadClientSchema.extend({ kind: z.literal('plan'), context: z.record(z.string(), z.unknown()).optional() }),
  leadClientSchema.extend({ kind: z.literal('contact'), context: z.record(z.string(), z.unknown()).optional() }),
  z.object({
    kind: z.literal('newsletter'),
    email: z.string().trim().email().max(160),
    name: z.string().max(80).optional(),
    source: z.string().max(40).optional(),
    website: z.string().max(0).optional().or(z.literal('')),
  }),
]);
export type LeadApiInput = z.infer<typeof leadApiSchema>;
