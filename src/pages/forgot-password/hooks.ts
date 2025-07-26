import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useResetPassword } from '@shared/viewer';

import {
  type ForgotPasswordFormType,
  forgotPasswordSchema,
} from './model/schema';

export const useForgotPasswordForm = () => {
  const { mutate: resetPassword, isPending } = useResetPassword();

  const form = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: ForgotPasswordFormType) => {
    resetPassword(data, {
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success('Check your email to reset your password');
      },
    });
  };

  return {
    form,
    onSubmit,
    isPending,
  };
};
