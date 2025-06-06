import { createRootRoute, createRouter } from '@tanstack/react-router';

import { demoRoute } from '@pages/demo/route.tsx';
import { homeRoute } from '@pages/home/route.tsx';
import { loginRoute } from '@pages/login/route.tsx';
import { profileRoute } from '@pages/profile/route.tsx';
import { registrationRoute } from '@pages/registration/route.tsx';

import { TanStackQueryProvider } from '@shared/api/tanstack-query';

import App from '@/app';
import { aboutRoute } from '@/pages/about/route';
import { cartRoute } from '@/pages/cart/route';
import { catalogRoute } from '@/pages/catalog/route';
import { notFoundRoute } from '@/pages/not-found/route';
import { productRoute } from '@/pages/product/route';

const rootRoute = createRootRoute({
  component: App,
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
  demoRoute(rootRoute),
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
