import type { RootRoute } from '@tanstack/react-router';
import { createRoute } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';
import { requireGuest } from '@shared/lib/auth';

import { Login } from './';

export const loginRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.LOGIN,
    component: Login,
    beforeLoad: requireGuest,
  });
