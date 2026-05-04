import type { Decorator } from '@storybook/react-vite';
import {
  RouterProvider,
  createRootRoute,
  createRouter,
} from '@tanstack/react-router';
import React from 'react';

import '../src/app/styles/index.css';
import { TanStackQueryProvider } from '../src/shared/api/tanstack-query';

export const withStyleDecorator: Decorator = (Story) => {
  return <Story />;
};

export const withQueryClient: Decorator = (Story) => {
  return (
    <TanStackQueryProvider.Provider>
      <Story />
    </TanStackQueryProvider.Provider>
  );
};

export const withRouter: Decorator = (Story) => {
  const rootRoute = createRootRoute({ component: Story });
  const router = createRouter({ routeTree: rootRoute });
  return <RouterProvider router={router} />;
};
