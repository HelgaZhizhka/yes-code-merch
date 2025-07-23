import type { AnyRoute, RootRoute } from '@tanstack/react-router';
import { createRoute } from '@tanstack/react-router';

import { About } from '@pages/about';
import { Cart } from '@pages/cart';
import { Catalog } from '@pages/catalog';
import { ForgotPassword } from '@pages/forgot-password';
import { Home } from '@pages/home';
import { Login } from '@pages/login';
import { NotFound } from '@pages/not-found';
import { Onboarding } from '@pages/onboarding';
import { AddressStep } from '@pages/onboarding/ui/address-step';
import { InitStep } from '@pages/onboarding/ui/init-step';
import { Product } from '@pages/product';
import { Profile } from '@pages/profile';
import { Registration } from '@pages/registration';
import { RegistrationForm } from '@pages/registration/ui/registration-form';
import { ResetPassword } from '@pages/reset-password';

import { ONBOARDING_STEPS, ROUTES } from '@shared/config/routes';

import { Layout } from '@/layouts';
import { RegistrationSuccess } from '@/pages/registration/ui/registration-success';

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

export const registrationFormRoute = (parentRoute: AnyRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.REGISTRATION,
    component: RegistrationForm,
  });

export const registrationSuccessRoute = (parentRoute: AnyRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.REGISTRATION_SUCCESS,
    component: RegistrationSuccess,
  });

export const onboardingLayoutRoute = (parentRoute: FlexibleRouteType) =>
  createRoute({
    getParentRoute: () => parentRoute,
    id: 'onboarding-layout',
    component: Onboarding,
  });

export const onboardingInitStepRoute = (parentRoute: AnyRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ONBOARDING_STEPS.INIT,
    component: InitStep,
  });

export const onboardingAddressStepRoute = (parentRoute: AnyRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ONBOARDING_STEPS.ADDRESS,
    component: AddressStep,
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
    path: ROUTES.FORGOT,
    beforeLoad: authGuard({ requireAuth: false, redirectTo: ROUTES.HOME }),
    component: ForgotPassword,
  });

export const resetPasswordRoute = (parentRoute: FlexibleRouteType) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.RESET,
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
