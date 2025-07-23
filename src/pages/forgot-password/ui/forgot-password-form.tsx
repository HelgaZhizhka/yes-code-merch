import { useForgotPasswordForm } from '@pages/forgot-password/hooks';

import { Button } from '@shared/ui/button';
import { Form } from '@shared/ui/form';
import { Input } from '@shared/ui/input';

import { FormFieldWrapper } from '@/shared/ui/form-field-wrapper';

export const ForgotPasswordForm = (): React.JSX.Element => {
  const { form } = useForgotPasswordForm();

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormFieldWrapper control={form.control} name="email" label="Email">
          {(field) => <Input type="email" placeholder="Email" {...field} />}
        </FormFieldWrapper>
        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid}
        >
          Reset Password
        </Button>
      </form>
    </Form>
  );
};
