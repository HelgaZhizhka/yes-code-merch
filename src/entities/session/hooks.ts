import type { Session } from '@supabase/supabase-js';
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';

import { createUser, login, logout } from '@entities/session/api';
import type {
  LoginDTO,
  RegistrationDTO,
  RegistrationResult,
} from '@entities/session/interfaces';
import { initSession } from '@entities/session/lib/init-session';
import {
  useIsAuthorized,
  useIsSessionLoaded,
} from '@entities/session/model/selectors';
import { useSessionStore } from '@entities/session/model/store';

export const useInitSession = () => {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    initSession().then((unsub) => {
      unsubscribe = unsub;
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);
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

export const useCreateUser = (): UseMutationResult<
  RegistrationResult,
  Error,
  RegistrationDTO
> => {
  return useMutation<RegistrationResult, Error, RegistrationDTO>({
    mutationFn: createUser,
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

export const useSessionAuth = () => {
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
