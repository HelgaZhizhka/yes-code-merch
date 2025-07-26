import { Button } from '@shared/ui/button';
import { Form } from '@shared/ui/form';
import { FormFieldWrapper } from '@shared/ui/form-field-wrapper';
import { PasswordField } from '@shared/ui/password-field';
import { PasswordInput } from '@shared/ui/password-input';

import { useResetPasswordForm } from '../hooks';

export const ResetPasswordForm = (): React.JSX.Element => {
  const { form, onSubmit, isPending } = useResetPasswordForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormFieldWrapper
          control={form.control}
          name="password"
          label="Password"
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
          label="Confirm Password"
        >
          {(field) => <PasswordInput {...field} />}
        </FormFieldWrapper>

        <Button
          type="submit"
          className="w-full"
          disabled={isPending || !form.formState.isValid}
        >
          {isPending ? 'Sending...' : 'Save Password'}
        </Button>
      </form>
    </Form>
  );
};
