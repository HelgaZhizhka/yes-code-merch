import { z } from 'zod';

import { emailValidator } from '@shared/lib/validators';

export const forgotPasswordSchema = z.object({
  email: emailValidator,
});

export type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>;
