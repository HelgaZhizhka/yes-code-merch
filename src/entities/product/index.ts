export { productKeys, useProducts } from './api/hooks';
export type {
  AppliedDiscount,
  CatalogParams,
  CatalogProduct,
  CatalogView,
  FilterOptions,
  PaginatedCatalogProducts,
  PaginationMeta,
  ProductSortField,
  SortDirection,
} from './api/types';
export { catalogSearchSchema, type CatalogSearch } from './lib';
export {
  CATALOG_VIEWS,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_FIELD,
  DEFAULT_VIEW,
  PRODUCT_SORT_FIELDS,
  SORT_DIRECTIONS,
} from './lib';
export { useCatalogSearch } from './model/use-catalog-search';
export { ProductCard, ProductList } from './ui';
