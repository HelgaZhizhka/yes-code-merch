import { describe, expect, it } from 'vitest';

import { MockCredentials } from '@shared/config/test-config';

import { emailSchema, newPasswordSchema } from './schemas';
import { ErrorMessages, isValidAge } from './validators';

describe('emailSchema', () => {
  it('should pass with a valid email', () => {
    const result = emailSchema.safeParse({ email: MockCredentials.email });
    expect(result.success).toBe(true);
  });

  it('should fail with an invalid email', () => {
    const result = emailSchema.safeParse({ email: 'invalid-email' });
    expect(result.success).toBe(false);

    if (!result.success) {
      const emailError = result.error.issues.find(
        (issue) => issue.path[0] === 'email'
      );

      expect(emailError?.message).toMatch(ErrorMessages.emailInvalid);
    }
  });
});

describe('newPasswordSchema', () => {
  it('should pass with a strong password and matching confirmPassword', () => {
    const validData = {
      password: MockCredentials.password,
      confirmPassword: MockCredentials.password,
    };
    const result = newPasswordSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail if password is too weak', () => {
    const invalidData = {
      password: '12345', //NOSONAR
      confirmPassword: '12345', //NOSONAR
    };

    const result = newPasswordSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const passwordError = result.error.issues.find(
        (issue) => issue.path[0] === 'password'
      );
      expect(
        passwordError?.message === ErrorMessages.initialPassword ||
          passwordError?.message === ErrorMessages.passwordInvalid
      ).toBe(true);
    }
  });

  it('should fail if confirmPassword is empty', () => {
    const invalidData = {
      password: MockCredentials.password,
      confirmPassword: '',
    };
    const result = newPasswordSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const confirmPasswordError = result.error.issues.find(
        (issue) => issue.path[0] === 'confirmPassword'
      );
      expect(confirmPasswordError?.message).toContain(
        ErrorMessages.confirmPasswordRequired
      );
    }
  });

  it("should fail if passwords don't match", () => {
    const invalidData = {
      password: MockCredentials.password,
      confirmPassword: 'DifferentPass123!', //NOSONAR
    };
    const result = newPasswordSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const confirmPasswordError = result.error.issues.find(
        (issue) => issue.path[0] === 'confirmPassword'
      );
      expect(confirmPasswordError?.message).toContain(
        ErrorMessages.confirmPasswordMatch
      );
    }
  });
});

describe('isValidAge', () => {
  it('should return true for valid age', () => {
    const validDate = new Date();
    validDate.setFullYear(validDate.getFullYear() - 20);
    expect(isValidAge(validDate.toISOString())).toBe(true);
  });

  it('should return false for age under MIN_AGE', () => {
    const invalidDate = new Date();
    invalidDate.setFullYear(invalidDate.getFullYear() - 10);
    expect(isValidAge(invalidDate.toISOString())).toBe(false);
  });
});
