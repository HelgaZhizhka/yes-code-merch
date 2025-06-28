import { useRegistrationForm } from '@features/auth/hooks';

import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';

export const Registration = (): React.JSX.Element => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    isPending,
    error,
  } = useRegistrationForm();

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
