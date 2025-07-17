import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({
    pattern: z.regexes.html5Email,
    message: 'Invalid email format',
  }),
  password: z
    .string()
    .trim()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long'),
});

export type LoginFormType = z.infer<typeof loginSchema>;
