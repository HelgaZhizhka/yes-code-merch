import type { Meta, StoryObj } from '@storybook/react-vite';

import { profileSchema } from '@shared/lib/schemas';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';

import { InputDatepicker } from './input-datepicker';

import { FormValidation } from '.storybook/form-validation';

const meta = {
  title: 'shared/ui/form/input-datepicker',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const schema = profileSchema.pick({
  dateOfBirth: true,
});

const Template = () => (
  <FormValidation schema={schema} initialValues={{ dateOfBirth: '' }}>
    {(methods) => (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Date of Birth Validation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InputDatepicker
            value={methods.watch('dateOfBirth')}
            onChange={(value) => {
              methods.setValue('dateOfBirth', value, { shouldValidate: true });
            }}
          />
          {methods.formState.errors.dateOfBirth && (
            <p className="text-sm text-red-500">
              {methods.formState.errors.dateOfBirth.message}
            </p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              methods.reset({ dateOfBirth: '' });
            }}
            className="mt-2"
          >
            Reset
          </Button>
        </CardContent>
      </Card>
    )}
  </FormValidation>
);

export const DateOfBirth: Story = {
  render: Template,
};
