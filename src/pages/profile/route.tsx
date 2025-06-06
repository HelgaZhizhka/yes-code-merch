import type { RootRoute } from '@tanstack/react-router';
import { createRoute } from '@tanstack/react-router';

import { ROUTES } from '@shared/config';
import { requireAuth } from '@shared/lib/utils';

import { Profile } from './';

export const profileRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.PROFILE,
    component: Profile,
    beforeLoad: requireAuth,
  });
