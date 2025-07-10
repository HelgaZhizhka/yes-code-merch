import { Button } from '@shared/ui/button';

import { useFormStep } from '../hooks';

export const SecondStep = (): React.JSX.Element => {
  const { handleBack, handleNextStep } = useFormStep();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleNextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2>User Info form</h2>

      <div className="flex flex-col gap-4">
        <Button type="submit">Continue</Button>
        <Button type="button" variant="outline" onClick={handleBack}>
          Back
        </Button>
      </div>
    </form>
  );
};
