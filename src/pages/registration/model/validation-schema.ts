/* sonarjs-disable typescript:S2068 */
import PostalCodes from 'postal-codes-js';
import { z } from 'zod';

export const MIN_AGE = 1;
export const MAX_AGE = 120;
export const TODAY = new Date();

export const PATTERNS = {
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

export const STRENGTH = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export type Strength = (typeof STRENGTH)[keyof typeof STRENGTH];

export const STRENGTH_MESSAGES: Record<Strength, string> = {
  [STRENGTH.LOW]:
    'Weak password: Add a mix of digits, lowercase and uppercase letters, and symbols',
  [STRENGTH.MEDIUM]:
    "Medium strength: Add what's missing (uppercase letters, symbols) for stronger protection",
  [STRENGTH.HIGH]: 'Strong password: Good job!',
};

export const getPasswordStrengthColor = (strength: Strength): string => {
  const strengthColors: Record<Strength | 'default', string> = {
    [STRENGTH.LOW]: 'bg-red-500',
    [STRENGTH.MEDIUM]: 'bg-yellow-500',
    [STRENGTH.HIGH]: 'bg-green-500',
    default: 'bg-gray-200',
  };

  return strengthColors[strength] ?? strengthColors.default;
};

export const getPasswordStrength = (password: string): Strength => {
  const hasDigits = PATTERNS.digits.test(password);
  const hasLowercase = PATTERNS.lowercase.test(password);
  const hasUppercase = PATTERNS.uppercase.test(password);
  const hasSymbols = PATTERNS.symbols.test(password);

  const charTypesCount = [
    hasDigits,
    hasLowercase,
    hasUppercase,
    hasSymbols,
  ].filter(Boolean).length;

  if (hasDigits && !hasLowercase && !hasUppercase && !hasSymbols) {
    return STRENGTH.LOW;
  } else if (hasDigits && (hasLowercase || hasUppercase) && !hasSymbols) {
    return STRENGTH.MEDIUM;
  } else if (hasDigits && hasLowercase && hasUppercase && hasSymbols) {
    return STRENGTH.HIGH;
  } else if (charTypesCount >= 3) {
    return STRENGTH.MEDIUM;
  } else {
    return STRENGTH.LOW;
  }
};

export const getPasswordFeedback = (
  password: string
): { strength: Strength; message: string } => {
  if (!password) {
    return {
      strength: STRENGTH.LOW,
      message:
        'Password must be at least 8 characters and include digits, lowercase and uppercase letters, and symbols',
    };
  }

  let strength = getPasswordStrength(password);

  const isTooShort = password.length < 8;

  if (isTooShort && strength === STRENGTH.HIGH) {
    strength = STRENGTH.MEDIUM;
  }

  let message = STRENGTH_MESSAGES[strength] ?? 'Unknown password strength';

  if (isTooShort) {
    message = `${message} (Password must be at least 8 characters)`;
  }

  return { strength, message };
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
