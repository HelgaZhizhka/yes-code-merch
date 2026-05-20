import { z } from 'zod';

import { DISCOUNT_TYPES } from '@shared/api/product-types';

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
