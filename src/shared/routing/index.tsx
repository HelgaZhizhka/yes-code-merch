import { createRootRoute, createRouter } from '@tanstack/react-router';

import { ErrorPage } from '@pages/error';

import { TanStackQueryProvider } from '@shared/api/tanstack-query';

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
  profileAddAddressRoute,
  profileChangePasswordRoute,
  profileEditAddressRoute,
  profileEditPersonalRoute,
  profileLayoutRoute,
  profileOverviewRoute,
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
const profileLayout = profileLayoutRoute(layoutRoute);

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
    profileLayout.addChildren([
      profileOverviewRoute(profileLayout),
      profileEditPersonalRoute(profileLayout),
      profileChangePasswordRoute(profileLayout),
      profileAddAddressRoute(profileLayout),
      profileEditAddressRoute(profileLayout),
    ]),
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
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
