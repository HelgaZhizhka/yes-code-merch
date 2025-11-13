import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getCategoryBreadcrumbPaths } from './helpers';
import { mapCategories, mapCategoriesTree } from './mapper';
import type {
  BreadcrumbItem,
  Category,
  CategoryRowDTO,
  CategoryTree,
  CategoryTreeDTO,
} from './types';

import { queryKey } from '../constants';

import { getCategoriesTree, getRootCategories } from './';

export const useRootCategories = (): {
  data: Category[];
} => {
  const { data } = useSuspenseQuery<CategoryRowDTO[], Error, Category[]>({
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

export const useBreadcrumbs = (categoryPath?: string): BreadcrumbItem[] => {
  const { data: tree } = useCategoriesTree();

  return useMemo(() => {
    if (!categoryPath || !tree) return [];

    const segments = categoryPath.split('/').filter(Boolean);
    const targetSlug = segments.at(-1) ?? '';
    return getCategoryBreadcrumbPaths(tree, targetSlug);
  }, [categoryPath, tree]);
};
