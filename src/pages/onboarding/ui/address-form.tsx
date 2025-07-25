import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Checkbox } from '@shared/ui/checkbox';
import { CountrySelect } from '@shared/ui/country-select';
import { FormFieldWrapper } from '@shared/ui/form-field-wrapper';
import { Input } from '@shared/ui/input';

interface AddressFormProps {
  prefix: string;
  label: string;
}

export const AddressForm = ({
  prefix,
  label,
}: AddressFormProps): React.JSX.Element => {
  const { control } = useFormContext();

  return (
    <fieldset className="mb-6">
      <legend className="text-lg font-semibold mb-4">{label}</legend>
      <div className="grid gap-4">
        <FormFieldWrapper control={control} name={`${prefix}.${0}.country`}>
          {(field) => (
            <CountrySelect
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
            />
          )}
        </FormFieldWrapper>
        <div className="grid gap-4 md:grid-cols-2 items-start">
          <FormFieldWrapper
            control={control}
            name={`${prefix}.${0}.city`}
            label="City*"
          >
            {(field) => (
              <Input
                type="text"
                placeholder="City"
                autoComplete="address-level2"
                {...field}
              />
            )}
          </FormFieldWrapper>

          <FormFieldWrapper
            control={control}
            name={`${prefix}.${0}.streetName`}
            label="Street Name*"
          >
            {(field) => (
              <Input
                type="text"
                placeholder="Street Name"
                autoComplete="address-line1"
                {...field}
              />
            )}
          </FormFieldWrapper>

          <FormFieldWrapper
            control={control}
            name={`${prefix}.${0}.streetNumber`}
            label="Street Number*"
          >
            {(field) => (
              <Input
                type="text"
                placeholder="Street Number"
                autoComplete="address-line2"
                {...field}
              />
            )}
          </FormFieldWrapper>

          <FormFieldWrapper
            control={control}
            name={`${prefix}.${0}.postalCode`}
            label="Postal Code*"
          >
            {(field) => (
              <Input
                type="text"
                placeholder="Postal Code"
                autoComplete="postal-code"
                {...field}
              />
            )}
          </FormFieldWrapper>
        </div>

        <FormFieldWrapper
          control={control}
          name={`${prefix}.${0}.isDefault`}
          label="Set as default"
          labelPosition="right"
        >
          {(field) => (
            <Checkbox
              checked={field.value ?? false}
              onCheckedChange={(checked) => field.onChange(checked)}
            />
          )}
        </FormFieldWrapper>
      </div>
    </fieldset>
  );
};
