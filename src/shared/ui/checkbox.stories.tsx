import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Checkbox } from './checkbox';

const meta = {
  title: 'shared/ui/form/checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Default checked state for uncontrolled component',
    },
    required: {
      control: 'boolean',
      description: 'Whether the checkbox is required',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    id: {
      control: 'text',
      description: 'ID for the checkbox element',
    },
  },
  args: {
    id: 'checkbox-example',
  },
  decorators: [
    (Story) => (
      <div className="p-4 flex items-center gap-2">
        {Story()}
        <label htmlFor="checkbox-example" className="text-sm font-medium">
          Label text
        </label>
      </div>
    ),
  ],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onCheckedChange: fn(),
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    onCheckedChange: fn(),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    onCheckedChange: fn(),
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
    onCheckedChange: fn(),
  },
};

export const WithError: Story = {
  args: {
    'aria-invalid': true,
    onCheckedChange: fn(),
  },
};
