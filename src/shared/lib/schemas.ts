/* sonarjs-disable typescript:S2068 */
import PostalCodes from 'postal-codes-js';
import { z } from 'zod';

import {
  emailValidator,
  ErrorMessages,
  getPasswordStrength,
  MIN_AGE,
  passwordValidator,
  STRENGTH,
  TODAY,
  VALIDATION_REGEX,
} from './validators';

export const emailSchema = z.object({
  email: emailValidator,
});

export const newPasswordSchema = z
  .object({
    password: passwordValidator.refine(
      (password) => getPasswordStrength(password) !== STRENGTH.WEEK,
      {
        message: ErrorMessages.initialPassword,
      }
    ),
    confirmPassword: z.string().min(1, ErrorMessages.confirmPasswordRequired),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ErrorMessages.confirmPasswordMatch,
    path: ['confirmPassword'],
  });

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
  }, ErrorMessages.dateOfBirthInvalid),

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

export type EmailFormType = z.infer<typeof emailSchema>;

export type NewPasswordFormType = z.infer<typeof newPasswordSchema>;

export type ProfileFormType = z.infer<typeof profileSchema>;

export type PersonalFormType = z.infer<typeof personalSchema>;

export type AddressFormType = z.infer<typeof addressSchema>;
