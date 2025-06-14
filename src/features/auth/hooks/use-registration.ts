import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { useSessionStore } from '@/entities/session/model/store';

import { registration, type RegistrationResult } from '../lib/registration';
import type { RegistrationDTO } from '../model/registration-dto';

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
