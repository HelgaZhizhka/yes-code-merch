import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Label } from './label';
import { RadioGroup, RadioGroupItem } from './radio-group';

const meta = {
  title: 'shared/ui/form/radio-group',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'The selected value of the radio group (controlled)',
    },
    defaultValue: {
      control: 'text',
      description: 'Default selected value for uncontrolled component',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether all radio items are disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the radio group is required',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    id: {
      control: 'text',
      description: 'ID for the radio group element',
    },
    'aria-invalid': {
      control: 'boolean',
      description: 'Whether the radio group is in an error state',
    },
  },
  args: {
    id: 'radio-group-example',
    defaultValue: 'option-1',
  },
  decorators: [
    (Story, context) => (
      <div className="p-4">
        <Label htmlFor={context.args.id} className="text-sm font-medium">
          Label text
        </Label>
        {Story()}
      </div>
    ),
  ],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

type RenderOptionsArgs = {
  id?: string;
  disabled?: boolean;
};

function renderOptions(args: RenderOptionsArgs) {
  const disabled = !!args.disabled;
  const id = args.id ?? 'radio-group-example';
  return (
    <>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-1" id={`${id}-1`} disabled={disabled} />
        <Label htmlFor={`${id}-1`} className="text-sm">
          Option 1
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-2" id={`${id}-2`} disabled={disabled} />
        <Label htmlFor={`${id}-2`} className="text-sm">
          Option 2
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-3" id={`${id}-3`} disabled={disabled} />
        <Label htmlFor={`${id}-3`} className="text-sm">
          Option 3
        </Label>
      </div>
    </>
  );
}

export const Default: Story = {
  args: {
    onValueChange: fn(),
  },
  render: (args) => <RadioGroup {...args}>{renderOptions(args)}</RadioGroup>,
};

export const Checked: Story = {
  args: {
    value: 'option-2',
    onValueChange: fn(),
  },
  render: (args) => <RadioGroup {...args}>{renderOptions(args)}</RadioGroup>,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    onValueChange: fn(),
  },
  render: (args) => <RadioGroup {...args}>{renderOptions(args)}</RadioGroup>,
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    value: 'option-3',
    onValueChange: fn(),
  },
  render: (args) => <RadioGroup {...args}>{renderOptions(args)}</RadioGroup>,
};
