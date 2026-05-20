import type { Public } from '@shared/api/supabase-client';

export type ProductDiscountRowDTO =
  Public['Tables']['product_discounts']['Row'];

export type ProductDiscountDTO = Pick<
  ProductDiscountRowDTO,
  | 'id'
  | 'name'
  | 'discount_type'
  | 'discount_value'
  | 'priority'
  | 'valid_from'
  | 'valid_to'
  | 'is_active'
  | 'variant_id'
  | 'product_id'
>;

export type ProductSearchViewDTO = Public['Views']['products_search']['Row'];

export interface ProductImages {
  large: string | null;
  medium: string | null;
  small: string | null;
}

export const DISCOUNT_TYPES = {
  PERCENT: 'percent',
  AMOUNT: 'amount',
} as const;

export type DiscountType = (typeof DISCOUNT_TYPES)[keyof typeof DISCOUNT_TYPES];

export interface AppliedDiscount {
  id: string;
  name: string;
  type: DiscountType;
  value: number;
  validUntil?: Date;
}
