import { z } from 'zod';

import { confirmPasswordSchema } from '@shared/schemas';
import { passwordSchema } from '@shared/ui/password-field/model/validation-schema';

export const resetPasswordSchema = z
  .object({
    confirmPassword: confirmPasswordSchema,
  })
  .extend(passwordSchema.shape)
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormType = z.infer<typeof resetPasswordSchema>;
