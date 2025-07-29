import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { emailSchema, type EmailFormType } from '@shared/lib/schemas';
import { useResetPassword } from '@shared/viewer';

export const useForgotPasswordForm = () => {
  const { mutate: resetPassword, isPending } = useResetPassword();

  const form = useForm<EmailFormType>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: EmailFormType) => {
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
