import type {
  AppliedDiscount,
  ProductImages,
  ProductSearchViewDTO,
} from '@entities/product';

import type { CATALOG_SORT_FIELDS, SORT_DIRECTIONS } from '../lib/constants';

export interface CatalogProduct {
  productId: string;
  name: string;
  slug: string;
  description: string | null;
  masterVariantId: string;
  sku: string;
  stock: number;
  originalPrice: number;
  finalPrice: number;
  currency: string;
  hasDiscount: boolean;
  discountAmount?: number;
  appliedDiscount?: AppliedDiscount;
  categoryIds: string[];
  images: ProductImages | null;
}

export interface CatalogProductsViewResponse {
  data: ProductSearchViewDTO[];
  count: number;
}

export type CatalogSortField =
  (typeof CATALOG_SORT_FIELDS)[keyof typeof CATALOG_SORT_FIELDS];

export type SortDirection =
  (typeof SORT_DIRECTIONS)[keyof typeof SORT_DIRECTIONS];

export interface CatalogParams {
  categoryIds?: string[];
  search?: string;
  priceMin?: number;
  priceMax?: number;
  colors?: string[];
  sizes?: string[];
  page?: number;
  pageSize?: number;
  sortField?: CatalogSortField;
  sortDirection?: SortDirection;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedCatalogProducts {
  data: CatalogProduct[];
  meta: PaginationMeta;
}

export interface FilterOptions {
  colors: string[];
  sizes: string[];
  priceMin: number;
  priceMax: number;
  hasSizeFilter: boolean;
}

export type FilterTag = { type: 'color' | 'size'; value: string };
