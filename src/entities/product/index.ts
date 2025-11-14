// API
export { getCatalogProducts } from './api';
export { useProducts, productKeys } from './api/hooks';

// Types
export type {
  CatalogProduct,
  CatalogResponse,
  GetCatalogParams,
  PaginationInfo,
  DiscountInfo,
} from './api/types';

// Utils
export { calculateFinalPrice, getActiveDiscount } from './lib/calculate-price';
