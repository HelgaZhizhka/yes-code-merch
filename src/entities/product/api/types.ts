import type { ProductDiscountDTO } from '@shared/api/product-types';
import type { Public } from '@shared/api/supabase-client';

export {
  DISCOUNT_TYPES,
  type AppliedDiscount,
  type DiscountType,
  type ProductDiscountDTO,
  type ProductDiscountRowDTO,
  type ProductImages,
  type ProductSearchViewDTO,
} from '@shared/api/product-types';

export type ProductRowDTO = Public['Tables']['products']['Row'];
export type ProductVariantRowDTO = Public['Tables']['product_variants']['Row'];
export type ProductImageRowDTO = Public['Tables']['product_images']['Row'];

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
