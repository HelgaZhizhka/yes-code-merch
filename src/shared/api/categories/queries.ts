import { queryOptions } from '@tanstack/react-query';

import { queryKey } from '../constants';

import { getCategoriesTree } from './';

export const categoriesTreeQueryOptions = () =>
  queryOptions({
    queryKey: queryKey.categoriesTree,
    queryFn: getCategoriesTree,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
  });
