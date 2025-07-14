import { describe, it, expect } from 'vitest';

import { loginSchema } from '@pages/login/model/validation-schema';

import { MockCredentials } from '@shared/config';

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
      expect(result.error.format().email?._errors[0]).toBe('Email is required');
      expect(result.error.format().password?._errors[0]).toBe(
        'Password is required'
      );
    }
  });

  it('fails with invalid email', () => {
    const result = loginSchema.safeParse({
      email: MockCredentials.email[0],
      password: MockCredentials.password,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format().email?._errors).toContain(
        'Invalid email format'
      );
    }
  });

  it('fails with short password', () => {
    const result = loginSchema.safeParse({
      email: MockCredentials.email,
      password: MockCredentials.password[0],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format().password?._errors[0]).toBe(
        'Password must be at least 8 characters long'
      );
    }
  });
});
