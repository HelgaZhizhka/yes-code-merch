import { ForgotPasswordForm } from '@pages/forgot-password/ui/forgot-password-form';

export const ForgotPassword = (): React.JSX.Element => {
  return (
    <div className="flex flex-1 items-center justify-center flex-col">
      <div className="flex flex-col gap-3 max-w-lg p-8 w-full">
        <h2 className="mb-6 text-center">Forgot your password?</h2>
        <p className="mb-6 text-muted-foreground text-center">
          Enter your email and we will send you a link to reset your password
        </p>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};
