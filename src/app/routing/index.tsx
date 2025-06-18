import { createRootRoute, createRouter } from '@tanstack/react-router';

import { ErrorPage } from '@pages/error';

import { TanStackQueryProvider } from '@shared/api/tanstack-query';

import { Layout } from '@/layouts';

const isDev = import.meta.env.DEV;

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
  uiReviewRoute,
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
  ...(isDev ? [uiReviewRoute(rootRoute)] : []),
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
