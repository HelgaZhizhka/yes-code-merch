import { useQuery } from '@tanstack/react-query';

import type { GetCatalogParams } from './types';

import { getCatalogProducts } from './index';

export function useProducts(params: GetCatalogParams = {}) {
  return useQuery({
    queryKey: ['products', 'catalog', params],
    queryFn: () => getCatalogProducts(params),
    staleTime: 1000 * 60 * 5,
  });
}

export const productKeys = {
  all: ['products'] as const,
  catalog: (params?: GetCatalogParams) =>
    [...productKeys.all, 'catalog', params] as const,
  detail: (slug: string) => [...productKeys.all, 'detail', slug] as const,
};
