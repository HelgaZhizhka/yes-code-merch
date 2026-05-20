import { z } from 'zod';

import {
  DISCOUNT_TYPES,
  type AppliedDiscount,
  type DiscountType,
  type ProductDiscountDTO,
} from '@shared/api/product-types';

export const productDiscountSchema = z.object({
  id: z.string(),
  name: z.string(),
  discount_type: z.enum([DISCOUNT_TYPES.PERCENT, DISCOUNT_TYPES.AMOUNT]),
  discount_value: z.number(),
  priority: z.number(),
  valid_from: z.string().nullable(),
  valid_to: z.string().nullable(),
  is_active: z.boolean(),
  variant_id: z.string().nullable(),
  product_id: z.string().nullable(),
});

export const productDiscountsSchema = z.array(productDiscountSchema);

export type ParsedProductDiscount = z.infer<typeof productDiscountSchema>;

const isDiscountType = (value: string): value is DiscountType =>
  value === DISCOUNT_TYPES.PERCENT || value === DISCOUNT_TYPES.AMOUNT;

export const getActiveDiscounts = (
  discounts: ProductDiscountDTO[],
  currentDate: Date = new Date()
): ProductDiscountDTO[] => {
  return discounts.filter((discount) => {
    if (!discount.is_active) return false;

    if (discount.valid_from) {
      const fromDate = new Date(discount.valid_from);
      if (fromDate > currentDate) return false;
    }

    if (discount.valid_to) {
      const toDate = new Date(discount.valid_to);
      if (toDate < currentDate) return false;
    }

    return true;
  });
};

export const calculateDiscountAmount = (
  discount: ProductDiscountDTO,
  originalPrice: number
): number => {
  if (discount.discount_type === DISCOUNT_TYPES.PERCENT) {
    return Math.round(originalPrice * (discount.discount_value / 100));
  }

  if (discount.discount_type === DISCOUNT_TYPES.AMOUNT) {
    return Math.round(discount.discount_value);
  }

  throw new Error(`Incorrect discount type: ${discount.discount_type}`);
};

export const calculateFinalPrice = (
  originalPrice: number,
  discountAmount: number
): number => {
  const finalPrice = originalPrice - discountAmount;
  return Math.max(finalPrice, 0);
};

export const selectBestDiscount = (
  discounts: ProductDiscountDTO[],
  originalPrice: number
): ProductDiscountDTO => {
  const maxPriority = Math.max(
    ...discounts.map((discount) => discount.priority)
  );

  const priorityDiscounts = discounts.filter(
    (discount) => discount.priority === maxPriority
  );

  let bestDiscount = priorityDiscounts[0];
  let maxAmount = calculateDiscountAmount(bestDiscount, originalPrice);

  for (let i = 1; i < priorityDiscounts.length; i++) {
    const discount = priorityDiscounts[i];
    const amount = calculateDiscountAmount(discount, originalPrice);
    if (amount > maxAmount) {
      maxAmount = amount;
      bestDiscount = discount;
    }
  }

  return bestDiscount;
};

export const applyDiscountsToProduct = (
  discounts: ProductDiscountDTO[],
  originalPrice: number
): {
  finalPrice: number;
  discountAmount: number;
  appliedDiscount?: AppliedDiscount;
} => {
  const activeDiscounts = getActiveDiscounts(discounts);

  if (activeDiscounts.length === 0) {
    return {
      finalPrice: originalPrice,
      discountAmount: 0,
    };
  }

  const discount = selectBestDiscount(activeDiscounts, originalPrice);

  if (!isDiscountType(discount.discount_type)) {
    throw new Error(`Invalid discount type: ${discount.discount_type}`);
  }

  const discountAmount = calculateDiscountAmount(discount, originalPrice);
  const finalPrice = calculateFinalPrice(originalPrice, discountAmount);

  const appliedDiscount: AppliedDiscount = {
    id: discount.id,
    name: discount.name,
    type: discount.discount_type,
    value: discount.discount_value,
    validUntil: discount.valid_to ? new Date(discount.valid_to) : undefined,
  };

  return {
    finalPrice,
    discountAmount,
    appliedDiscount,
  };
};
