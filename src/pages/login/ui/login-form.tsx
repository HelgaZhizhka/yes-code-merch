import { useLoginForm } from '@pages/login/hooks';

import { Button } from '@shared/ui/button';
import { Form } from '@shared/ui/form';
import { FormFieldWrapper } from '@shared/ui/form-field-wrapper';
import { Input } from '@shared/ui/input';
import { PasswordInput } from '@shared/ui/password-input';

export const LoginForm = (): React.JSX.Element => {
  const { form, onSubmit, isPending } = useLoginForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormFieldWrapper control={form.control} name="email" label="Email">
          {(field) => (
            <Input
              type="email"
              placeholder="Email"
              autoComplete="email"
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
            <PasswordInput autoComplete="current-password" {...field} />
          )}
        </FormFieldWrapper>
        <Button
          type="submit"
          className="w-full"
          disabled={isPending || !form.formState.isValid}
        >
          {isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </Form>
  );
};
