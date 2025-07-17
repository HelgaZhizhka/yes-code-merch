import PostalCodes from 'postal-codes-js';
import { z } from 'zod';

import { COUNTRIES, MIN_AGE, TODAY } from '@shared/config';

export const PASSWORD_PATTERNS = {
  digits: /\d/,
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  symbols: /[!@#$%^&*(),.?":{}|<>]/,
};

export const VALIDATION_REGEX = {
  namePattern: /^[a-zA-Z\s-]+$/,
  phonePattern: /^\+[1-9]\d{1,14}$/,
  streetNamePattern: /^[a-zA-Z\s\-.]+$/,
  streetNumberPattern: /^\d+[a-zA-Z]?$/,
};

export type PasswordStrength = 'low' | 'medium' | 'high';

export const getPasswordStrength = (password: string): PasswordStrength => {
  const hasDigits = PASSWORD_PATTERNS.digits.test(password);
  const hasLowercase = PASSWORD_PATTERNS.lowercase.test(password);
  const hasUppercase = PASSWORD_PATTERNS.uppercase.test(password);
  const hasSymbols = PASSWORD_PATTERNS.symbols.test(password);

  const charTypesCount = [
    hasDigits,
    hasLowercase,
    hasUppercase,
    hasSymbols,
  ].filter(Boolean).length;

  if (hasDigits && !hasLowercase && !hasUppercase && !hasSymbols) {
    return 'low';
  } else if (hasDigits && (hasLowercase || hasUppercase) && !hasSymbols) {
    return 'medium';
  } else if (hasDigits && hasLowercase && hasUppercase && hasSymbols) {
    return 'high';
  } else if (charTypesCount >= 3) {
    return 'medium';
  } else {
    return 'low';
  }
};

export const getPasswordFeedback = (
  password: string
): { strength: PasswordStrength; message: string } => {
  if (!password) {
    return {
      strength: 'low',
      message:
        'Password must be at least 8 characters and include digits, lowercase and uppercase letters, and symbols',
    };
  }

  let strength = getPasswordStrength(password);

  const isTooShort = password.length < 8;

  if (isTooShort && strength === 'high') {
    strength = 'medium';
  }

  let message = '';
  switch (strength) {
    case 'low': {
      message =
        'Weak password: Add a mix of digits, lowercase and uppercase letters, and symbols';
      break;
    }
    case 'medium': {
      message =
        "Medium strength: Add what's missing (uppercase letters, symbols) for stronger protection";
      break;
    }
    case 'high': {
      message = 'Strong password: Good job!';
      break;
    }
  }

  if (isTooShort) {
    message = `${message} (Password must be at least 8 characters)`;
  }

  return { strength, message };
};

export const addressSchema = z
  .object({
    country: z
      .string()
      .trim()
      .min(1, 'Country is required')
      .refine((key) => COUNTRIES[key] !== undefined, {
        message: 'Please select a valid country',
      }),
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

export const registrationSchema = z.object({
  email: z.email({
    pattern: z.regexes.html5Email,
    message: 'Invalid email format',
  }),
  password: z
    .string()
    .trim()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .refine((password) => getPasswordStrength(password) !== 'low', {
      message:
        'Password is too weak. Include a mix of letters, numbers, and symbols.',
    }),

  confirmPassword: z.string().trim().min(1, 'Confirm password is required'),

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
  shippingAddresses: z.array(addressSchema).optional().default([]),
  useShippingAsBilling: z.boolean().optional().default(false),
  billingAddresses: z.array(addressSchema).optional().default([]),
  title: z.string().optional(),
  company: z.string().optional(),
});

export const initStepSchema = registrationSchema
  .pick({
    email: true,
    password: true,
    confirmPassword: true,
  })
  .refine(
    (data) => {
      const { password, confirmPassword } = data;
      return !password || !confirmPassword || password === confirmPassword;
    },
    {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }
  );

export type RegistrationFormType = z.infer<typeof registrationSchema>;
export type InitStepType = z.infer<typeof initStepSchema>;
