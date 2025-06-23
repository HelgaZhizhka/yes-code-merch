import { RouterProvider } from '@tanstack/react-router';

import { router } from '@app/routing';

import { useInitSession } from '@entities/session/hooks';

import { TanStackQueryProvider } from '@shared/api/tanstack-query';
import { ThemeProvider } from '@shared/ui/theme-provider';

export const App = (): React.JSX.Element => {
  useInitSession();

  return (
    <>
      <TanStackQueryProvider.Provider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </TanStackQueryProvider.Provider>
    </>
  );
};
