import { z } from 'zod';

const CategorySchema = z.object({
  name: z.string().min(1),
  hidden: z.boolean().default(true),
  url: z.string().min(1),
});

export const CheckoutFormSchema = z.object({
  name: z.string().min(1),
  bio: z.string().min(10),
  category: z.array(CategorySchema),
});
