import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.email({
    pattern: z.regexes.html5Email,
    message: 'Invalid email format',
  }),
});

export type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>;
