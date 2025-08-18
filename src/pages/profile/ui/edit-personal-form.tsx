import { Button } from '@shared/ui/button';
import { Form } from '@shared/ui/form';
import { FormFieldWrapper } from '@shared/ui/form-field-wrapper';
import { Input } from '@shared/ui/input';
import { InputDatepicker } from '@shared/ui/input-datepicker';

import { useEditPersonalForm } from '../hooks';

export const EditPersonalForm = (): React.JSX.Element => {
  const { form, onSubmit, isPending } = useEditPersonalForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-4">
          <FormFieldWrapper control={form.control} name="email" label="Email*">
            {(field) => (
              <Input
                type="email"
                placeholder="Email"
                autoComplete="email"
                {...field}
              />
            )}
          </FormFieldWrapper>
          <FormFieldWrapper
            control={form.control}
            name="firstName"
            label="First Name*"
          >
            {(field) => (
              <Input
                type="text"
                placeholder="First Name"
                autoComplete="given-name"
                {...field}
              />
            )}
          </FormFieldWrapper>

          <FormFieldWrapper
            control={form.control}
            name="lastName"
            label="Last Name*"
          >
            {(field) => (
              <Input
                type="text"
                placeholder="Last Name"
                autoComplete="family-name"
                {...field}
              />
            )}
          </FormFieldWrapper>

          <FormFieldWrapper
            control={form.control}
            name="dateOfBirth"
            label="Date of Birth*"
          >
            {(field) => (
              <InputDatepicker
                placeholder="Date of Birth"
                name="dateOfBirth"
                value={field.value}
                onChange={(value) => field.onChange(value)}
              />
            )}
          </FormFieldWrapper>
          <FormFieldWrapper control={form.control} name="phone" label="Phone*">
            {(field) => <Input type="tel" placeholder="Phone" {...field} />}
          </FormFieldWrapper>
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
