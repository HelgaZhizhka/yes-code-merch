/* sonarjs-disable typescript:S2068 */
import { z } from 'zod';

import {
  emailValidator,
  ErrorMessages,
  isValidAge,
  VALIDATION_REGEX,
} from '@shared/lib/validators';

export const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, ErrorMessages.firstNameRequired)
    .regex(VALIDATION_REGEX.namePattern, ErrorMessages.firstNameInvalid),

  lastName: z
    .string()
    .trim()
    .min(1, ErrorMessages.lastNameRequired)
    .regex(VALIDATION_REGEX.namePattern, ErrorMessages.lastNameInvalid),

  dateOfBirth: z.string().refine(isValidAge, ErrorMessages.dateOfBirthInvalid),

  phone: z
    .string()
    .min(1, ErrorMessages.phoneRequired)
    .regex(VALIDATION_REGEX.phonePattern, ErrorMessages.phoneInvalid),
  title: z.string().optional(),
  company: z.string().optional(),
});

export const personalSchema = profileSchema.extend({
  email: emailValidator,
});

export type ProfileFormType = z.infer<typeof profileSchema>;

export type PersonalFormType = z.infer<typeof personalSchema>;
