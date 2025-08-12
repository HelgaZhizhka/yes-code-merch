import { Outlet } from '@tanstack/react-router';
import { Suspense } from 'react';

import { Loader } from '@shared/ui/loader';

export const Profile = (): React.JSX.Element => {
  return (
    <Suspense fallback={<Loader />}>
      <div className="flex flex-1">
        <Outlet />
      </div>
    </Suspense>
  );
};
