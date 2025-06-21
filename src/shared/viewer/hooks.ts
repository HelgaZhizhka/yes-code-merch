import type { Session } from '@supabase/supabase-js';
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';

import { supabase } from '@shared/api/supabase-client';
import { useSessionStore } from '@shared/viewer/model/store';

import type {
  LoginDTO,
  RegistrationDTO,
  RegistrationResult,
} from './model/interfaces';

import { login, registration } from '.';

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
    await supabase.auth.signOut();
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
