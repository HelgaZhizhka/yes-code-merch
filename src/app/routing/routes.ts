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

import { createAuthGuard } from '@features/auth/lib/auth-guard';

import { ROUTES } from '@shared/config/routes';

export const homeRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.HOME,
    component: Home,
  });

export const aboutRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.ABOUT,
    component: About,
  });

export const cartRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.CART,
    component: Cart,
  });

export const categoryRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.CATEGORY,
    component: Catalog,
  });

export const subCategoryRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.SUBCATEGORY,
    component: Catalog,
  });

export const loginRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.LOGIN,
    component: Login,
    beforeLoad: createAuthGuard('guest'),
  });

export const registrationRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.REGISTRATION,
    component: Registration,
    beforeLoad: createAuthGuard('guest'),
  });

export const notFoundRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.NOT_FOUND,
    component: NotFound,
  });

export const productRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.PRODUCT,
    component: Product,
  });

export const profileRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.PROFILE,
    component: Profile,
    beforeLoad: createAuthGuard('authorized'),
  });

export const uiReviewRoute = (parentRoute: RootRoute) =>
  createRoute({
    path: '/ui-preview',
    getParentRoute: () => parentRoute,
    component: UIPreviewPage,
  });
