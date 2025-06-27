import type { Session } from '@supabase/supabase-js';
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useCallback } from 'react';

import { ROUTES } from '@shared/config/routes';
import {
  useIsAuthorized,
  useIsSessionLoaded,
} from '@shared/viewer/model/selectors';
import { useSessionStore } from '@shared/viewer/model/store';

import { login, logout, registration } from './api';
import type {
  LoginDTO,
  RegistrationDTO,
  RegistrationResult,
} from './interfaces';

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

export const useRegistration = (): UseMutationResult<
  RegistrationResult,
  Error,
  RegistrationDTO
> => {
  return useMutation<RegistrationResult, Error, RegistrationDTO>({
    mutationFn: registration,
    onSuccess: (result) => {
      useSessionStore.getState().setSession(result.session ?? null);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Registration error:', error.message);
      }
    },
  });
};

export const useAuth = () => {
  const isAuthorized = useIsAuthorized();
  const isLoaded = useIsSessionLoaded();
  const logout = useLogout();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.navigate({ to: ROUTES.HOME });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [logout, router]);

  return { isAuthorized, isLoaded, handleLogout };
};
