import type {
  CatalogProduct,
  DiscountInfo,
  ProductDiscountRowDTO,
  ProductImageRowDTO,
} from './types';

import { calculateFinalPrice, getActiveDiscount } from '../lib/calculate-price';

interface ProductQueryResult {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  product_variants: Array<{
    id: string;
    sku: string;
    price: number;
    currency: string;
    stock: number;
    is_master: boolean;
    product_images?: ProductImageRowDTO[];
  }>;
  product_discounts?: ProductDiscountRowDTO[];
}

export function mapToCatalogProduct(
  raw: ProductQueryResult
): CatalogProduct | null {
  const masterVariant = raw.product_variants?.[0];
  if (!masterVariant) return null;

  const primaryImage =
    masterVariant.product_images?.find((img) => img.is_primary) ||
    masterVariant.product_images?.sort(
      (a, b) => a.sort_order - b.sort_order
    )[0];

  const activeDiscount = getActiveDiscount(
    raw.product_discounts || [],
    masterVariant.id,
    raw.id
  );

  const originalPrice = masterVariant.price;
  const finalPrice = calculateFinalPrice(originalPrice, activeDiscount);

  const discountInfo: DiscountInfo | null = activeDiscount
    ? {
        id: activeDiscount.id,
        discountType: activeDiscount.discount_type as 'percent' | 'amount',
        discountValue: activeDiscount.discount_value,
        priority: activeDiscount.priority,
      }
    : null;

  return {
    productId: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description,
    masterVariantId: masterVariant.id,
    sku: masterVariant.sku,
    originalPrice,
    finalPrice,
    currency: masterVariant.currency,
    stock: masterVariant.stock,
    primaryImageUrl: primaryImage?.url || null,
    hasDiscount: !!activeDiscount,
    discountInfo,
  };
}
