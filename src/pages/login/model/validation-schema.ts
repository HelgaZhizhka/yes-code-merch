import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one digit')
    .regex(/[\W_]/, 'Password must contain at least one special character')
    .refine((val) => val === val.trim(), {
      message: 'Password cannot start or end with a space',
    }),
});

export type LoginFormType = z.infer<typeof loginSchema>;
