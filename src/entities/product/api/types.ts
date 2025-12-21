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
  price: number; // Price in cents (e.g., 3000 = €30.00)
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

export interface AppliedDiscount {
  id: string;
  name: string;
  type: 'percent' | 'amount';
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
  discountPercentage?: number;
  appliedDiscount?: AppliedDiscount;
  images: ProductImages | null;
}

export interface CatalogParams {
  categoryIds: string[];
}

export type ImageSize = 'large' | 'medium' | 'small';
