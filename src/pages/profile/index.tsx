import { Outlet } from '@tanstack/react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Loader } from '@shared/ui/loader';
import { useAuthRedirect } from '@shared/viewer';

import { ErrorFallback } from './error';

const ProfileSkeleton = (): React.JSX.Element => (
  <div className="w-full max-w-xl mx-auto p-6 space-y-6">
    <div className="space-y-3">
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="h-10 w-full animate-pulse rounded bg-muted" />
      <div className="h-10 w-full animate-pulse rounded bg-muted" />
      <div className="h-10 w-2/3 animate-pulse rounded bg-muted" />
    </div>
    <div className="space-y-3">
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="h-10 w-full animate-pulse rounded bg-muted" />
      <div className="h-10 w-full animate-pulse rounded bg-muted" />
    </div>
  </div>
);

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
      <Suspense fallback={<ProfileSkeleton />}>
        <div className="flex flex-1">
          <Outlet />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};
