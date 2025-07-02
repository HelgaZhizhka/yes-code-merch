import type { Session } from '@supabase/supabase-js';
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';

import { login, logout, register } from '@shared/api/auth';
import type { LoginDTO, RegisterDTO } from '@shared/api/auth/interfaces';
import { clearSession, setSession } from '@shared/session/model';

export const useLogin = (): UseMutationResult<Session, Error, LoginDTO> => {
  return useMutation<Session, Error, LoginDTO>({
    mutationFn: login,
    onSuccess: (session) => {
      setSession(session);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Login failed:', error.message);
      }
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return async () => {
    await logout();
    clearSession();
    queryClient.clear();
  };
};

export const useRegister = () =>
  useMutation<Session, Error, RegisterDTO>({
    mutationFn: register,
    onSuccess: (session) => {
      setSession(session);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Registration failed:', error.message);
      }
    },
  });
