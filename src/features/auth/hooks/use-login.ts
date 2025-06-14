import type { Session } from '@supabase/supabase-js';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { useSessionStore } from '@/entities/session/model/store';

import { login } from '../lib/login';
import type { LoginDTO } from '../model/login-dto';

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
