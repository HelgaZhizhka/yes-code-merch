import { Link } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';
import { Button } from '@shared/ui/button';
import { Form } from '@shared/ui/form';
import { FormFieldWrapper } from '@shared/ui/form-field-wrapper';
import { getLinkButtonClass } from '@shared/ui/link-button';
import { PasswordField } from '@shared/ui/password-field';
import { PasswordInput } from '@shared/ui/password-input';

import { useChangePasswordForm } from '../hooks';

export const ChangePasswordForm = (): React.JSX.Element => {
  const { form, onSubmit, isPending } = useChangePasswordForm();

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
        <div className="flex gap-4">
          <Button
            type="submit"
            className="flex-1"
            disabled={isPending || !form.formState.isValid}
          >
            {isPending ? 'Sending...' : 'Change Password'}
          </Button>
          <Link
            to={ROUTES.PROFILE}
            className={getLinkButtonClass('outline', 'sm') + ' flex-1'}
          >
            Cancel
          </Link>
        </div>
      </form>
    </Form>
  );
};
