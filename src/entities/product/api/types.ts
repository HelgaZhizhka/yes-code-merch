import type { Public } from '@shared/api/supabase-client';

// Database row types
export type ProductRowDTO = Public['Tables']['products']['Row'];
export type ProductVariantRowDTO = Public['Tables']['product_variants']['Row'];
export type ProductImageRowDTO = Public['Tables']['product_images']['Row'];
export type ProductDiscountRowDTO =
  Public['Tables']['product_discounts']['Row'];

// Discount info for catalog
export interface DiscountInfo {
  id: string;
  discountType: 'percent' | 'amount';
  discountValue: number;
  priority: number;
}

// Catalog product (for PLP - Product List Page)
export interface CatalogProduct {
  productId: string;
  name: string;
  slug: string;
  description: string | null;
  masterVariantId: string;
  sku: string;
  originalPrice: number;
  finalPrice: number;
  currency: string;
  stock: number;
  primaryImageUrl: string | null;
  hasDiscount: boolean;
  discountInfo: DiscountInfo | null;
}

// Query parameters for catalog
export interface GetCatalogParams {
  categoryId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'price' | 'finalPrice' | 'name' | 'created_at';
  sortDir?: 'asc' | 'desc';
}

// Pagination info
export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Catalog response
export interface CatalogResponse {
  products: CatalogProduct[];
  pagination: PaginationInfo;
}
