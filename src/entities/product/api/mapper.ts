import { getStorageUrl, isNotNull } from '@shared/lib/utils';

import type {
  CatalogProduct,
  PaginationMeta,
  ProductDiscountDTO,
  ProductImages,
  ProductSearchViewDTO,
} from './types';

import { applyDiscountsToProduct } from '../lib';

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

export const createPaginationMeta = (
  count: number,
  page: number,
  pageSize: number
): PaginationMeta => {
  const totalPages = Math.ceil(count / pageSize);
  return {
    page,
    pageSize,
    totalCount: count,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

export const mapFromViewToCatalogProducts = (
  products: readonly ProductSearchViewDTO[]
): CatalogProduct[] => {
  return products
    .map((raw) => {
      if (
        !raw.id ||
        !raw.name ||
        !raw.slug ||
        !raw.variant_id ||
        !raw.sku ||
        !raw.currency ||
        raw.price === null ||
        raw.stock === null
      ) {
        return null;
      }

      const images = raw.primary_image_url
        ? getImageSizes(raw.primary_image_url)
        : null;

      const originalPrice = raw.price;
      const discounts = (raw.product_discounts ?? []) as ProductDiscountDTO[];
      const { finalPrice, discountAmount, appliedDiscount } =
        applyDiscountsToProduct(discounts, originalPrice);
      const hasDiscount = Boolean(appliedDiscount);

      return {
        productId: raw.id,
        name: raw.name,
        slug: raw.slug,
        description: raw.description,
        masterVariantId: raw.variant_id,
        sku: raw.sku,
        stock: raw.stock,
        originalPrice,
        finalPrice,
        currency: raw.currency,
        hasDiscount,
        discountAmount,
        appliedDiscount,
        images,
      };
    })
    .filter(isNotNull);
};
