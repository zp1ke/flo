import { z } from 'zod';

const nameMinLength = 3;
const nameMaxLength = 255;

export const categoryNameIsValid = (name: string) => {
  return name.length >= nameMinLength && name.length <= nameMaxLength;
};

export const categorySchema = z.object({
  code: z.string().optional(),
  name: z.string().min(nameMinLength).max(nameMaxLength),
});

export type Category = z.infer<typeof categorySchema>;
