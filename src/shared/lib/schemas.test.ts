/* sonarjs-disable typescript:S2068 */
import { describe, expect, it } from 'vitest';

import { MockCredentials } from '@shared/config/test-config';

import {
  addressSchema,
  emailSchema,
  newPasswordSchema,
  profileSchema,
} from './schemas';
import { ErrorMessages } from './validators';

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
      password: '12345',
      confirmPassword: '12345',
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
      confirmPassword: 'DifferentPass123!',
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

describe('addressSchema', () => {
  it('should pass with valid address data', () => {
    const validData = {
      country: 'ES',
      city: 'Madrid',
      streetName: 'Calle de la Moneda',
      streetNumber: '123',
      postalCode: '28001',
      isDefault: true,
    };
    const result = addressSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail if country is empty', () => {
    const invalidData = {
      country: '',
      city: 'Madrid',
      streetName: 'Calle de la Moneda',
      streetNumber: '123',
      postalCode: '28001',
      isDefault: false,
    };
    const result = addressSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const countryError = result.error.issues.find(
        (issue) => issue.path[0] === 'country'
      );
      expect(countryError?.message).toContain(ErrorMessages.countryRequired);
    }
  });

  it('should fail if city contains numbers', () => {
    const invalidData = {
      country: 'ES',
      city: 'Madrid1',
      streetName: 'Calle de la Moneda',
      streetNumber: '123',
      postalCode: '28001',
      isDefault: false,
    };
    const result = addressSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const cityError = result.error.issues.find(
        (issue) => issue.path[0] === 'city'
      );
      expect(cityError?.message).toContain(ErrorMessages.cityInvalid);
    }
  });

  it('should fail if streetNumber format is invalid', () => {
    const invalidData = {
      country: 'ES',
      city: 'Madrid',
      streetName: 'Calle de la Moneda',
      streetNumber: '12#',
      postalCode: '28001',
      isDefault: false,
    };
    const result = addressSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const streetNumberError = result.error.issues.find(
        (issue) => issue.path[0] === 'streetNumber'
      );
      expect(streetNumberError?.message).toContain(
        ErrorMessages.streetNumberInvalid
      );
    }
  });

  it('should fail if postalCode is invalid for country', () => {
    const invalidData = {
      country: 'ES',
      city: 'Madrid',
      streetName: 'Calle de la Moneda',
      streetNumber: '123',
      postalCode: 'ABCDE',
      isDefault: false,
    };
    const result = addressSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const postalCodeError = result.error.issues.find(
        (issue) => issue.path[0] === 'postalCode'
      );
      expect(postalCodeError?.code).toBe('invalid_format');
    }
  });
});

describe('profileSchema', () => {
  it('should pass with valid profile data', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      phone: '+1234567890',
      title: 'Mr',
      company: 'Company Inc',
    };
    const result = profileSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail if firstName contains numbers', () => {
    const invalidData = {
      firstName: 'John1',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      phone: '+1234567890',
    };
    const result = profileSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const firstNameError = result.error.issues.find(
        (issue) => issue.path[0] === 'firstName'
      );
      expect(firstNameError?.message).toContain(ErrorMessages.firstNameInvalid);
    }
  });

  it('should fail if user is under minimum age', () => {
    const today = new Date();
    const underageDate = today.toISOString().split('T')[0];
    const invalidData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: underageDate,
      phone: '+1234567890',
    };
    const result = profileSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const dobError = result.error.issues.find(
        (issue) => issue.path[0] === 'dateOfBirth'
      );
      expect(dobError?.message).toContain(ErrorMessages.dateOfBirthInvalid);
    }
  });

  it('should fail if phone format is invalid', () => {
    const invalidData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      phone: '123456',
    };
    const result = profileSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const phoneError = result.error.issues.find(
        (issue) => issue.path[0] === 'phone'
      );
      expect(phoneError?.message).toContain(ErrorMessages.phoneInvalid);
    }
  });
});
