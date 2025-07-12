import { z } from 'zod';

const nameMinLength = 3;
const nameMaxLength = 255;

export const profileNameIsValid = (name: string) => {
  return name.length >= nameMinLength && name.length <= nameMaxLength;
};

export const profileSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(nameMinLength).max(nameMaxLength),
  createdAt: z.iso.datetime({ offset: true }).optional(),
});

export type Profile = z.infer<typeof profileSchema>;
