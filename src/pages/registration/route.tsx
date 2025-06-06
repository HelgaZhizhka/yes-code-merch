import type { RootRoute } from '@tanstack/react-router';
import { createRoute } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';
import { requireGuest } from '@shared/lib/auth';

import { Registration } from './';

export const registrationRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.REGISTRATION,
    component: Registration,
    beforeLoad: requireGuest,
  });
