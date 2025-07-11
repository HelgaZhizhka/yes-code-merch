export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ABOUT: '/about',
  PROFILE: '/profile',
  CATEGORY: '/category/$categoryId',
  SUBCATEGORY: '/category/$categoryId/$subCategoryId',
  PRODUCT: '/product/$productId',
  CART: '/cart',
  NOT_FOUND: '*',
} as const;

export enum REGISTRATION_STEPS {
  INIT = '/registration',
  NEXT = '/second-step',
  CONFIRM = '/confirm-step',
}

export const STEP_TO_ROUTE: Record<number, REGISTRATION_STEPS> = {
  1: REGISTRATION_STEPS.INIT,
  2: REGISTRATION_STEPS.NEXT,
  3: REGISTRATION_STEPS.CONFIRM,
};

export type ROUTES_KEYS = (typeof ROUTES)[keyof typeof ROUTES];
