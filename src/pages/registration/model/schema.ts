import type { z } from 'zod';

import { emailSchema, newPasswordSchema } from '@shared/lib/schemas';

export const registrationSchema = emailSchema
  .extend(newPasswordSchema.shape)
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegistrationFormType = z.infer<typeof registrationSchema>;
