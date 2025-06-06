import { createRoute } from '@tanstack/react-router';
import type { RootRoute } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';

import { TanStackQueryDemo } from './';

export const demoRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.DEMO,
    component: TanStackQueryDemo,
  });
