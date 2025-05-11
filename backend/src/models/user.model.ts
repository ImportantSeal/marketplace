import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Must be a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  admin: z.boolean().optional(),
});

export type User = z.infer<typeof userSchema>;