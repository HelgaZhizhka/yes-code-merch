import type { Session } from '@supabase/supabase-js';
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';
import { useCallback } from 'react';

import { login, logout, register } from '@shared/api/auth';
import type { LoginDTO, RegisterDTO } from '@shared/interfaces';
import {
  useIsAuthorized,
  useIsSessionLoaded,
  useSessionStore,
} from '@shared/session/model';

export const useAuth = () => {
  const isAuthorized = useIsAuthorized();
  const isLoaded = useIsSessionLoaded();
  const logout = useLogout();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [logout]);

  return { isAuthorized, isLoaded, handleLogout };
};

export const useLogin = (): UseMutationResult<Session, Error, LoginDTO> => {
  return useMutation<Session, Error, LoginDTO>({
    mutationFn: login,
    onSuccess: (session) => {
      useSessionStore.getState().setSession(session);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Login error:', error.message);
      }
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return async () => {
    await logout();
    useSessionStore.getState().setSession(null);
    queryClient.clear();
  };
};

export const useRegister = () =>
  useMutation<Session, Error, RegisterDTO>({
    mutationFn: register,
    onSuccess: (session) => {
      useSessionStore.getState().setSession(session);
    },
    onError: (error) => {
      console.error('Registration failed', error);
    },
  });
