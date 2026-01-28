import { z } from 'zod';

import {
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_FIELD,
  PRODUCT_SORT_FIELDS,
  SORT_DIRECTIONS,
} from './constants';

export const catalogSearchSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(12),
  search: z.string().optional(),
  priceMin: z.number().int().nonnegative().optional(),
  priceMax: z.number().int().nonnegative().optional(),
  sortField: z
    .enum([
      PRODUCT_SORT_FIELDS.NAME,
      PRODUCT_SORT_FIELDS.PRICE,
      PRODUCT_SORT_FIELDS.CREATED_AT,
    ])
    .default(DEFAULT_SORT_FIELD),
  sortDirection: z
    .enum([SORT_DIRECTIONS.ASC, SORT_DIRECTIONS.DESC])
    .default(DEFAULT_SORT_DIRECTION),
});

export type CatalogSearch = z.infer<typeof catalogSearchSchema>;
