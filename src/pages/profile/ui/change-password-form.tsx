import { type UseFormReturn } from 'react-hook-form';

import type { ChangePasswordFormType } from '@shared/lib/schemas';
import { Button } from '@shared/ui/button';
import { Form } from '@shared/ui/form';
import { FormFieldWrapper } from '@shared/ui/form-field-wrapper';
import { PasswordField } from '@shared/ui/password-field';
import { PasswordInput } from '@shared/ui/password-input';

export interface ChangePasswordFormProps {
  form: UseFormReturn<ChangePasswordFormType>;
  onSubmit: (values: ChangePasswordFormType) => void;
  isPending: boolean;
}

export const ChangePasswordForm = ({
  form,
  onSubmit,
  isPending,
}: ChangePasswordFormProps): React.JSX.Element => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormFieldWrapper
          control={form.control}
          name="currentPassword"
          label="Current Password"
        >
          {(field) => <PasswordInput {...field} />}
        </FormFieldWrapper>

        <FormFieldWrapper
          control={form.control}
          name="newPassword"
          label="New Password"
        >
          {(field) => (
            <PasswordField
              value={field.value ?? ''}
              onChange={field.onChange}
            />
          )}
        </FormFieldWrapper>

        <FormFieldWrapper
          control={form.control}
          name="confirmPassword"
          label="Confirm New Password"
        >
          {(field) => <PasswordInput {...field} />}
        </FormFieldWrapper>

        <Button
          type="submit"
          className="w-full"
          disabled={isPending || !form.formState.isValid}
        >
          {isPending ? 'Changing password...' : 'Change Password'}
        </Button>
      </form>
    </Form>
  );
};
