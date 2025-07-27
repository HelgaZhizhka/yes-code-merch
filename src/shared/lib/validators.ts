/* sonarjs-disable typescript:S2068 */
import { z } from 'zod';

import type { Address } from '@shared/api/countries/interfaces';

export const PATTERNS = {
  digits: /\d/,
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  symbols: /[!@#$%^&*(),.?":{}|<>]/,
};

export const STRENGTH = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const MIN_AGE = 1;
export const MAX_AGE = 120;
export const TODAY = new Date();

export const VALIDATION_REGEX = {
  namePattern: /^[a-zA-Z\s-]+$/,
  phonePattern: /^\+[1-9]\d{1,14}$/,
  streetNamePattern: /^[a-zA-Z\s\-.]+$/,
  streetNumberPattern: /^\d+[a-zA-Z]?$/,
};

export type Strength = (typeof STRENGTH)[keyof typeof STRENGTH];

export const STRENGTH_MESSAGES: Record<Strength, string> = {
  [STRENGTH.LOW]:
    'Weak : Add a mix of digits, lowercase and uppercase letters, and symbols',
  [STRENGTH.MEDIUM]:
    "Medium: Add what's missing (uppercase letters, symbols) for stronger protection",
  [STRENGTH.HIGH]: 'Strong: Good job!',
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
    message = `${message}`;
  }

  return { strength, message };
};

export const emailValidator = z.email({
  pattern: z.regexes.html5Email,
  message: 'Invalid email format',
});

export const passwordValidator = z
  .string()
  .trim()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters long');

export const confirmPasswordValidator = z
  .string()
  .trim()
  .min(1, 'Confirm password is required');

export const defaultAddress: Address = {
  country: '',
  city: '',
  streetName: '',
  streetNumber: '',
  postalCode: '',
  isDefault: false,
};
