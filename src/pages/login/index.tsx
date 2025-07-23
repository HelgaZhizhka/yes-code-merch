import { Link } from '@tanstack/react-router';

import { LoginForm } from '@pages/login/ui/login-form';

import Rectangle from '@shared/assets/Rectangle.png';
import { ROUTES } from '@shared/config/routes';
import { getLinkButtonClass } from '@shared/ui/link-button';

export const Login = (): React.JSX.Element => (
  <div className="relative flex flex-1 items-center justify-center flex-col">
    <div className="flex flex-col gap-3 max-w-lg p-8 w-full">
      <h2 className="mb-6 text-center">Welcome back to YesCode!</h2>
      <LoginForm />
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        or
        <div className="flex-1 h-px bg-border" />
      </div>
      <Link
        to={ROUTES.REGISTRATION}
        className={getLinkButtonClass('outline', 'sm')}
      >
        Sign up
      </Link>
      <div className="mt-6">
        <p className="text-sm text-muted-foreground text-center">
          Forgot your password?{' '}
          <Link className="text-primary hover:underline" to={ROUTES.FORGOT}>
            Reset here
          </Link>
        </p>
      </div>
    </div>
    <img
      src={Rectangle}
      alt="Raccoon"
      className="absolute bottom-0 left-0 w-30"
    />
  </div>
);
