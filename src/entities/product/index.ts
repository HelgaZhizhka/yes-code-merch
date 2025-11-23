export { getCatalogProducts } from './api';
export { useProducts, productKeys } from './api/hooks';

export type {
  CatalogProduct,
  GetCatalogParams,
  ProductDiscountDTO,
  AppliedDiscount,
} from './api/types';

export { ProductCard, ProductList } from './ui';
