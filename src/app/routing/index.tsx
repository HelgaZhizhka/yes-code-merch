import { createRootRoute, createRouter } from '@tanstack/react-router';

import App from '@app/layout';

import { aboutRoute } from '@pages/about/route';
import { cartRoute } from '@pages/cart/route';
import { catalogRoute } from '@pages/catalog/route';
import { ErrorPage } from '@pages/error';
import { homeRoute } from '@pages/home/route.tsx';
import { loginRoute } from '@pages/login/route.tsx';
import { notFoundRoute } from '@pages/not-found/route';
import { productRoute } from '@pages/product/route';
import { profileRoute } from '@pages/profile/route.tsx';
import { registrationRoute } from '@pages/registration/route.tsx';

import { TanStackQueryProvider } from '@shared/api/tanstack-query';

const rootRoute = createRootRoute({
  component: App,
  errorComponent: ErrorPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute(rootRoute),
  loginRoute(rootRoute),
  profileRoute(rootRoute),
  registrationRoute(rootRoute),
  catalogRoute(rootRoute),
  productRoute(rootRoute),
  cartRoute(rootRoute),
  aboutRoute(rootRoute),
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
