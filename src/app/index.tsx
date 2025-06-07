import { RouterProvider } from '@tanstack/react-router';

import { TanStackQueryProvider } from '@shared/api/tanstack-query';
import { router } from '@shared/routing';

export const App = (): React.JSX.Element => (
  <>
    <TanStackQueryProvider.Provider>
      <RouterProvider router={router} />
    </TanStackQueryProvider.Provider>
  </>
);
