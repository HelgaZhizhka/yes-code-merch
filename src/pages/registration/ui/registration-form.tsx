import { Button } from '@shared/ui/button';
import { Form } from '@shared/ui/form';
import { FormFieldWrapper } from '@shared/ui/form-field-wrapper';
import { Input } from '@shared/ui/input';
import { PasswordField } from '@shared/ui/password-field';
import { PasswordInput } from '@shared/ui/password-input';

import { RedirectLink } from './redirect-link';

import { useRegistrationForm } from '../hooks';

export const RegistrationForm = (): React.JSX.Element => {
  const { form, onSubmit, isPending } = useRegistrationForm();
  return (
    <div className="flex flex-col gap-3 max-w-lg p-4 md:p-8 w-full">
      <h2 className="mb-6 text-center">Welcome to YesCode!</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormFieldWrapper control={form.control} name="email" label="Email">
            {(field) => (
              <Input
                type="email"
                autoComplete="email"
                placeholder="Email"
                {...field}
              />
            )}
          </FormFieldWrapper>

          <FormFieldWrapper
            control={form.control}
            name="password"
            label="Password"
          >
            {(field) => (
              <PasswordField
                value={field.value ?? ''}
                onChange={field.onChange}
                name={field.name}
                error={form.formState.errors.password?.message?.toString()}
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
            {isPending ? 'Signing up...' : 'Sign up'}
          </Button>
        </form>
      </Form>
      <RedirectLink />
    </div>
  );
};
