import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { ROUTES } from '@shared/config/routes';
import {
  newPasswordSchema,
  type NewPasswordFormType,
} from '@shared/lib/schemas';
import { useUpdateUser } from '@shared/viewer';

export const useResetPasswordForm = () => {
  const { mutate: updateUser, isPending } = useUpdateUser();
  const navigate = useNavigate();
  const form = useForm<NewPasswordFormType>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: NewPasswordFormType) => {
    updateUser(
      { password: data.password },
      {
        onSuccess: () => {
          toast.success('Password has been reset successfully');
          navigate({ to: ROUTES.HOME });
        },
        onError: (error) => toast.error(error.message),
      }
    );
  };

  return { form, onSubmit, isPending };
};
