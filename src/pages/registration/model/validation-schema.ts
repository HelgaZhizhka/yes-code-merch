import { z } from 'zod';

import { passwordSchema } from '@/shared/ui/password-field/model/validation-schema';

export const registrationSchema = z
  .object({
    email: z.email({
      pattern: z.regexes.html5Email,
      message: 'Invalid email format',
    }),
    confirmPassword: z.string().trim().min(1, 'Confirm password is required'),
  })
  .extend(passwordSchema.shape)
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegistrationFormType = z.infer<typeof registrationSchema>;
