import {
  DISCOUNT_TYPES,
  type AppliedDiscount,
  type DiscountType,
  type ProductDiscountDTO,
} from '../api/types';

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

  const discountAmount = calculateDiscountAmount(discount, originalPrice);
  const finalPrice = calculateFinalPrice(originalPrice, discountAmount);

  const appliedDiscount: AppliedDiscount = {
    id: discount.id,
    name: discount.name,
    type: discount.discount_type as DiscountType,
    value: discount.discount_value,
    validUntil: discount.valid_to ? new Date(discount.valid_to) : undefined,
  };

  return {
    finalPrice,
    discountAmount,
    appliedDiscount,
  };
};
