import { RouterProvider } from '@tanstack/react-router';

import { router } from '@app/routing';

import { TanStackQueryProvider } from '@shared/api/tanstack-query';

export const App = (): React.JSX.Element => (
  <>
    <TanStackQueryProvider.Provider>
      <RouterProvider router={router} />
    </TanStackQueryProvider.Provider>
  </>
);
