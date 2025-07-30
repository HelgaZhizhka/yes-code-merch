import type { Meta, StoryObj } from '@storybook/react-vite';
import { Suspense } from 'react';
import { fn } from 'storybook/test';

import { useCountries } from '@shared/countries';
import { Spinner } from '@shared/ui/spinner';

import { CountrySelect } from './country-select';

const meta = {
  title: 'shared/ui/form/country-select',
  component: CountrySelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'select',
      options: ['ES', 'FR', 'DE', 'IT'],
      description: 'Currently selected country code',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when selected country changes',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no country is selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the select when true',
    },
  },
  args: {
    value: 'ES',
    placeholder: 'Select a country',
    disabled: false,
    onChange: fn(),
  },
} satisfies Meta<typeof CountrySelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const CountrySelectList = () => {
  const countries = useCountries();

  return (
    <div className="space-y-2 w-[400px]">
      {countries.map((country) => (
        <div
          key={country.code}
          className="flex items-center gap-2 p-2 border rounded"
        >
          <Suspense fallback={<Spinner size="small" />}>
            <CountrySelect
              value={country.code}
              onChange={fn()}
              placeholder={`Select ${country.name}`}
            />
          </Suspense>
        </div>
      ))}
    </div>
  );
};

export const Default: Story = {
  render: () => <CountrySelectList />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
