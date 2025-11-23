import { getStorageUrl, isNotNull } from '@shared/lib/utils';

import type { CatalogProduct, ProductDTO } from './types';

export const mapToCatalogProducts = (
  products: readonly ProductDTO[]
): CatalogProduct[] => {
  return products
    .map((raw) => {
      const masterVariant = raw.product_variants?.[0];
      if (!masterVariant) return null;

      const primaryImage =
        masterVariant.product_images?.find((img) => img.is_primary) ||
        masterVariant.product_images?.toSorted(
          (a, b) => a.sort_order - b.sort_order
        )[0];

      const originalPrice = masterVariant.price;
      const finalPrice = originalPrice;
      const hasDiscount = false;
      const discountAmount = undefined;
      const discountPercentage = undefined;
      const appliedDiscount = undefined;

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
        hasDiscount,
        discountAmount,
        discountPercentage,
        appliedDiscount,
        stock: masterVariant.stock,
        primaryImageUrl: primaryImage?.url
          ? getStorageUrl(primaryImage.url)
          : null,
      };
    })
    .filter(isNotNull);
};
