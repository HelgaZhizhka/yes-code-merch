import type { ProductDiscountRowDTO } from '../api/types';

/**
 * Get the active discount for a specific variant or product
 * @param discounts - Array of discounts
 * @param variantId - Variant ID to check
 * @param productId - Product ID to check
 * @returns Active discount or null
 */
export function getActiveDiscount(
  discounts: ProductDiscountRowDTO[],
  variantId: string,
  productId: string
): ProductDiscountRowDTO | null {
  if (!discounts?.length) return null;

  const now = new Date();

  // Filter active discounts for this variant or product
  const activeDiscounts = discounts
    .filter((d) => {
      const isActive = d.is_active;
      const isForVariantOrProduct =
        d.variant_id === variantId || d.product_id === productId;
      const isValidFrom = !d.valid_from || new Date(d.valid_from) <= now;
      const isValidTo = !d.valid_to || new Date(d.valid_to) >= now;

      return isActive && isForVariantOrProduct && isValidFrom && isValidTo;
    })
    .sort((a, b) => {
      // Priority: variant-level > product-level
      if (a.variant_id && !b.variant_id) return -1;
      if (!a.variant_id && b.variant_id) return 1;
      // Then by priority field
      return b.priority - a.priority;
    });

  return activeDiscounts[0] || null;
}

/**
 * Calculate final price with discount applied
 * @param originalPrice - Original price
 * @param discount - Discount to apply
 * @returns Final price after discount
 */
export function calculateFinalPrice(
  originalPrice: number,
  discount: ProductDiscountRowDTO | null
): number {
  if (!discount) return originalPrice;

  return discount.discount_type === 'percent'
    ? Math.round(originalPrice * (1 - discount.discount_value / 100) * 100) /
        100
    : Math.max(0, originalPrice - discount.discount_value);
}
