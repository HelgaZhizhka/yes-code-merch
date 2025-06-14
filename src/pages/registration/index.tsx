import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { useRegistration } from '@features/auth/hooks/use-registration';

import { ROUTES } from '@shared/model/constants';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';

export const Registration = (): React.JSX.Element => {
  const { mutate: register, isPending, error, data } = useRegistration();
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

  return (
    <>
      <h1 className="text-2xl">Registration Page</h1>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4 w-3/12">
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error.message}</p>}
        {data && !data.session && data.user && (
          <p className="text-green-600 text-sm">
            Check your email for confirmation link.
          </p>
        )}

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Registering…' : 'Register'}
        </Button>
      </form>
    </>
  );
};
