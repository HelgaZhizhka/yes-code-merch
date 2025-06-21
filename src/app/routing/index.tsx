import { createRootRoute, createRouter } from '@tanstack/react-router';

import { ErrorPage } from '@pages/error';

import { TanStackQueryProvider } from '@shared/api/tanstack-query';
import { Loader } from '@shared/ui/loader';

import { Layout } from '@/layouts';

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

const isDev = import.meta.env.DEV;
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
  defaultPendingComponent: Loader,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
