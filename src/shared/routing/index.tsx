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
  registrationConfirmStepRoute,
  registrationFirstStepRoute,
  registrationLayoutRoute,
  registrationNextStepRoute,
  subCategoryRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
} from './routes';

const rootRoute = createRootRoute({
  errorComponent: ErrorPage,
});

const layoutRoute = pathlessLayoutRoute(rootRoute);
const registrationLayout = registrationLayoutRoute(layoutRoute);

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    homeRoute(layoutRoute),
    aboutRoute(layoutRoute),
    loginRoute(layoutRoute),
    forgotPasswordRoute(layoutRoute),
    resetPasswordRoute(layoutRoute),
    registrationLayout.addChildren([
      registrationFirstStepRoute(registrationLayout),
      registrationNextStepRoute(registrationLayout),
      registrationConfirmStepRoute(registrationLayout),
    ]),
    profileRoute(layoutRoute),
    categoryRoute(layoutRoute),
    subCategoryRoute(layoutRoute),
    productRoute(layoutRoute),
    cartRoute(layoutRoute),
  ]),
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
