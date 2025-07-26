import { z } from 'zod';

import { emailValidator, passwordValidator } from '@shared/lib/validators';

export const loginSchema = z.object({
  email: emailValidator,
  password: passwordValidator,
});

export type LoginFormType = z.infer<typeof loginSchema>;
