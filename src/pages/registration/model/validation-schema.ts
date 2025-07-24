import { z } from 'zod';

import { confirmPasswordSchema, emailSchema } from '@shared/schemas';
import { passwordSchema } from '@shared/ui/password-field/model/validation-schema';

export const registrationSchema = z
  .object({
    email: emailSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .extend(passwordSchema.shape)
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegistrationFormType = z.infer<typeof registrationSchema>;
