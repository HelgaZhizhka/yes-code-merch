import { RouterProvider } from '@tanstack/react-router';

import { router } from '@app/routing';

import {
  getContext as getQueryContext,
  TanStackQueryProvider,
} from '@shared/api/tanstack-query';
import { Loader } from '@shared/ui/loader';

import { useAppInit } from './hooks';

export const App = (): React.JSX.Element => {
  const { isAppReady, context } = useAppInit();
  const { queryClient } = getQueryContext();

  if (!isAppReady) {
    return <Loader />;
  }

  return (
    <TanStackQueryProvider.Provider>
      <RouterProvider router={router} context={{ ...context, queryClient }} />
    </TanStackQueryProvider.Provider>
  );
};
