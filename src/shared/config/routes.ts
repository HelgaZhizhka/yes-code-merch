export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTRATION: '/registration',
  ABOUT: '/about',
  PROFILE: '/profile',
  CATEGORY: '/category/:categoryId/:subcategoryId?',
  PRODUCT: '/product/:categoryId/:subcategoryId?/:productId',
  CART: '/cart',
  DEMO: '/demo/tanstack-query',
  NOT_FOUND: '/*',
} as const;
