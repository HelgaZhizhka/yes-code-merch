/* sonarjs-disable typescript:S2068 */
import { z } from 'zod';

import { ErrorMessages, isValidAge } from '../src/shared/lib/validators';

export const storybookSchemas = {
  country: z.object({
    country: z.string().min(1, ErrorMessages.countryRequired),
  }),

  dateOfBirth: z.object({
    dateOfBirth: z
      .string()
      .refine(isValidAge, ErrorMessages.dateOfBirthInvalid),
  }),
};

export type StorybookCountryForm = z.infer<typeof storybookSchemas.country>;
export type StorybookDateForm = z.infer<typeof storybookSchemas.dateOfBirth>;
