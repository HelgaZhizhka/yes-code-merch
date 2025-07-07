import { createRootRoute, createRouter } from '@tanstack/react-router';

import { ErrorPage } from '@pages/error';

import { TanStackQueryProvider } from '@shared/api/tanstack-query';
import { Loader } from '@shared/ui/loader';

import {
  aboutRoute,
  cartRoute,
  categoryRoute,
  homeRoute,
  loginRoute,
  notFoundRoute,
  pathlessLayoutRoute,
  productRoute,
  profileRoute,
  registrationRoute,
  subCategoryRoute,
  uiReviewRoute,
} from './routes';

const isDev = import.meta.env.DEV;

const rootRoute = createRootRoute({
  errorComponent: ErrorPage,
});

const layoutRoute = pathlessLayoutRoute(rootRoute);

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    homeRoute(layoutRoute),
    aboutRoute(layoutRoute),
    loginRoute(layoutRoute),
    registrationRoute(layoutRoute),
    profileRoute(layoutRoute),
    categoryRoute(layoutRoute),
    subCategoryRoute(layoutRoute),
    productRoute(layoutRoute),
    cartRoute(layoutRoute),
  ]),
  ...(isDev ? [uiReviewRoute(rootRoute)] : []),
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
  defaultPendingComponent: Loader,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
