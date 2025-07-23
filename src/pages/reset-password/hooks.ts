import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  type ResetPasswordFormType,
  resetPasswordSchema,
} from '@pages/reset-password/model/validation-schema';

export const useResetPasswordForm = () => {
  const form = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  return {
    form,
  };
};
