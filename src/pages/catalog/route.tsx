import { createRoute } from '@tanstack/react-router';
import type { RootRoute } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';

import { Catalog } from './';

export const catalogRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.CATEGORY,
    component: Catalog,
  });
