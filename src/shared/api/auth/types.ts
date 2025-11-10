import type { AuthError } from '@supabase/supabase-js';

export type AuthCredentials = {
  email: string;
  password: string;
};

export interface AuthProps {
  isLoading: boolean;
  isGuest: boolean;
  isAuthenticated: boolean;
  isError: boolean;
  error?: Error | null;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export type ResetPasswordResponse =
  | {
      data: Record<string, never> | null;
      error: null;
    }
  | {
      data: null;
      error: AuthError;
    };

export type ResetPasswordDTO = { email: string };
export type UpdateUserDTO = Partial<Pick<AuthCredentials, 'password'>>;
