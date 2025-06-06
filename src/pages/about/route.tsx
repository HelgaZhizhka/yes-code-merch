import { createRoute } from '@tanstack/react-router';
import type { RootRoute } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';

import { About } from './';

export const aboutRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.ABOUT,
    component: About,
  });
