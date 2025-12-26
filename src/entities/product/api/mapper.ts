import { getStorageUrl, isNotNull } from '@shared/lib/utils';

import type {
  CatalogProduct,
  ProductDTO,
  ProductImageDTO,
  ProductImages,
} from './types';

import { getActiveDiscounts } from '../lib';

const ImageSize = {
  large: 'large',
  medium: 'medium',
  small: 'small',
} as const;

const getImageSizes = (basePath: string): ProductImages => {
  return {
    large: getStorageUrl(basePath),
    medium: getStorageUrl(
      basePath.replace(`/${ImageSize.large}/`, `/${ImageSize.medium}/`)
    ),
    small: getStorageUrl(
      basePath.replace(`/${ImageSize.large}/`, `/${ImageSize.small}/`)
    ),
  };
};

const groupImagesBySizes = (
  images: ProductImageDTO[] | undefined
): ProductImages | null => {
  if (!images || images.length === 0) return null;

  const minSortOrder = Math.min(...images.map((img) => img.sort_order));
  const primaryImage = images.find((img) => img.sort_order === minSortOrder);

  if (!primaryImage) return null;

  return getImageSizes(primaryImage.url);
};

export const mapToCatalogProducts = (
  products: readonly ProductDTO[]
): CatalogProduct[] => {
  return products
    .map((raw) => {
      const masterVariant = raw.product_variants?.[0];
      const allDiscounts = raw.product_discounts ?? [];

      if (!masterVariant) return null;

      const images = groupImagesBySizes(masterVariant.product_images);

      const activeDiscounts = getActiveDiscounts(allDiscounts);
      const percentDiscount = activeDiscounts[0] ?? null;
      const originalPrice = masterVariant.price;
      const finalPrice = originalPrice;
      const hasDiscount = Boolean(percentDiscount);
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
        stock: masterVariant.stock,
        originalPrice,
        finalPrice,
        currency: masterVariant.currency,
        hasDiscount,
        discountAmount,
        discountPercentage,
        appliedDiscount,
        images,
      };
    })
    .filter(isNotNull);
};
