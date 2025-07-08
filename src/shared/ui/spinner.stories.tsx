import type { Meta, StoryObj } from '@storybook/react-vite';

import { Spinner } from './spinner';

const meta = {
  title: 'shared/ui/layout/spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
      description: 'Size of the spinner',
    },
    show: {
      control: 'boolean',
      description: 'Show or hide the spinner',
    },
    children: {
      control: 'text',
      description: 'Text content inside the spinner',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'medium',
    show: true,
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    show: true,
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    show: true,
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    show: true,
  },
};

export const Hidden: Story = {
  args: {
    size: 'medium',
    show: false,
  },
};

export const WithText: Story = {
  args: {
    size: 'medium',
    show: true,
    children: 'Loading...',
  },
  render: (args) => (
    <div className="flex flex-col items-center gap-2">
      <Spinner {...args} />
    </div>
  ),
};

export const CustomClassName: Story = {
  args: {
    size: 'medium',
    show: true,
    className: 'text-red-500',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center">
        <Spinner size="small" />
        <span className="mt-2 text-sm">Small</span>
      </div>
      <div className="flex flex-col items-center">
        <Spinner size="medium" />
        <span className="mt-2 text-sm">Medium</span>
      </div>
      <div className="flex flex-col items-center">
        <Spinner size="large" />
        <span className="mt-2 text-sm">Large</span>
      </div>
    </div>
  ),
};
