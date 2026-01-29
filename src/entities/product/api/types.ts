import type { Public } from '@shared/api/supabase-client';

import type { PRODUCT_SORT_FIELDS, SORT_DIRECTIONS } from '../lib/constants';

export type ProductRowDTO = Public['Tables']['products']['Row'];
export type ProductVariantRowDTO = Public['Tables']['product_variants']['Row'];
export type ProductImageRowDTO = Public['Tables']['product_images']['Row'];
export type ProductDiscountRowDTO =
  Public['Tables']['product_discounts']['Row'];

export interface ProductImageDTO {
  url: string;
  alt: string | null;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductVariantDTO {
  id: string;
  sku: string;
  price: number;
  currency: string;
  stock: number;
  is_master: boolean;
  product_images?: ProductImageDTO[];
}

export type ProductDiscountDTO = Pick<
  ProductDiscountRowDTO,
  | 'id'
  | 'name'
  | 'discount_type'
  | 'discount_value'
  | 'priority'
  | 'valid_from'
  | 'valid_to'
  | 'is_active'
  | 'variant_id'
  | 'product_id'
>;

export const DISCOUNT_TYPES = {
  PERCENT: 'percent',
  AMOUNT: 'amount',
} as const;

export type DiscountType = (typeof DISCOUNT_TYPES)[keyof typeof DISCOUNT_TYPES];

export interface AppliedDiscount {
  id: string;
  name: string;
  type: DiscountType;
  value: number;
  validUntil?: Date;
}

export interface ProductImages {
  large: string | null;
  medium: string | null;
  small: string | null;
}

export interface ProductCategoryDTO {
  category_id: string;
}

export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  product_variants: ProductVariantDTO[];
  product_discounts?: ProductDiscountDTO[];
  product_categories: ProductCategoryDTO[];
}

export type ProductSearchViewDTO = Public['Views']['products_search']['Row'];

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
  images: ProductImages | null;
}

export interface CatalogProductsViewResponse {
  data: ProductSearchViewDTO[];
  count: number;
}

export type ProductSortField =
  (typeof PRODUCT_SORT_FIELDS)[keyof typeof PRODUCT_SORT_FIELDS];

export type SortDirection =
  (typeof SORT_DIRECTIONS)[keyof typeof SORT_DIRECTIONS];

export interface CatalogParams {
  categoryIds: string[];
  search?: string;
  priceMin?: number;
  priceMax?: number;
  page?: number;
  pageSize?: number;
  sortField?: ProductSortField;
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
