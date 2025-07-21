import { Button } from '@shared/ui/button';

import { useFormStep } from '../hooks';

export const NextStep = (): React.JSX.Element => {
  const { handleBack, handleNextStep } = useFormStep();

  return (
    <form onSubmit={handleNextStep} className="space-y-6">
      <div className="flex flex-col gap-4">
        <Button type="submit">Continue</Button>
        <Button type="button" variant="outline" onClick={handleBack}>
          Back
        </Button>
      </div>
    </form>
  );
};
