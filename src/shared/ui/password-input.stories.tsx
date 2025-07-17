import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { PasswordInput } from './password-input';

const meta = {
  title: 'shared/ui/form/password-input',
  component: PasswordInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onChange: fn(),
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Enter your password',
    onChange: fn(),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Password (disabled)',
    onChange: fn(),
  },
};

export const WithValue: Story = {
  args: {
    value: 'SecurePassword123!',
    onChange: fn(),
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Password with error',
    'aria-invalid': true,
    onChange: fn(),
  },
};
