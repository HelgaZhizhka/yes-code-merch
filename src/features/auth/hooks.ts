import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import {
  useLogin,
  useRegistration,
  useSessionAuth,
} from '@entities/session/hooks';

import { ROUTES } from '@shared/config/routes';

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
  const { mutate: register, isPending, error } = useRegistration();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return;

    register(
      { email, password },
      {
        onSuccess: (result) => {
          if (result.session) {
            navigate({ to: ROUTES.HOME });
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
