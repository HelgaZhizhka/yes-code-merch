import { Link } from '@tanstack/react-router';

import { useLoginForm } from '@pages/login/hooks';

import { ROUTES } from '@shared/config/routes';
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
import { getLinkButtonClass } from '@shared/ui/link-button';
import { PasswordInput } from '@shared/ui/password-input';

export const LoginForm = (): React.JSX.Element => {
  const { form, onSubmit, isPending } = useLoginForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your email</FormLabel>
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
              <FormLabel>Your password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Button
            type="submit"
            className="w-full"
            disabled={isPending || !form.formState.isValid}
          >
            {isPending ? 'Logging in...' : 'Login'}
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            or
            <div className="flex-1 h-px bg-border" />
          </div>
          <Link
            to={ROUTES.REGISTRATION}
            className={
              getLinkButtonClass('outline', 'sm') + ' w-full justify-center'
            }
          >
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
};
