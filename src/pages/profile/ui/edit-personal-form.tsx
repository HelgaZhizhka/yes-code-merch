import { PersonalForm } from '@/shared/ui/personal-form';

import { useEditPersonalForm } from '../hooks';

export const EditPersonalForm = (): React.JSX.Element => {
  const { form, onSubmit, isPending } = useEditPersonalForm();

  return (
    <PersonalForm
      form={form}
      onSubmit={onSubmit}
      isPending={isPending}
      submitLabel="Save"
    />
  );
};
