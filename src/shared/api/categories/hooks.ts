import { useSuspenseQuery } from '@tanstack/react-query';

import type {
  Category,
  CategoryDTO,
  CategoryTree,
  CategoryTreeDTO,
} from '@shared/api';
import { getCategoriesTree, getRootCategories } from '@shared/api/categories';

import { mapCategories, mapCategoriesTree } from './mapper';

import { queryKey } from '../constants';

export const useRootCategories = (): {
  data: Category[];
} => {
  const { data } = useSuspenseQuery<CategoryDTO[], Error, Category[]>({
    queryKey: queryKey.rootCategories,
    queryFn: getRootCategories,
    select: mapCategories,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
    retry: 1,
  });
  return { data };
};

export const useCategoriesTree = (): {
  data: CategoryTree[];
} => {
  const { data } = useSuspenseQuery<CategoryTreeDTO[], Error, CategoryTree[]>({
    queryKey: queryKey.categoriesTree,
    queryFn: getCategoriesTree,
    select: mapCategoriesTree,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
    retry: 1,
  });

  return { data };
};
