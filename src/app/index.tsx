import { RouterProvider } from '@tanstack/react-router';

import { TanStackQueryProvider } from '@shared/api/tanstack-query';
import { router } from '@shared/routing';
import { Loader } from '@shared/ui/loader';

import { useAppInit } from './hooks';

export const App = (): React.JSX.Element => {
  const { isAppReady, context } = useAppInit();

  if (!isAppReady) {
    return <Loader />;
  }

  return (
    <TanStackQueryProvider.Provider>
      <RouterProvider router={router} context={context} />
    </TanStackQueryProvider.Provider>
  );
};
