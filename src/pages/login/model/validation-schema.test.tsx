/* sonarjs-disable typescript:S2068 */
import { describe, expect, it } from 'vitest';

import { loginSchema } from '@pages/login/model/validation-schema';

import { MockCredentials } from '@shared/config/test-config';

describe('loginSchema', () => {
  it('passes with valid email and password', () => {
    const result = loginSchema.safeParse(MockCredentials);
    expect(result.success).toBe(true);
  });

  it('fails with empty fields', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.find(
        (issue) => issue.path[0] === 'email'
      );
      const passwordError = result.error.issues.find(
        (issue) => issue.path[0] === 'password'
      );

      expect(emailError?.message).toBe('Invalid email format');
      expect(passwordError?.message).toBe('Password is required');
    }
  });

  it('fails with invalid email', () => {
    const result = loginSchema.safeParse({
      email: MockCredentials.email[0],
      password: MockCredentials.password,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.find(
        (issue) => issue.path[0] === 'email'
      );
      expect(emailError?.message).toBe('Invalid email format');
    }
  });

  it('fails with short password', () => {
    const result = loginSchema.safeParse({
      email: MockCredentials.email,
      password: MockCredentials.password[0],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const passwordError = result.error.issues.find(
        (issue) => issue.path[0] === 'password'
      );
      expect(passwordError?.message).toBe(
        'Password must be at least 8 characters long'
      );
    }
  });
});
