import type { AnyRoute, RootRoute } from '@tanstack/react-router';
import { createRoute, stripSearchParams } from '@tanstack/react-router';
import { lazy } from 'react';

const Cart = lazy(() =>
  import('@pages/cart').then((m) => ({ default: m.Cart }))
);
const Catalog = lazy(() =>
  import('@pages/catalog').then((m) => ({ default: m.Catalog }))
);
const ForgotPassword = lazy(() =>
  import('@pages/forgot-password').then((m) => ({ default: m.ForgotPassword }))
);
const Home = lazy(() =>
  import('@pages/home').then((m) => ({ default: m.Home }))
);
const Login = lazy(() =>
  import('@pages/login').then((m) => ({ default: m.Login }))
);
const NotFound = lazy(() =>
  import('@pages/not-found').then((m) => ({ default: m.NotFound }))
);
const Onboarding = lazy(() =>
  import('@pages/onboarding/index').then((m) => ({ default: m.Onboarding }))
);
const AddressStep = lazy(() =>
  import('@pages/onboarding/ui/address-step').then((m) => ({
    default: m.AddressStep,
  }))
);
const InitStep = lazy(() =>
  import('@pages/onboarding/ui/init-step').then((m) => ({
    default: m.InitStep,
  }))
);
const Product = lazy(() =>
  import('@pages/product').then((m) => ({ default: m.Product }))
);
const Profile = lazy(() =>
  import('@pages/profile').then((m) => ({ default: m.Profile }))
);
const AddAddress = lazy(() =>
  import('@pages/profile/ui/add-address').then((m) => ({
    default: m.AddAddress,
  }))
);
const ChangePassword = lazy(() =>
  import('@pages/profile/ui/change-password').then((m) => ({
    default: m.ChangePassword,
  }))
);
const EditAddress = lazy(() =>
  import('@pages/profile/ui/edit-address').then((m) => ({
    default: m.EditAddress,
  }))
);
const EditPersonal = lazy(() =>
  import('@pages/profile/ui/edit-personal').then((m) => ({
    default: m.EditPersonal,
  }))
);
const Overview = lazy(() =>
  import('@pages/profile/ui/overview').then((m) => ({ default: m.Overview }))
);
const Registration = lazy(() =>
  import('@pages/registration').then((m) => ({ default: m.Registration }))
);
const RegistrationForm = lazy(() =>
  import('@pages/registration/ui/registration-form').then((m) => ({
    default: m.RegistrationForm,
  }))
);
const RegistrationSuccess = lazy(() =>
  import('@pages/registration/ui/registration-success').then((m) => ({
    default: m.RegistrationSuccess,
  }))
);
const ResetPassword = lazy(() =>
  import('@pages/reset-password').then((m) => ({ default: m.ResetPassword }))
);

import {
  catalogSearchSchema,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  PRODUCT_SORT_FIELDS,
  SORT_DIRECTIONS,
} from '@entities/product';

import { categoriesTreeQueryOptions } from '@shared/api';
import { ONBOARDING_STEPS, ROUTES } from '@shared/config/routes';

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
    component: ResetPassword,
  });

export const homeRoute = (parentRoute: FlexibleRouteType) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.HOME,
    component: Home,
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
    validateSearch: catalogSearchSchema,
    loader: async ({ context }) => {
      await context.queryClient.ensureQueryData(categoriesTreeQueryOptions());
    },
    search: {
      middlewares: [
        stripSearchParams({
          page: DEFAULT_PAGE,
          pageSize: DEFAULT_PAGE_SIZE,
          sortField: PRODUCT_SORT_FIELDS.CREATED_AT,
          sortDirection: SORT_DIRECTIONS.DESC,
        }),
      ],
    },
  });

export const productRoute = (parentRoute: FlexibleRouteType) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.PRODUCT,
    component: Product,
  });

export const profileLayoutRoute = (parentRoute: FlexibleRouteType) =>
  createRoute({
    getParentRoute: () => parentRoute,
    id: 'profile-layout',
    beforeLoad: authGuard({ requireAuth: true, redirectTo: ROUTES.LOGIN }),
    component: Profile,
  });

export const profileOverviewRoute = (parentRoute: AnyRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.PROFILE,
    component: Overview,
  });

export const profileEditPersonalRoute = (parentRoute: AnyRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.PROFILE_PERSONAL,
    component: EditPersonal,
  });

export const profileChangePasswordRoute = (parentRoute: AnyRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.PROFILE_SECRET,
    component: ChangePassword,
  });

export const profileAddAddressRoute = (parentRoute: AnyRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.PROFILE_ADD_ADDRESS,
    component: AddAddress,
  });

export const profileEditAddressRoute = (parentRoute: AnyRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.PROFILE_EDIT_ADDRESS,
    component: EditAddress,
  });

export const notFoundRoute = (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.NOT_FOUND,
    component: NotFound,
  });
