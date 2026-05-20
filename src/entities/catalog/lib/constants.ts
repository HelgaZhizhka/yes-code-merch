export const CATALOG_SORT_FIELDS = {
  NAME: 'name',
  PRICE: 'price',
  CREATED_AT: 'created_at',
} as const;

export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 12;
export const DEFAULT_SORT_FIELD = CATALOG_SORT_FIELDS.CREATED_AT;
export const DEFAULT_SORT_DIRECTION = SORT_DIRECTIONS.DESC;

export const DISCOUNTED_LIMIT = 6;
export const DISCOUNTED_FETCH_HARD_LIMIT = 200;
