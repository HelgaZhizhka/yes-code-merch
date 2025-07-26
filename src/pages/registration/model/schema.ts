import type { z } from 'zod';

import { newPasswordSchema } from '@shared/lib/schemas';
import { emailValidator } from '@shared/lib/validators';

export const registrationSchema = newPasswordSchema.extend({
  email: emailValidator,
});

export type RegistrationFormType = z.infer<typeof registrationSchema>;
