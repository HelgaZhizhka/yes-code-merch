import type { ProductDiscountDTO } from '../api/types';

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
