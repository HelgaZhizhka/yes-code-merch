import type { z } from 'zod';

import { emailSchema } from '@shared/lib/schemas';
import { passwordValidator } from '@shared/lib/validators';

export const loginSchema = emailSchema.extend({
  password: passwordValidator,
});

export type LoginFormType = z.infer<typeof loginSchema>;
