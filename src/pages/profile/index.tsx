import { Outlet } from '@tanstack/react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Loader } from '@shared/ui/loader';

import { ErrorFallback } from './error';

export const Profile = (): React.JSX.Element => {
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
