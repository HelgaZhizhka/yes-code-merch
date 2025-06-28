import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { useLogin } from '@entities/session/hooks';

import { ROUTES } from '@shared/config/routes';

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
