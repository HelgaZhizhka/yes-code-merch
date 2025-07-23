import { createRootRoute, createRouter } from '@tanstack/react-router';

import { ErrorPage } from '@pages/error';

import { TanStackQueryProvider } from '@shared/api/tanstack-query';
import { Loader } from '@shared/ui/loader';

import {
  aboutRoute,
  cartRoute,
  categoryRoute,
  forgotPasswordRoute,
  homeRoute,
  loginRoute,
  notFoundRoute,
  onboardingAddressStepRoute,
  onboardingInitStepRoute,
  onboardingLayoutRoute,
  pathlessLayoutRoute,
  productRoute,
  profileRoute,
  registrationFormRoute,
  registrationLayoutRoute,
  registrationSuccessRoute,
  resetPasswordRoute,
  subCategoryRoute,
} from './routes';

const rootRoute = createRootRoute({
  errorComponent: ErrorPage,
});

const layoutRoute = pathlessLayoutRoute(rootRoute);
const registrationLayout = registrationLayoutRoute(layoutRoute);
const onboardingLayout = onboardingLayoutRoute(layoutRoute);

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    homeRoute(layoutRoute),
    aboutRoute(layoutRoute),
    loginRoute(layoutRoute),
    registrationLayout.addChildren([
      registrationFormRoute(registrationLayout),
      registrationSuccessRoute(registrationLayout),
    ]),
    forgotPasswordRoute(layoutRoute),
    resetPasswordRoute(layoutRoute),
    onboardingLayout.addChildren([
      onboardingInitStepRoute(onboardingLayout),
      onboardingAddressStepRoute(onboardingLayout),
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
