import { RouterProvider } from '@tanstack/react-router';

import { TanStackQueryProvider } from '@shared/api/tanstack-query';
import { router } from '@shared/routing';
import { useInitSession } from '@shared/session/hooks';
import { useTheme } from '@shared/theme/hooks';

export const App = (): React.JSX.Element => {
  useInitSession();
  useTheme();

  return (
    <TanStackQueryProvider.Provider>
      <RouterProvider router={router} />
    </TanStackQueryProvider.Provider>
  );
};
