import { PasswordForm } from '@shared/ui/password-form';

import { useResetPasswordForm } from '../hooks';

export const ResetPasswordForm = (): React.JSX.Element => {
  const { form, onSubmit, isPending } = useResetPasswordForm();

  return <PasswordForm form={form} onSubmit={onSubmit} isPending={isPending} />;
};
