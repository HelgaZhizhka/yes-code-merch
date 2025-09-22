import { useSuspenseQuery } from '@tanstack/react-query';

import {
  getAllCategoriesTree,
  getRootCategories,
} from '@shared/api/categories';

import type { Category, CategoryTree } from './mapper';

const queryKey = {
  rootCategories: ['rootCategories'],
  categoriesTree: ['categoriesTree'],
} as const;

export const useRootCategories = (): {
  data: Category[];
} => {
  const { data } = useSuspenseQuery<Category[]>({
    queryKey: queryKey.rootCategories,
    queryFn: getRootCategories,
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
  const { data } = useSuspenseQuery<CategoryTree[]>({
    queryKey: queryKey.categoriesTree,
    queryFn: getAllCategoriesTree,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
    retry: 1,
  });

  return { data };
};
