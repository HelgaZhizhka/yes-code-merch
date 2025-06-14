import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { useLogin } from '@features/auth/hooks/use-login';

import { ROUTES } from '@shared/model/constants';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';

export const Login = (): React.JSX.Element => {
  const { mutate: login, isPending, error } = useLogin();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  return (
    <div>
      <h1 className="text-2xl">Login Page</h1>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4 w-3/12">
        <Input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
        />
        <Input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
        />
        {error && <div className="text-red-500 mb-2">{error.message}</div>}
        <Button type="submit" disabled={isPending} variant="outline">
          {isPending ? 'Loading…' : 'Login'}
        </Button>
      </form>
    </div>
  );
};
