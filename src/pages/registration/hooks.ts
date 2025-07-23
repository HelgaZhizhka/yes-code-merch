import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { ROUTES } from '@shared/config/routes';
import { useRegistration } from '@shared/viewer/hooks';

import {
  registrationSchema,
  type RegistrationFormType,
} from './model/validation-schema';

export const useRegistrationForm = () => {
  const navigate = useNavigate();
  const { mutate: signUp, isPending } = useRegistration();

  const form = useForm<RegistrationFormType>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: RegistrationFormType) => {
    signUp(data, {
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success('Registration successful');
        navigate({ to: ROUTES.REGISTRATION_SUCCESS });
      },
    });
  };

  return {
    form,
    onSubmit,
    isPending,
  };
};
