import {
  type FieldValues,
  type Path,
  type UseFormReturn,
} from 'react-hook-form';

import { Button } from '@shared/ui/button';
import { Form } from '@shared/ui/form';
import { FormFieldWrapper } from '@shared/ui/form-field-wrapper';
import { Input } from '@shared/ui/input';
import { InputDatepicker } from '@shared/ui/input-datepicker';

export interface PersonalFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  isPending?: boolean;
  submitLabel?: string;
}

export const PersonalForm = <T extends FieldValues>({
  form,
  onSubmit,
  isPending,
  submitLabel,
}: PersonalFormProps<T>): React.JSX.Element => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start">
          <FormFieldWrapper
            control={form.control}
            name={'firstName' as Path<T>}
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
            name={'lastName' as Path<T>}
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
            name={'dateOfBirth' as Path<T>}
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

          <FormFieldWrapper
            control={form.control}
            name={'phone' as Path<T>}
            label="Phone*"
          >
            {(field) => <Input type="tel" placeholder="Phone" {...field} />}
          </FormFieldWrapper>

          <FormFieldWrapper
            control={form.control}
            name={'title' as Path<T>}
            label="Title"
          >
            {(field) => <Input type="text" placeholder="Title" {...field} />}
          </FormFieldWrapper>

          <FormFieldWrapper
            control={form.control}
            name={'company' as Path<T>}
            label="Company"
          >
            {(field) => <Input type="text" placeholder="Company" {...field} />}
          </FormFieldWrapper>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isPending || !form.formState.isValid}
        >
          {isPending ? 'Sending...' : submitLabel}
        </Button>
      </form>
    </Form>
  );
};
