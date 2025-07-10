import { Button } from '@shared/ui/button';

import { RedirectLink } from './redirect-link';

import { useFormStep } from '../hooks';

export const FirstStep = (): React.JSX.Element => {
  const { handleNextStep } = useFormStep();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleNextStep();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-4">
          <h2>User Data form</h2>
          <Button type="submit">Continue</Button>
        </div>
      </form>
      <RedirectLink />
    </>
  );
};
