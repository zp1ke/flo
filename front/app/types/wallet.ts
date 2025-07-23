import { z } from 'zod';

const nameMinLength = 3;
const nameMaxLength = 255;

export const walletNameIsValid = (name: string): boolean => {
  return name.length >= nameMinLength && name.length <= nameMaxLength;
};

export const walletSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(nameMinLength).max(nameMaxLength),
  balance: z.number().default(0).optional(),
  balanceVisible: z.boolean().default(true).optional(),
});

export type Wallet = z.infer<typeof walletSchema>;
