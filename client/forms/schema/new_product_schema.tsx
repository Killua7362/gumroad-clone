import { z } from 'zod';

export const NewProductSchema = z.object({
  name: z.string().min(2).max(30),
  price: z.coerce.number().min(0),
  currency_code: z.string().default('USD'),
});
