import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Input } from './input';

const meta = {
  title: 'shared/ui/forms/input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'Type of the input field',
    },
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
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    onChange: fn(),
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'example@email.com',
    onChange: fn(),
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: '0',
    onChange: fn(),
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
    onChange: fn(),
  },
};

export const WithValue: Story = {
  args: {
    value: 'This is a filled input',
    onChange: fn(),
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Input with error',
    'aria-invalid': true,
    onChange: fn(),
  },
};
