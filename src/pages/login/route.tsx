import type { RootRoute } from '@tanstack/react-router';
import { createRoute } from '@tanstack/react-router';

import { ROUTES } from '@shared/config';
import { requireGuest } from '@shared/lib/utils';

import { Login } from './';

export const loginRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.LOGIN,
    component: Login,
    beforeLoad: requireGuest,
  });
