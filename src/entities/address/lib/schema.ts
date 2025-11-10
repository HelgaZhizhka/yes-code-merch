/* sonarjs-disable typescript:S2068 */
import PostalCodes from 'postal-codes-js';
import { z } from 'zod';

import { ErrorMessages, VALIDATION_REGEX } from '@shared/lib/validators';

import type { Address } from '../api/types';

export const addressSchema = z
  .object({
    country: z.string().trim().min(1, ErrorMessages.countryRequired),
    city: z
      .string()
      .trim()
      .min(1, ErrorMessages.cityRequired)
      .regex(VALIDATION_REGEX.namePattern, ErrorMessages.cityInvalid),
    streetName: z
      .string()
      .trim()
      .min(1, ErrorMessages.streetNameRequired)
      .regex(
        VALIDATION_REGEX.streetNamePattern,
        ErrorMessages.streetNameInvalid
      ),
    streetNumber: z
      .string()
      .trim()
      .min(1, ErrorMessages.streetNumberRequired)
      .regex(
        VALIDATION_REGEX.streetNumberPattern,
        ErrorMessages.streetNumberInvalid
      ),
    postalCode: z.string().trim().min(1, ErrorMessages.postalCodeRequired),
    isDefault: z.boolean().optional(),
  })
  .check((ctx) => {
    const { country, postalCode } = ctx.value;

    if (!country || !postalCode) return;

    const result = PostalCodes.validate(country, postalCode);

    if (result !== true) {
      ctx.issues.push({
        code: 'invalid_format',
        message: `${result}`,
        path: ['postalCode'],
        input: postalCode,
        format: 'postalCode',
      });
    }
  });

export const defaultAddress: Address = {
  country: '',
  city: '',
  streetName: '',
  streetNumber: '',
  postalCode: '',
  isDefault: false,
};

export type AddressFormType = z.infer<typeof addressSchema>;
