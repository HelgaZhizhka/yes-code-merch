import type { RootRoute } from '@tanstack/react-router';
import { createRoute, redirect } from '@tanstack/react-router';

import { isAuthorized } from '@entities/session/model/selectors';

import { ROUTES } from '@shared/model/constants';

import { About } from '@/pages/about';
import { Cart } from '@/pages/cart';
import { Catalog } from '@/pages/catalog';
import { Home } from '@/pages/home';
import { Login } from '@/pages/login';
import { NotFound } from '@/pages/not-found';
import { Product } from '@/pages/product';
import { Profile } from '@/pages/profile';
import { Registration } from '@/pages/registration';
import { UIPreviewPage } from '@/pages/ui-preview';

import type { BeforeLoadContext } from './interfaces';

export const requireAuth = (opts: BeforeLoadContext) => {
  if (opts?.preload) return;
  if (!isAuthorized()) {
    throw redirect({ to: ROUTES.LOGIN });
  }
};

export const requireGuest = (opts: BeforeLoadContext) => {
  if (opts?.preload) return;
  if (isAuthorized()) {
    throw redirect({ to: ROUTES.HOME });
  }
};

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
    beforeLoad: requireGuest,
  });

export const registrationRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.REGISTRATION,
    component: Registration,
    beforeLoad: requireGuest,
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
    beforeLoad: requireAuth,
  });

export const uiReviewRoute = (parentRoute: RootRoute) =>
  createRoute({
    path: '/ui-preview',
    getParentRoute: () => parentRoute,
    component: UIPreviewPage,
  });
