import { Button } from '@shared/ui/button';

import { useRegistrationForm } from './hooks';

export const Registration = (): React.JSX.Element => {
  const { handleSubmit, isPending, error } = useRegistrationForm();

  return (
    <>
      <h1 className="text-2xl">Registration Page</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4 w-3/12">
        {error && <p className="text-red-500 text-sm">{error.message}</p>}

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Registering…' : 'Register test user'}
        </Button>
      </form>
    </>
  );
};
