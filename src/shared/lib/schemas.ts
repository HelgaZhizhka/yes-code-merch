/* sonarjs-disable typescript:S2068 */
import { z } from 'zod';

import {
  emailValidator,
  ErrorMessages,
  getPasswordStrength,
  passwordValidator,
  STRENGTH,
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

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, ErrorMessages.currentPasswordRequired),
    newPassword: passwordValidator.refine(
      (password) => getPasswordStrength(password) !== STRENGTH.WEEK,
      {
        message: ErrorMessages.initialPassword,
      }
    ),
    confirmPassword: z.string().min(1, ErrorMessages.confirmPasswordRequired),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: ErrorMessages.confirmPasswordMatch,
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: ErrorMessages.newPasswordMatch,
    path: ['newPassword'],
  });

export type EmailFormType = z.infer<typeof emailSchema>;

export type NewPasswordFormType = z.infer<typeof newPasswordSchema>;

export type ChangePasswordFormType = z.infer<typeof changePasswordSchema>;
