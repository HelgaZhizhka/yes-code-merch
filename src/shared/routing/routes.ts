import type { AnyRoute, RootRoute } from '@tanstack/react-router';
import { createRoute } from '@tanstack/react-router';

import { About } from '@pages/about';
import { Cart } from '@pages/cart';
import { Catalog } from '@pages/catalog';
import { ForgotPassword } from '@pages/forgot-password';
import { Home } from '@pages/home';
import { Login } from '@pages/login';
import { NotFound } from '@pages/not-found';
import { Product } from '@pages/product';
import { Profile } from '@pages/profile';
import { Registration } from '@pages/registration';
import { ConfirmStep } from '@pages/registration/ui/confirm-step';
import { InitStep } from '@pages/registration/ui/init-step';
import { NextStep } from '@pages/registration/ui/next-step';
import { ResetPassword } from '@pages/reset-password';

import { REGISTRATION_STEPS, ROUTES } from '@shared/config/routes';

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

export const registrationLayoutRoute = (parentRoute: FlexibleRouteType) =>
  createRoute({
    getParentRoute: () => parentRoute,
    id: 'registration-layout',
    beforeLoad: authGuard({ requireAuth: false, redirectTo: ROUTES.HOME }),
    component: Registration,
  });

export const registrationInitStepRoute = (parentRoute: AnyRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: REGISTRATION_STEPS.INIT,
    component: InitStep,
  });

export const registrationNextStepRoute = (parentRoute: AnyRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: REGISTRATION_STEPS.NEXT,
    component: NextStep,
  });

export const registrationConfirmStepRoute = (parentRoute: AnyRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: REGISTRATION_STEPS.CONFIRM,
    component: ConfirmStep,
  });

export const loginRoute = (parentRoute: FlexibleRouteType) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.LOGIN,
    beforeLoad: authGuard({ requireAuth: false, redirectTo: ROUTES.HOME }),
    component: Login,
  });

export const forgotPasswordRoute = (parentRoute: FlexibleRouteType) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.FORGOT_PASSWORD,
    beforeLoad: authGuard({ requireAuth: false, redirectTo: ROUTES.HOME }),
    component: ForgotPassword,
  });

export const resetPasswordRoute = (parentRoute: FlexibleRouteType) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.RESET_PASSWORD,
    beforeLoad: authGuard({ requireAuth: false, redirectTo: ROUTES.HOME }),
    component: ResetPassword,
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

export const notFoundRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.NOT_FOUND,
    component: NotFound,
  });
