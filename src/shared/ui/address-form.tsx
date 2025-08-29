import React, { Suspense } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { Checkbox } from '@shared/ui/checkbox';
import { FormFieldWrapper } from '@shared/ui/form-field-wrapper';
import { Input } from '@shared/ui/input';
import { Spinner } from '@shared/ui/spinner';

import { CountryList } from '@/shared/ui/country-list';

export interface AddressFormProps {
  prefix?: string;
  label?: string;
  showDefaultCheckbox?: boolean;
}

export const AddressForm = ({
  prefix = '',
  label = '',
  showDefaultCheckbox = true,
}: AddressFormProps): React.JSX.Element => {
  const { control } = useFormContext();
  const country = useWatch({ control, name: `${prefix}.country` });

  return (
    <fieldset className="mb-6">
      <legend className="text-lg font-semibold mb-4">{label}</legend>
      <div className="grid gap-4">
        <FormFieldWrapper control={control} name={`${prefix}.country`}>
          {(field) => (
            <Suspense fallback={<Spinner size="small" />}>
              <CountryList
                name={field.name}
                value={field.value ?? ''}
                onChange={field.onChange}
                placeholder="Select a country..."
              />
            </Suspense>
          )}
        </FormFieldWrapper>
        <div className="grid gap-4 md:grid-cols-2 items-start">
          <FormFieldWrapper
            control={control}
            name={`${prefix}.city`}
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
            name={`${prefix}.streetName`}
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
            name={`${prefix}.streetNumber`}
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
            name={`${prefix}.postalCode`}
            label="Postal Code*"
          >
            {(field) => (
              <Input
                type="text"
                placeholder="Postal Code"
                autoComplete="postal-code"
                disabled={!country}
                {...field}
              />
            )}
          </FormFieldWrapper>
        </div>

        {showDefaultCheckbox && (
          <FormFieldWrapper
            control={control}
            name={`${prefix}.isDefault`}
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
        )}
      </div>
    </fieldset>
  );
};
