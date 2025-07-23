import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  type ForgotPasswordFormType,
  forgotPasswordSchema,
} from '@pages/forgot-password/model/validation-schema';

export const useForgotPasswordForm = () => {
  const form = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  return {
    form,
  };
};
