import { Button } from '@shared/ui/button';
import { Form } from '@shared/ui/form';
import { FormFieldWrapper } from '@shared/ui/form-field-wrapper';
import { Input } from '@shared/ui/input';

import { useFormStep } from '../hooks';

export const InitStep = (): React.JSX.Element => {
  const { form, handleNextStep } = useFormStep();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleNextStep)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormFieldWrapper
            control={form.control}
            name="firstName"
            label="First Name"
          >
            {(field) => (
              <Input type="text" placeholder="First Name" {...field} />
            )}
          </FormFieldWrapper>

          <FormFieldWrapper
            control={form.control}
            name="lastName"
            label="Last Name"
          >
            {(field) => (
              <Input type="text" placeholder="Last Name" {...field} />
            )}
          </FormFieldWrapper>

          <FormFieldWrapper
            control={form.control}
            name="dateOfBirth"
            label="Date of Birth"
          >
            {(field) => (
              <Input type="date" placeholder="Date of Birth" {...field} />
            )}
          </FormFieldWrapper>

          <FormFieldWrapper control={form.control} name="phone" label="Phone">
            {(field) => <Input type="tel" placeholder="Phone" {...field} />}
          </FormFieldWrapper>

          <FormFieldWrapper control={form.control} name="title" label="Title">
            {(field) => <Input type="text" placeholder="Title" {...field} />}
          </FormFieldWrapper>

          <FormFieldWrapper
            control={form.control}
            name="company"
            label="Company"
          >
            {(field) => <Input type="text" placeholder="Company" {...field} />}
          </FormFieldWrapper>
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
