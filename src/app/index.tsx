import { RouterProvider } from '@tanstack/react-router';

import { router } from '@app/routing';

import { useInitSession } from '@entities/session/hooks';

import { TanStackQueryProvider } from '@shared/api/tanstack-query';

export const App = (): React.JSX.Element => {
  useInitSession();

  return (
    <TanStackQueryProvider.Provider>
      <RouterProvider router={router} />
    </TanStackQueryProvider.Provider>
  );
};
