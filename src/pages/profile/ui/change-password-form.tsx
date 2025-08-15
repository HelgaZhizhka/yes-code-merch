import { PasswordForm } from '@shared/ui/password-form';

import { useChangePasswordForm } from '../hooks';

export const ChangePasswordForm = (): React.JSX.Element => {
  const { form, onSubmit, isPending } = useChangePasswordForm();

  return <PasswordForm form={form} onSubmit={onSubmit} isPending={isPending} />;
};
