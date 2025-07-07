import type { RootRoute } from '@tanstack/react-router';
import { createRoute } from '@tanstack/react-router';

import { About } from '@pages/about';
import { Cart } from '@pages/cart';
import { Catalog } from '@pages/catalog';
import { Home } from '@pages/home';
import { Login } from '@pages/login';
import { NotFound } from '@pages/not-found';
import { Product } from '@pages/product';
import { Profile } from '@pages/profile';
import { Registration } from '@pages/registration';
import { UIPreviewPage } from '@pages/ui-preview';

import { ROUTES } from '@shared/config/routes';

import { Layout } from '@/layouts';

import { authGuard } from './auth-guard';

type FlexibleRouteType =
  | RootRoute
  | ReturnType<typeof pathlessLayoutRoute>
  | ReturnType<typeof createRoute>;

export const pathlessLayoutRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    id: 'pathlessLayout',
    component: Layout,
  });

export const homeRoute = (parentRoute: FlexibleRouteType) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.HOME,
    component: Home,
  });

export const aboutRoute = (parentRoute: FlexibleRouteType) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.ABOUT,
    component: About,
  });

export const cartRoute = (parentRoute: FlexibleRouteType) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.CART,
    component: Cart,
  });

export const categoryRoute = (parentRoute: FlexibleRouteType) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.CATEGORY,
    component: Catalog,
  });

export const subCategoryRoute = (parentRoute: FlexibleRouteType) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.SUBCATEGORY,
    component: Catalog,
  });

export const loginRoute = (parentRoute: FlexibleRouteType) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.LOGIN,
    beforeLoad: authGuard({ requireAuth: false, redirectTo: ROUTES.HOME }),
    component: Login,
  });

export const registrationRoute = (parentRoute: FlexibleRouteType) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.REGISTRATION,
    beforeLoad: authGuard({ requireAuth: false, redirectTo: ROUTES.HOME }),
    component: Registration,
  });

export const productRoute = (parentRoute: FlexibleRouteType) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.PRODUCT,
    component: Product,
  });

export const profileRoute = (parentRoute: FlexibleRouteType) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.PROFILE,
    beforeLoad: authGuard({ requireAuth: true, redirectTo: ROUTES.LOGIN }),
    component: Profile,
  });

export const uiReviewRoute = (parentRoute: RootRoute) =>
  createRoute({
    path: '/ui-preview',
    getParentRoute: () => parentRoute,
    component: UIPreviewPage,
  });

export const notFoundRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.NOT_FOUND,
    component: NotFound,
  });
