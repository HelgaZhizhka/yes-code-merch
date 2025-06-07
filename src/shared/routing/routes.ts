import type { RootRoute } from '@tanstack/react-router';
import { createRoute } from '@tanstack/react-router';

import { Home } from '@/pages/home/ui';

import { ROUTES } from './types';

export const homeRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.HOME,
    component: Home,
  });
