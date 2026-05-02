import { z } from 'zod';

import {
  CATALOG_VIEWS,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_FIELD,
  DEFAULT_VIEW,
  PRODUCT_SORT_FIELDS,
  SORT_DIRECTIONS,
} from './constants';

export const catalogSearchSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(12),
  search: z.string().optional(),
  priceMin: z.number().int().nonnegative().optional(),
  priceMax: z.number().int().nonnegative().optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  view: z
    .enum([CATALOG_VIEWS.GRID_4, CATALOG_VIEWS.GRID_3])
    .default(DEFAULT_VIEW),
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
