import { Button } from '@shared/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/ui/form';
import { Input } from '@shared/ui/input';
import { PasswordField } from '@shared/ui/password-field';
import { PasswordInput } from '@shared/ui/password-input';

import { RedirectLink } from './redirect-link';

import { useRegistrationForm } from '../hooks';

export const RegistrationForm = (): React.JSX.Element => {
  const { form, onSubmit } = useRegistrationForm();
  return (
    <div className="flex flex-col gap-3 max-w-lg p-8 w-full">
      <h2 className="mb-6 text-center">Welcome to YesCode!</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordField
                      value={field.value ?? ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={!form.formState.isValid}
            >
              Continue
            </Button>
          </div>
        </form>
      </Form>
      <RedirectLink />
    </div>
  );
};
