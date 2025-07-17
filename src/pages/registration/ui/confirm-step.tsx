import { Button } from '@shared/ui/button';

import { useFormStep } from '../hooks';

export const ConfirmStep = (): React.JSX.Element => {
  const { handleBack, handleConfirm } = useFormStep();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleConfirm();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-4">
        <Button type="submit">Sign up</Button>
        <Button type="button" variant="outline" onClick={handleBack}>
          Back
        </Button>
      </div>
    </form>
  );
};
