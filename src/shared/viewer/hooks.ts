import type { Session } from '@supabase/supabase-js';
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';
import { useEffect } from 'react';

import {
  getSession,
  login,
  logout,
  onAuthStateChange,
  register,
} from '@shared/api/auth';
import type { LoginDTO, RegisterDTO } from '@shared/api/auth/interfaces';
import type { AsyncAction } from '@shared/types';

import {
  clearSession,
  setError,
  setSession,
  startLoading,
  useError,
  useStatus,
  ViewerStatus,
} from './model';

export const useInitViewer = (): void => {
  useEffect(() => {
    startLoading();
    const getInitialSession = async () => {
      try {
        const session = await getSession();

        if (session) {
          setSession(session);
        } else {
          clearSession();
        }
      } catch (error) {
        console.error('Error loading session:', error);

        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('Unknown error loading session'));
        }
      }
    };
    getInitialSession();
    const subscription = onAuthStateChange((session) => {
      setSession(session);
    });
    return () => {
      subscription?.unsubscribe();
    };
  }, []);
};

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

export const useLogout = (): AsyncAction => {
  const queryClient = useQueryClient();

  return async () => {
    await logout();
    clearSession();
    queryClient.clear();
  };
};

export const useRegister = (): UseMutationResult<Session, Error, RegisterDTO> =>
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

export interface AuthProps {
  isLoading: boolean;
  isGuest: boolean;
  isAuthenticated: boolean;
  error?: Error | null;
}

export const useViewerState = (): AuthProps => {
  const status = useStatus();
  const error = useError();

  return {
    isLoading:
      status === ViewerStatus.LOADING || status === ViewerStatus.INITIAL,
    isGuest: status === ViewerStatus.GUEST,
    isAuthenticated: status === ViewerStatus.AUTHENTICATED,
    error,
  };
};
