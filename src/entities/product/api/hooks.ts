import { useQuery } from '@tanstack/react-query';

import type { GetCatalogParams } from './types';

import { getCatalogProducts } from './index';

/**
 * React Query hook for fetching catalog products
 * @param params - Query parameters (filters, pagination, sorting)
 * @returns React Query result with products and pagination
 */
export function useProducts(params: GetCatalogParams = {}) {
  return useQuery({
    queryKey: ['products', 'catalog', params],
    queryFn: () => getCatalogProducts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Query keys factory for products
 */
export const productKeys = {
  all: ['products'] as const,
  catalog: (params?: GetCatalogParams) =>
    [...productKeys.all, 'catalog', params] as const,
  detail: (slug: string) => [...productKeys.all, 'detail', slug] as const,
};
