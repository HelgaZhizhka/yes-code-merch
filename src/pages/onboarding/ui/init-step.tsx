import { PersonalForm } from '@/shared/ui/personal-form';

import { useFormStep } from '../hooks';

export const InitStep = (): React.JSX.Element => {
  const { form, handleNextStep } = useFormStep();

  return (
    <PersonalForm
      form={form}
      onSubmit={handleNextStep}
      submitLabel="Continue"
    />
  );
};
