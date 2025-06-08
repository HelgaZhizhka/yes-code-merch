import { createRootRoute, createRouter } from '@tanstack/react-router';

import { TanStackQueryProvider } from '@shared/api/tanstack-query';

import { Layout } from '@/layouts';

import { homeRoute } from './routes';

const rootRoute = createRootRoute({
  component: Layout,
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
