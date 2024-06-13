import { z } from 'zod';

export const signInSchema = z.object({
  email: z.coerce.string().email().min(5),
  password: z.string().min(5).max(12),
  remember: z.boolean(),
});

export const signUpSchema = z
  .object({
    name: z.string().min(1).max(30),
    email: z.coerce.string().email().min(5),
    password: z.string().min(5).max(12),
    password_confirmation: z.string().min(5).max(12),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password don't match",
    path: ['password_confirmation'],
  });
