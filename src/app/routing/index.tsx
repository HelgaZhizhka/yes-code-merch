import { createRootRoute, createRouter } from '@tanstack/react-router';

import App from '@app/layout';

import { homeRoute } from '@pages/home/route.tsx';

import { TanStackQueryProvider } from '@shared/api/tanstack-query';

const rootRoute = createRootRoute({
  component: App,
});

const routeTree = rootRoute.addChildren([homeRoute(rootRoute)]);

export const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProvider.getContext(),
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
