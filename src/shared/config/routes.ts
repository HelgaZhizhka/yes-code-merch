export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTRATION: '/registration',
  REGISTRATION_SUCCESS: '/registration/success',
  FORGOT: '/forgot',
  RESET: '/reset',
  ABOUT: '/about',
  PROFILE: '/profile',
  CATEGORY: '/category/$categoryId',
  SUBCATEGORY: '/category/$categoryId/$subCategoryId',
  PRODUCT: '/product/$productId',
  CART: '/cart',
  NOT_FOUND: '*',
} as const;

export const ONBOARDING_STEPS = {
  INIT: '/onboarding',
  ADDRESS: '/onboarding/address',
} as const;

export type ROUTES_KEYS = (typeof ROUTES)[keyof typeof ROUTES];
