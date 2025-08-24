import { Outlet } from '@tanstack/react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Loader } from '@shared/ui/loader';
import { useAuthRedirect } from '@shared/viewer';

import { ErrorFallback } from './error';

export const Profile = (): React.JSX.Element => {
  const { isLoading } = useAuthRedirect();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Loader />}>
        <div className="flex flex-1">
          <Outlet />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};
