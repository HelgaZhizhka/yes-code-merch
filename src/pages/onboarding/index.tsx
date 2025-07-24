import { Link, Outlet } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';
import { Loader } from '@shared/ui/loader';
import { useAuthRedirect } from '@shared/viewer/hooks';

export const Onboarding = (): React.JSX.Element => {
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
        <h2 className="text-center">Welcome to Yes Code Merch!</h2>
        <p className="text-center">
          To enhance your shopping experience, we recommend completing your
          profile information now. This will make future checkouts faster and
          allow us to serve you better.
        </p>
        <Outlet />
        <div className="text-gray-600 text-center">
          <div className="mt-6">
            <Link to={ROUTES.HOME} className="text-primary hover:underline">
              Skip to Shopping
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            You can always update your information later in your{' '}
            <Link to={ROUTES.PROFILE} className="text-primary hover:underline">
              Account settings
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
