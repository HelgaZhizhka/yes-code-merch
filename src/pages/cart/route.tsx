import { createRoute } from '@tanstack/react-router';
import type { RootRoute } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';

import { Cart } from './';

export const cartRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.CART,
    component: Cart,
  });
