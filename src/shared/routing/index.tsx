import { createRootRoute, createRouter } from '@tanstack/react-router';

import { TanStackQueryProvider } from '@shared/api/tanstack-query';

import { Layout } from '@/layouts';
import { ErrorPage } from '@/pages/error';

import {
  aboutRoute,
  cartRoute,
  categoryRoute,
  homeRoute,
  loginRoute,
  notFoundRoute,
  productRoute,
  profileRoute,
  registrationRoute,
  subCategoryRoute,
} from './routes';

const rootRoute = createRootRoute({
  component: Layout,
  errorComponent: ErrorPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute(rootRoute),
  aboutRoute(rootRoute),
  loginRoute(rootRoute),
  registrationRoute(rootRoute),
  profileRoute(rootRoute),
  categoryRoute(rootRoute),
  subCategoryRoute(rootRoute),
  productRoute(rootRoute),
  cartRoute(rootRoute),
  notFoundRoute(rootRoute),
]);

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
