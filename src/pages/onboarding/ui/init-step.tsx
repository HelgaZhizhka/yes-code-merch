import { Button } from '@shared/ui/button';
import { Form } from '@shared/ui/form';
import { PersonalFormFields } from '@shared/ui/personal-form-fields';

import { useFormStep } from '../hooks';

export const InitStep = (): React.JSX.Element => {
  const { form, handleNextStep } = useFormStep();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleNextStep)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start">
          <PersonalFormFields
            control={form.control}
            include={[
              'firstName',
              'lastName',
              'dateOfBirth',
              'phone',
              'title',
              'company',
            ]}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid}
        >
          Continue
        </Button>
      </form>
    </Form>
  );
};
