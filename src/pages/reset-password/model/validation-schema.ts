import { z } from 'zod';

import { passwordSchema } from '@shared/ui/password-field/model/validation-schema';

export const resetPasswordSchema = z
  .object({
    confirmPassword: z.string().trim().min(1, 'Confirm password is required'),
  })
  .extend(passwordSchema.shape)
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormType = z.infer<typeof resetPasswordSchema>;
