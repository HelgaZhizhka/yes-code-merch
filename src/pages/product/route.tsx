import { createRoute } from '@tanstack/react-router';
import type { RootRoute } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';

import { Product } from './';

export const productRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.PRODUCT,
    component: Product,
  });
