import type { Session, User } from '@supabase/supabase-js';
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

import {
  getSession,
  login,
  logout,
  signUp,
  updateUser,
  onAuthStateChange,
  changePassword,
  resetPassword,
  type AuthCredentials,
  type AuthProps,
  type ResetPasswordDTO,
  type ResetPasswordResponse,
  type UpdateUserDTO,
  type ChangePasswordDTO,
} from '@shared/api';
import { ROUTES } from '@shared/config/routes';
import type { AsyncVoidFunction } from '@shared/types';

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

export const useLogout = (): AsyncVoidFunction => {
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
  ResetPasswordResponse,
  Error,
  ResetPasswordDTO
> => {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordDTO>({
    mutationFn: resetPassword,
    onError: (error: unknown) => {
      if (error instanceof Error) {
        setError(error);
        console.error('Reset failed:', error.message);
      }
    },
  });
};

export const useChangePassword = (): UseMutationResult<
  User,
  Error,
  ChangePasswordDTO
> => {
  return useMutation<User, Error, ChangePasswordDTO>({
    mutationFn: changePassword,
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Password change failed:', error.message);
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
