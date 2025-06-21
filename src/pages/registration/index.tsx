import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { ROUTES } from '@shared/config/routes';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { useRegistration } from '@shared/viewer/hooks';

export const Registration = (): React.JSX.Element => {
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

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Registering…' : 'Register'}
        </Button>
      </form>
    </>
  );
};
