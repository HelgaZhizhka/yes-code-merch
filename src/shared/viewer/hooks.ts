import type { Session, User } from '@supabase/supabase-js';
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';
import { useEffect } from 'react';

import {
  completeRegistration,
  getSession,
  login,
  logout,
  onAuthStateChange,
  signUp,
  type CompleteRegistrationResult,
} from '@shared/api/auth';
import type { LoginDTO, SignUpDTO, Viewer } from '@shared/api/auth/interfaces';
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
        setError(error);
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

export const useRegistration = (): UseMutationResult<User, Error, SignUpDTO> =>
  useMutation<User, Error, SignUpDTO>({
    mutationFn: signUp,
    onError: (error: unknown) => {
      if (error instanceof Error) {
        setError(error);
        console.error('Registration failed:', error.message);
      }
    },
  });

export const useCompleteRegistration = (): UseMutationResult<
  CompleteRegistrationResult,
  Error,
  Viewer
> =>
  useMutation<CompleteRegistrationResult, Error, Viewer>({
    mutationFn: completeRegistration,
    onError: (error: unknown) => {
      if (error instanceof Error) {
        setError(error);
        console.error('Registration failed:', error.message);
      }
    },
  });

export interface AuthProps {
  isLoading: boolean;
  isGuest: boolean;
  isAuthenticated: boolean;
  isError: boolean;
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
    isError: status === ViewerStatus.ERROR,
    error,
  };
};
