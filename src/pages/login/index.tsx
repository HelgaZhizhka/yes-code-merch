import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';

import { useLoginForm } from './hooks';

export const Login = (): React.JSX.Element => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    isPending,
    error,
  } = useLoginForm();

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
