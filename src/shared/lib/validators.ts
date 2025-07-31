/* sonarjs-disable typescript:S2068 */
import { z } from 'zod';

import type { Address } from '@shared/api/countries';

export const PATTERNS = {
  digits: /\d/,
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  symbols: /[!@#$%^&*(),.?":{}|<>]/,
};

export const STRENGTH = {
  WEEK: 'week',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const MIN_AGE = 13;
export const MAX_AGE = 120;
export const TODAY = new Date();
export const MIN_PASSWORD_LENGTH = 8;

export const VALIDATION_REGEX = {
  namePattern: /^[a-zA-Z\s-]+$/,
  phonePattern: /^\+[1-9]\d{1,14}$/,
  streetNamePattern: /^[a-zA-Z\s\-.]+$/,
  streetNumberPattern: /^\d+[a-zA-Z]?$/,
};

export const ErrorMessages = {
  emailInvalid: 'Invalid email format',
  passwordInvalid: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
  confirmPasswordMatch: 'Passwords do not match',
  passwordRequired: 'Password is required',
  confirmPasswordRequired: 'Confirm password is required',
  initialPassword:
    'Password must be at least 8 characters and include digits, lowercase and uppercase letters, and symbols',
  weekPassword:
    'Weak : Add a mix of digits, lowercase and uppercase letters, and symbols ',
  mediumPassword:
    "Medium: Add what's missing (uppercase letters, symbols) for stronger protection",
  strongPassword: 'Strong: Good job!',
  firstNameRequired: 'First name is required',
  lastNameRequired: 'Last name is required',
  dateOfBirthRequired: 'Date of birth is required',
  phoneRequired: 'Phone number is required',
  firstNameInvalid:
    'First name should not contain numbers or special characters',
  lastNameInvalid: 'Last name should not contain numbers or special characters',
  phoneInvalid:
    'Please enter valid international phone number in format +XXXXXXXXX',
  dateOfBirthInvalid: `You must be at least ${MIN_AGE} years old to register`,
  countryRequired: 'Country is required',
  cityRequired: 'City is required',
  streetNameRequired: 'Street name is required',
  streetNumberRequired: 'Street number is required',
  postalCodeRequired: 'Postal code is required',
  cityInvalid: 'City should not contain numbers or special characters',
  streetNameInvalid:
    'Street name should not contain numbers or special characters',
  streetNumberInvalid: 'Street number should be in format XXX or XXXa',
} as const;

export type Strength = (typeof STRENGTH)[keyof typeof STRENGTH];

export const STRENGTH_MESSAGES: Record<Strength, string> = {
  [STRENGTH.WEEK]: ErrorMessages.weekPassword,
  [STRENGTH.MEDIUM]: ErrorMessages.mediumPassword,
  [STRENGTH.HIGH]: ErrorMessages.strongPassword,
};

export const getPasswordStrengthColor = (strength: Strength): string => {
  const strengthColors: Record<Strength | 'default', string> = {
    [STRENGTH.WEEK]: 'bg-destructive',
    [STRENGTH.MEDIUM]: 'bg-accent-medium',
    [STRENGTH.HIGH]: 'bg-success',
    default: 'bg-muted',
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
    return STRENGTH.WEEK;
  } else if (hasDigits && (hasLowercase || hasUppercase) && !hasSymbols) {
    return STRENGTH.MEDIUM;
  } else if (hasDigits && hasLowercase && hasUppercase && hasSymbols) {
    return STRENGTH.HIGH;
  } else if (charTypesCount >= 3) {
    return STRENGTH.MEDIUM;
  } else {
    return STRENGTH.WEEK;
  }
};

export const getPasswordFeedback = (
  password: string
): { strength: Strength; message: string } => {
  if (!password) {
    return {
      strength: STRENGTH.WEEK,
      message: ErrorMessages.initialPassword,
    };
  }

  let strength = getPasswordStrength(password);

  const isTooShort = password.length < MIN_PASSWORD_LENGTH;

  if (isTooShort && strength === STRENGTH.HIGH) {
    strength = STRENGTH.MEDIUM;
  }

  const message = STRENGTH_MESSAGES[strength];

  return { strength, message };
};

export const emailValidator = z.email({
  pattern: z.regexes.html5Email,
  message: ErrorMessages.emailInvalid,
});

export const passwordValidator = z
  .string()
  .trim()
  .min(1, ErrorMessages.passwordRequired)
  .min(MIN_PASSWORD_LENGTH, ErrorMessages.passwordInvalid);

export const confirmPasswordValidator = z
  .string()
  .trim()
  .min(1, ErrorMessages.confirmPasswordRequired);

export const defaultAddress: Address = {
  country: '',
  city: '',
  streetName: '',
  streetNumber: '',
  postalCode: '',
  isDefault: false,
};
