import { z } from 'zod';

import { emailSchema, passwordSchema } from '@shared/schemas';

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormType = z.infer<typeof loginSchema>;
