import { Button } from '@shared/ui/button';
import { Form } from '@shared/ui/form';

import { PersonalFormFields } from '@/shared/ui/personal-form-fields';

import { useEditPersonalForm } from '../hooks';

export const EditPersonalForm = (): React.JSX.Element => {
  const { form, onSubmit, isPending } = useEditPersonalForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-4">
          <PersonalFormFields
            control={form.control}
            include={['email', 'firstName', 'lastName', 'dateOfBirth', 'phone']}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isPending || !form.formState.isValid}
        >
          {isPending ? 'Sending...' : 'Save'}
        </Button>
      </form>
    </Form>
  );
};
