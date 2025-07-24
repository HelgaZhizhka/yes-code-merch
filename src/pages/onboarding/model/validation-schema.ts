/* sonarjs-disable typescript:S2068 */
import PostalCodes from 'postal-codes-js';
import { z } from 'zod';

export const MIN_AGE = 1;
export const MAX_AGE = 120;
export const TODAY = new Date();

export const VALIDATION_REGEX = {
  namePattern: /^[a-zA-Z\s-]+$/,
  phonePattern: /^\+[1-9]\d{1,14}$/,
  streetNamePattern: /^[a-zA-Z\s\-.]+$/,
  streetNumberPattern: /^\d+[a-zA-Z]?$/,
};

export const addressSchema = z
  .object({
    country: z.string().trim().min(1, 'Country is required'),
    city: z
      .string()
      .trim()
      .min(1, 'City is required')
      .regex(
        VALIDATION_REGEX.namePattern,
        'City should not contain numbers or special characters'
      ),
    streetName: z
      .string()
      .trim()
      .min(1, 'Street name is required')
      .regex(
        VALIDATION_REGEX.streetNamePattern,
        'Street name should not contain numbers or special characters'
      ),
    streetNumber: z
      .string()
      .trim()
      .min(1, 'Street number is required')
      .regex(
        VALIDATION_REGEX.streetNumberPattern,
        'Street number should be in format XXX or XXXa'
      ),
    postalCode: z.string().trim().min(1, 'Postal code is required'),
    isDefault: z.boolean().optional(),
    useShippingAsBilling: z.boolean().optional(),
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

export const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .regex(
      VALIDATION_REGEX.namePattern,
      'First name should not contain numbers or special characters'
    ),

  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .regex(
      VALIDATION_REGEX.namePattern,
      'Last name should not contain numbers or special characters'
    ),

  dateOfBirth: z.string().refine((date) => {
    const birthDate = new Date(date);
    const age =
      TODAY.getFullYear() -
      birthDate.getFullYear() -
      (TODAY.getMonth() < birthDate.getMonth() ||
      (TODAY.getMonth() === birthDate.getMonth() &&
        TODAY.getDate() < birthDate.getDate())
        ? 1
        : 0);
    return age >= MIN_AGE;
  }, `You must be at least ${MIN_AGE} years old to register`),

  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      VALIDATION_REGEX.phonePattern,
      'Please enter valid international phone number in format +XXXXXXXXX'
    ),
  title: z.string().optional(),
  company: z.string().optional(),
});

export type ProfileFormType = z.infer<typeof profileSchema>;

export type AddressFormType = z.infer<typeof addressSchema>;
