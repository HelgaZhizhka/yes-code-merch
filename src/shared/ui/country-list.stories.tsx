import type { Meta, StoryObj } from '@storybook/react-vite';
import { Suspense } from 'react';
import { fn } from 'storybook/test';

import { addressSchema } from '@shared/lib/schemas';
import { Spinner } from '@shared/ui/spinner';

import { CountryList } from './country-list';

import { FormValidation } from '.storybook/form-validation';

const meta = {
  title: 'shared/ui/form/country-list',
  component: CountryList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    value: '',
    name: 'country',
    placeholder: 'Select a country',
    disabled: false,
    onChange: fn(),
  },
} satisfies Meta<typeof CountryList>;

export default meta;
type Story = StoryObj<typeof meta>;

const schema = addressSchema.pick({
  country: true,
});

const CountrySelectList = () => {
  return (
    <FormValidation schema={schema} initialValues={{ country: '' }}>
      {(methods) => (
        <div className="space-y-2 w-[400px]">
          <Suspense fallback={<Spinner size="small" />}>
            <CountryList
              value={methods.watch('country')}
              onChange={(value) => {
                methods.setValue('country', value, { shouldValidate: true });
              }}
              placeholder="Select a country..."
            />
            <div className="text-sm">
              Selected: {methods.watch('country') || 'nothing selected'}
            </div>
            {methods.formState.errors.country && (
              <div className="text-sm text-destructive">
                {methods.formState.errors.country.message}
              </div>
            )}
          </Suspense>
        </div>
      )}
    </FormValidation>
  );
};

export const Default: Story = {
  render: () => <CountrySelectList />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'ES',
  },
};
