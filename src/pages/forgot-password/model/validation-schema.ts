import { z } from 'zod';

import { emailSchema } from '@shared/lib/schemas';

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>;
