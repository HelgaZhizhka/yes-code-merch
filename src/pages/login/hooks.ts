import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  type LoginFormType,
  loginSchema,
} from '@pages/login/model/validation-schema';

import { ROUTES } from '@shared/config/routes';
import { useLogin } from '@shared/viewer/hooks';

export const useLoginForm = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: LoginFormType) => {
    login(data, {
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success('Login successful');
        navigate({ to: ROUTES.HOME });
      },
    });
  };

  return {
    form,
    onSubmit,
    isPending,
  };
};
