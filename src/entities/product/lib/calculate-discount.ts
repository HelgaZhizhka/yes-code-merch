import type {
  AppliedDiscount,
  ProductDiscountDTO,
  ProductDTO,
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
  return Math.round(originalPrice * (discount.discount_value / 100));
};

export const calculateFinalPrice = (
  originalPrice: number,
  discount: ProductDiscountDTO | null
): number => {
  if (!discount) return originalPrice;

  const discountAmount = calculateDiscountAmount(discount, originalPrice);
  const finalPrice = originalPrice - discountAmount;

  return Math.max(finalPrice, 0);
};

export const applyDiscountsToProduct = (
  product: ProductDTO,
  originalPrice: number
): {
  finalPrice: number;
  discountAmount: number;
  appliedDiscount?: AppliedDiscount;
} => {
  const allDiscounts = product.product_discounts ?? [];
  const activeDiscounts = getActiveDiscounts(allDiscounts);

  const discount = activeDiscounts[0] ?? null;

  if (!discount) {
    return {
      finalPrice: originalPrice,
      discountAmount: 0,
    };
  }

  const discountAmount = calculateDiscountAmount(discount, originalPrice);
  const finalPrice = calculateFinalPrice(originalPrice, discount);

  const appliedDiscount: AppliedDiscount = {
    id: discount.id,
    name: discount.name,
    type: 'percent',
    value: discount.discount_value,
    validUntil: discount.valid_to ? new Date(discount.valid_to) : undefined,
  };

  return {
    finalPrice,
    discountAmount,
    appliedDiscount,
  };
};
