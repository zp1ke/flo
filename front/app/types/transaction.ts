import { z } from 'zod';

const descriptionMaxLength = 255;

export const transactionDescriptionIsValid = (description?: string) => {
  return !description || (description.length && description.length <= descriptionMaxLength);
};

export const transactionSchema = z.object({
  code: z.string().optional(),
  description: z.string().max(descriptionMaxLength).optional(),
  datetime: z.date(),
  amount: z.number(),
  categoryCode: z.string(),
  walletCode: z.string(),
});

export type Transaction = z.infer<typeof transactionSchema>;
