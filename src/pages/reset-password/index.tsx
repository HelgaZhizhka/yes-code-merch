import { ResetPasswordForm } from '@pages/reset-password/ui/reset-password-form';

import { Loader } from '@shared/ui/loader';
import { useAuthRedirect } from '@shared/viewer';

export const ResetPassword = (): React.JSX.Element => {
  const { isLoading } = useAuthRedirect();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center flex-col">
      <div className="flex flex-col gap-3 max-w-lg p-8 w-full">
        <h2 className="mb-6 text-center">Enter a new password</h2>
        <ResetPasswordForm />
      </div>
    </div>
  );
};
