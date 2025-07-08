import { LoginForm } from '@pages/login/ui/login-form';

import Rectangle from '@shared/assets/Rectangle.png';

export const Login = (): React.JSX.Element => {
  return (
    <div className="relative flex flex-1 items-center justify-center flex-col">
      <div className="flex flex-col gap-6 max-w-lg p-8 w-full">
        <h2>Welcome back to YesCode!</h2>
        <LoginForm />
      </div>
      <img
        src={Rectangle}
        alt="Raccoon"
        className="absolute bottom-0 left-0 w-30"
      />
    </div>
  );
};
