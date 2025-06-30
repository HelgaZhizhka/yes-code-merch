import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import {
  useCreateUser,
  useLogin,
  useSessionAuth,
} from '@entities/session/hooks';

import { ROUTES } from '@shared/config/routes';

import { createCustomer } from '@/entities/customer/api';
import { data } from '@/entities/customer/api/data';

export const useAuth = () => {
  const navigate = useNavigate();
  const {
    isAuthorized,
    isLoaded,
    handleLogout: sessionHandleLogout,
  } = useSessionAuth();

  const handleLogout = async () => {
    await sessionHandleLogout();
    navigate({ to: ROUTES.HOME });
  };

  return { isAuthorized, isLoaded, handleLogout };
};

export function useLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isPending, error } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) return;

    login(
      { email, password },
      {
        onSuccess: () => {
          navigate({ to: ROUTES.HOME });
        },
      }
    );
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    isPending,
    error,
  };
}

export function useRegistrationForm() {
  const { mutate: createUser, isPending, error } = useCreateUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return;

    createUser(
      { email, password },
      {
        onSuccess: async () => {
          try {
            //TODO передать user_id из createUser в createCustomer
            await createCustomer(data);
            navigate({ to: ROUTES.HOME });
          } catch (error) {
            // Обработай ошибку создания customer (например, toast)
            console.error('Create customer error:', error);
          }
        },
      }
    );
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    isPending,
    error,
  };
}
