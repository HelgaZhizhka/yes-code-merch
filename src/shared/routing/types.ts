export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTRATION: '/registration',
  ABOUT: '/about',
  PROFILE: '/profile',
  CATEGORY: '/category/$categoryId',
  SUBCATEGORY: '/category/$categoryId/$subCategoryId',
  PRODUCT: '/product/$productId',
  CART: '/cart',
  NOT_FOUND: '*',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
