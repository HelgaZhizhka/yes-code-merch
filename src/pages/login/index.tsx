import { LoginForm } from '@pages/login/ui/login-form';

export const Login = (): React.JSX.Element => {
  return (
    <div className="flex">
      <div className="flex flex-col gap-6 max-w-md p-8">
        <h2>Welcome back to YesCode!</h2>
        <LoginForm />
      </div>
    </div>
  );
};
