import { useSuspenseQuery } from '@tanstack/react-query';

import {
  getCategoriesTree,
  getCategoryBreadcrumbPaths,
  getRootCategories,
} from '@shared/api/categories';

import {
  mapCategories,
  mapCategoriesTree,
  mapCategoryBreadcrumbs,
  type BreadcrumbItem,
  type BreadcrumbItemDTO,
  type Category,
  type CategoryDTO,
  type CategoryTree,
  type CategoryTreeDTO,
} from './mapper';

const queryKey = {
  rootCategories: ['rootCategories'],
  categoriesTree: ['categoriesTree'],
} as const;

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

export function useCategoryBreadcrumbPaths(slug: string) {
  return useSuspenseQuery<BreadcrumbItemDTO[], Error, BreadcrumbItem[]>({
    queryKey: ['breadcrumbsPaths', slug],
    queryFn: () => getCategoryBreadcrumbPaths(slug),
    select: mapCategoryBreadcrumbs,
    staleTime: 5 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}
