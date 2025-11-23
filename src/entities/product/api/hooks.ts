import { useSuspenseQuery } from '@tanstack/react-query';

import { mapToCatalogProducts } from './mapper';
import type { CatalogProduct, GetCatalogParams, ProductDTO } from './types';

import { getCatalogProducts } from './index';

export const productKeys = {
  all: ['products'],
  catalog: (params: GetCatalogParams) =>
    ['products', 'catalog', params] as const,
} as const;

export const useProducts = (params: GetCatalogParams) => {
  return useSuspenseQuery<ProductDTO[], Error, CatalogProduct[]>({
    queryKey: productKeys.catalog(params),
    queryFn: () => getCatalogProducts(params),
    select: mapToCatalogProducts,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    gcTime: 7 * 24 * 60 * 60 * 1000,
    retry: 1,
  });
};
