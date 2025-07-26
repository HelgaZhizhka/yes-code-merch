import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { CountrySelect } from './country-select';

import { useCountries } from '../countries';

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

export const Default: Story = {};

export const AllCountries: Story = {
  render: () => {
    const countries = useCountries();
    return (
      <div className="space-y-2 w-[400px]">
        {countries.map((country) => (
          <div
            key={country.code}
            className="flex items-center gap-2 p-2 border rounded"
          >
            <CountrySelect
              value={country.code}
              onChange={fn()}
              placeholder={`Select ${country.name}`}
            />
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
