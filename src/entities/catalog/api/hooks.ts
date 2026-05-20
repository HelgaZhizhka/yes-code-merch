import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useCategoriesTree } from '@shared/api';

import { catalogQueries } from './queries';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../lib/constants';
import {
  createPaginationMeta,
  mapFromViewToCatalogProducts,
} from '../lib/mapper';
import {
  pickTopDiscountedRoot,
  type PickResult,
} from '../lib/pick-top-discounted-root';
import type {
  CatalogParams,
  CatalogProductsViewResponse,
  PaginatedCatalogProducts,
} from '../model/types';

export const catalogKeys = {
  all: ['catalog'] as const,
  list: (params: CatalogParams) => catalogQueries.list(params).queryKey,
  filterOptions: (categoryIds: string[]) =>
    catalogQueries.filterOptions(categoryIds).queryKey,
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

export const useCatalogProducts = (params: CatalogParams) => {
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;

  return useQuery({
    ...catalogQueries.list(params),
    select: (response) => selectPaginatedProducts(response, page, pageSize),
    placeholderData: (prev) => prev,
  });
};

export const useFilterOptions = (categoryIds: string[]) =>
  useSuspenseQuery(catalogQueries.filterOptions(categoryIds));

export const useDiscountedProducts = () =>
  useSuspenseQuery(catalogQueries.discounted());

export const useTopDiscountedCategory = (): PickResult | null => {
  const { data: products } = useDiscountedProducts();
  const { data: tree } = useCategoriesTree();

  return useMemo(() => pickTopDiscountedRoot(products, tree), [products, tree]);
};
