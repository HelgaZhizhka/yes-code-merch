import type { Meta, StoryObj } from '@storybook/react-vite';

import { newPasswordSchema } from '@shared/lib/schemas';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';

import { PasswordField } from './password-field';

import { FormValidation } from '.storybook/form-validation';

const meta = {
  title: 'shared/ui/form/password-field',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = () => (
  <FormValidation
    schema={newPasswordSchema}
    initialValues={{ password: '', confirmPassword: '' }}
  >
    {(methods) => (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>New Password Validation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PasswordField
            value={methods.watch('password')}
            onChange={(event) => {
              const value = event.target.value;
              methods.setValue('password', value, { shouldValidate: true });
            }}
          />
          {methods.formState.errors.password && (
            <p className="text-sm text-red-500">
              {methods.formState.errors.password.message}
            </p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              methods.reset({ password: '', confirmPassword: '' });
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

export const PasswordStrength: Story = {
  render: Template,
};
