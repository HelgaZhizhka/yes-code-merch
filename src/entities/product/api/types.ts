import type { Public } from '@shared/api/supabase-client';

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

export interface ProductDiscountDTO {
  id: string;
  name: string;
  discount_type: string;
  discount_value: number;
  priority: number;
  valid_from: string | null;
  valid_to: string | null;
  is_active: boolean;
  variant_id: string | null;
  product_id: string | null;
}

export interface AppliedDiscount {
  id: string;
  name: string;
  type: 'percent' | 'amount';
  value: number;
  validUntil?: Date;
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
  hasDiscount: boolean;
  discountAmount?: number;
  discountPercentage?: number;
  appliedDiscount?: AppliedDiscount;
  stock: number;
  primaryImageUrl: string | null;
}

export interface GetCatalogParams {
  categoryIds: string[];
}
