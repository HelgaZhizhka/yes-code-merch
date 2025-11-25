import { getStorageUrl, isNotNull } from '@shared/lib/utils';

import type {
  CatalogProduct,
  ImageSize,
  ProductDTO,
  ProductImageDTO,
  ProductImages,
} from './types';

const extractImageSize = (url: string): ImageSize | null => {
  if (url.includes('/large/')) return 'large';
  if (url.includes('/medium/')) return 'medium';
  if (url.includes('/small/')) return 'small';
  return null;
};

const groupImagesBySizes = (
  images: ProductImageDTO[] | undefined
): ProductImages | null => {
  if (!images || images.length === 0) return null;
  const minSortOrder = Math.min(...images.map((img) => img.sort_order));
  const targetImages = images.filter((img) => img.sort_order === minSortOrder);

  const result: ProductImages = { large: null, medium: null, small: null };

  for (const img of targetImages) {
    const size = extractImageSize(img.url);

    if (size && !result[size]) {
      result[size] = getStorageUrl(img.url);
    }
  }

  return result.large || result.medium || result.small ? result : null;
};

export const mapToCatalogProducts = (
  products: readonly ProductDTO[]
): CatalogProduct[] => {
  return products
    .map((raw) => {
      const masterVariant = raw.product_variants?.[0];

      if (!masterVariant) return null;

      const images = groupImagesBySizes(masterVariant.product_images);

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
