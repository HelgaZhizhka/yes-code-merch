import { useSuspenseQuery } from '@tanstack/react-query';

import {
  getCategoriesTree,
  getCategoryBreadcrumbPaths,
  getRootCategories,
} from '@shared/api/categories';

import type { BreadcrumbItem, Category, CategoryTree } from './mapper';

const queryKey = {
  rootCategories: ['rootCategories'],
  categoriesTree: ['categoriesTree'],
  breadcrumbs: ['breadcrumbs'],
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
    queryFn: getCategoriesTree,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
    retry: 1,
  });

  return { data };
};

export function useCategoryBreadcrumbPaths(slug: string) {
  return useSuspenseQuery<BreadcrumbItem[]>({
    queryKey: [...queryKey.breadcrumbs, slug],
    queryFn: () => getCategoryBreadcrumbPaths(slug),
    staleTime: 5 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}
