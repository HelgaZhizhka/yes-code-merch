import type { Control, FieldValues, Path } from 'react-hook-form';

import type { CustomerData } from '@shared/interfaces';
import { FormFieldWrapper } from '@shared/ui/form-field-wrapper';
import { Input } from '@shared/ui/input';
import { InputDatepicker } from '@shared/ui/input-datepicker';

interface PersonalFormFieldsProps<T extends FieldValues> {
  control: Control<T>;
  include?: Array<keyof CustomerData>;
}

export const PersonalFormFields = <T extends FieldValues>({
  control,
  include = [],
}: PersonalFormFieldsProps<T>): React.JSX.Element => {
  const fields = {
    email: (
      <FormFieldWrapper
        control={control}
        name={'email' as Path<T>}
        label="Email"
      >
        {(field) => (
          <Input
            type="email"
            autoComplete="email"
            placeholder="Email"
            {...field}
          />
        )}
      </FormFieldWrapper>
    ),
    firstName: (
      <FormFieldWrapper
        control={control}
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
    ),
    lastName: (
      <FormFieldWrapper
        control={control}
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
    ),
    dateOfBirth: (
      <FormFieldWrapper
        control={control}
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
    ),
    phone: (
      <FormFieldWrapper
        control={control}
        name={'phone' as Path<T>}
        label="Phone*"
      >
        {(field) => <Input type="tel" placeholder="Phone" {...field} />}
      </FormFieldWrapper>
    ),
    title: (
      <FormFieldWrapper
        control={control}
        name={'title' as Path<T>}
        label="Title"
      >
        {(field) => <Input type="text" placeholder="Title" {...field} />}
      </FormFieldWrapper>
    ),
    company: (
      <FormFieldWrapper
        control={control}
        name={'company' as Path<T>}
        label="Company"
      >
        {(field) => <Input type="text" placeholder="Company" {...field} />}
      </FormFieldWrapper>
    ),
  };
  return <>{include.map((fieldName) => fields[fieldName])}</>;
};
