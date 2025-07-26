import type { Session, User } from '@supabase/supabase-js';
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

import {
  completeRegistration,
  getSession,
  login,
  logout,
  onAuthStateChange,
  resetPassword,
  signUp,
  updateUser,
  type CompleteRegistrationResult,
} from '@shared/api/auth';
import type { Viewer } from '@shared/api/auth/interfaces';
import type {
  AuthCredentials,
  ResetPasswordDTO,
  UpdateUserDTO,
} from '@shared/api/auth/types';
import { ROUTES } from '@shared/config/routes';
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

export const useLogin = (): UseMutationResult<
  Session,
  Error,
  AuthCredentials
> => {
  return useMutation<Session, Error, AuthCredentials>({
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

export const useRegistration = (): UseMutationResult<
  User,
  Error,
  AuthCredentials
> =>
  useMutation<User, Error, AuthCredentials>({
    mutationFn: signUp,
    onError: (error: unknown) => {
      if (error instanceof Error) {
        setError(error);
        console.error('Registration failed:', error.message);
      }
    },
  });

export const useResetPassword = (): UseMutationResult<
  object,
  Error,
  ResetPasswordDTO
> => {
  return useMutation<object, Error, ResetPasswordDTO>({
    mutationFn: resetPassword,
    onError: (error: unknown) => {
      if (error instanceof Error) {
        setError(error);
        console.error('Reset failed:', error.message);
      }
    },
  });
};

export const useUpdateUser = (): UseMutationResult<
  User,
  Error,
  UpdateUserDTO
> => {
  return useMutation<User, Error, UpdateUserDTO>({
    mutationFn: updateUser,
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('User update failed:', error.message);
      }
    },
  });
};

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

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { isLoading, isGuest } = useViewerState();

  useEffect(() => {
    if (isGuest) {
      navigate({ to: ROUTES.LOGIN });
    }
  }, [isGuest, navigate]);

  return { isLoading };
};
