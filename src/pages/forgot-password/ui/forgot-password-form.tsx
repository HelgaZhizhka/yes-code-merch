import { Button } from '@shared/ui/button';
import { Form } from '@shared/ui/form';
import { FormFieldWrapper } from '@shared/ui/form-field-wrapper';
import { Input } from '@shared/ui/input';

import { useForgotPasswordForm } from '../hooks';

export const ForgotPasswordForm = (): React.JSX.Element => {
  const { form, onSubmit, isPending } = useForgotPasswordForm();

  return (
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
        <Button
          type="submit"
          className="w-full"
          disabled={isPending || !form.formState.isValid}
        >
          {isPending ? 'Sending...' : 'Reset Password'}
        </Button>
      </form>
    </Form>
  );
};
