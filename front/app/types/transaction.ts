import { z } from 'zod';

const descriptionMaxLength = 255;

export const transactionDescriptionIsValid = (description?: string) => {
  return (
    !description ||
    (description.length && description.length <= descriptionMaxLength)
  );
};

export const transactionSchema = z.object({
  code: z.string().optional(),
  description: z.string().max(descriptionMaxLength).optional(),
  datetime: z.preprocess((val) => {
    if (typeof val === 'string') {
      return new Date(Date.parse(val));
    }
    if (typeof val === 'number') {
      return new Date(val);
    }
    return val;
  }, z.date()),
  amount: z.number(),
  categoryCode: z.string(),
  walletCode: z.string(),
  walletBalanceAfter: z.number().optional(),
});

export type Transaction = z.infer<typeof transactionSchema>;

export type MoneyStats = {
  income: number;
  outcome: number;
  balance: number;
};

export type GroupStats = MoneyStats & {
  code: string;
  name: string;
};

export type TransactionsStats = MoneyStats & {
  categories: GroupStats[];
  wallets: GroupStats[];
  transactions: Transaction[];
};
