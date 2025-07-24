import { Link, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

import { ROUTES } from '@shared/config/routes';
import { Loader } from '@shared/ui/loader';
import { useViewerState } from '@shared/viewer/hooks';

export const Onboarding = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { isLoading, isGuest } = useViewerState();

  useEffect(() => {
    if (isGuest) {
      navigate({ to: ROUTES.LOGIN });
    }
  }, [isGuest, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center flex-col">
      <div className="flex flex-col gap-3 max-w-lg p-4 md:p-8 w-full">
        <h2 className="text-center">Welcome to Yes Code Merch!</h2>
        <p className="text-center">
          To enhance your shopping experience, we recommend completing your
          profile information now. This will make future checkouts faster and
          allow us to serve you better.
        </p>
        <Outlet />
        <div className="text-center">
          <Link to={ROUTES.HOME} className="hover:underline">
            Skip to Shopping
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            You can always update your information later in your{' '}
            <Link to={ROUTES.PROFILE} className="hover:underline">
              Account settings
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
