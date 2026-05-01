import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { createPaginationMeta, mapFromViewToCatalogProducts } from './mapper';
import { productQueries } from './queries';
import type {
  CatalogParams,
  CatalogProductsViewResponse,
  FilterOptions,
  PaginatedCatalogProducts,
} from './types';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../lib';

export const productKeys = {
  all: ['products'] as const,
  catalog: (params: CatalogParams) => productQueries.catalog(params).queryKey,
  filterOptions: (categoryIds: string[]) =>
    productQueries.filterOptions(categoryIds).queryKey,
} as const;

const selectPaginatedProducts = (
  response: CatalogProductsViewResponse,
  page: number,
  pageSize: number
): PaginatedCatalogProducts => {
  const data = mapFromViewToCatalogProducts(response.data);
  const meta = createPaginationMeta(response.count, page, pageSize);
  return { data, meta };
};

export const useProducts = (params: CatalogParams) => {
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;

  return useQuery({
    ...productQueries.catalog(params),
    select: (response) => selectPaginatedProducts(response, page, pageSize),
  });
};

export const useFilterOptions = (
  categoryIds: string[]
): { data: FilterOptions } => {
  const { data } = useSuspenseQuery(productQueries.filterOptions(categoryIds));
  return { data };
};
