import { queryOptions } from '@tanstack/react-query';

import { getFilterOptions } from './filter-options';
import type { CatalogParams } from './types';

import { getCatalogProducts } from './index';

export const productQueries = {
  catalog: (params: CatalogParams) =>
    queryOptions({
      queryKey: ['products', 'catalog', params] as const,
      queryFn: () => getCatalogProducts(params),
      staleTime: 1000 * 60 * 5,
    }),
  filterOptions: (categoryIds: string[]) =>
    queryOptions({
      queryKey: ['products', 'filter-options', categoryIds] as const,
      queryFn: () => getFilterOptions(categoryIds),
      staleTime: 1000 * 60 * 60,
    }),
} as const;
