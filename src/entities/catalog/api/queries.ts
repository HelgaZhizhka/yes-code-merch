import { queryOptions } from '@tanstack/react-query';

import type { CatalogParams } from '../model/types';

import {
  getCatalogProducts,
  getDiscountedProducts,
  getFilterOptions,
} from './';

export const catalogQueries = {
  list: (params: CatalogParams) =>
    queryOptions({
      queryKey: ['catalog', 'list', params] as const,
      queryFn: () => getCatalogProducts(params),
      staleTime: 1000 * 60 * 5,
    }),
  filterOptions: (categoryIds: string[]) =>
    queryOptions({
      queryKey: ['catalog', 'filter-options', categoryIds] as const,
      queryFn: () => getFilterOptions(categoryIds),
      staleTime: 1000 * 60 * 60,
    }),
  discounted: () =>
    queryOptions({
      queryKey: ['catalog', 'discounted'] as const,
      queryFn: () => getDiscountedProducts(),
      staleTime: 1000 * 60 * 5,
    }),
} as const;
