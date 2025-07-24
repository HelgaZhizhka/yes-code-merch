import { z } from 'zod';

export const emailSchema = z.email({
  pattern: z.regexes.html5Email,
  message: 'Invalid email format',
});

export const passwordSchema = z
  .string()
  .trim()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters long');

export const confirmPasswordSchema = z
  .string()
  .trim()
  .min(1, 'Confirm password is required');
