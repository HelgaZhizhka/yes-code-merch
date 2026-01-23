import { useSuspenseQuery } from '@tanstack/react-query';

import { createPaginationMeta, mapToCatalogProducts } from './mapper';
import type { CatalogParams, PaginatedCatalogProducts } from './types';

import type { CatalogProductsResponse } from './index';
import { getCatalogProducts } from './index';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 12;

export const productKeys = {
  all: ['products'],
  catalog: (params: CatalogParams) => ['products', 'catalog', params] as const,
} as const;

const selectPaginatedProducts = (
  response: CatalogProductsResponse,
  page: number,
  pageSize: number
): PaginatedCatalogProducts => {
  const data = mapToCatalogProducts(response.data);
  const meta = createPaginationMeta(response.count, page, pageSize);
  return { data, meta };
};

export const useProducts = (params: CatalogParams) => {
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;

  return useSuspenseQuery<
    CatalogProductsResponse,
    Error,
    PaginatedCatalogProducts
  >({
    queryKey: productKeys.catalog(params),
    queryFn: () => getCatalogProducts(params),
    select: (response) => selectPaginatedProducts(response, page, pageSize),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    gcTime: 7 * 24 * 60 * 60 * 1000,
    retry: 1,
  });
};
