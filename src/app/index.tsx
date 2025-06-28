import { RouterProvider } from '@tanstack/react-router';

import { router } from '@app/routing';

import { useInitSession } from '@entities/session/hooks';

import { TanStackQueryProvider } from '@shared/api/tanstack-query';
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
