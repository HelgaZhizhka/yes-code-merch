import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  getAllCategoryIds,
  getCategoryBreadcrumbPaths,
  getCategoryBySlug,
} from './helpers';
import { mapCategories, mapCategoriesTree } from './mapper';
import type {
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

export const useCategoryData = (categoryPath?: string) => {
  const { data: tree } = useCategoriesTree();

  return useMemo(() => {
    if (!categoryPath || !tree) {
      return {
        breadcrumbs: [],
        category: null,
        categoryId: null,
        categoryIds: null,
      };
    }

    const segments = categoryPath.split('/').filter(Boolean);
    const targetSlug = segments.at(-1) ?? '';

    const category = getCategoryBySlug(tree, targetSlug);
    const breadcrumbs = getCategoryBreadcrumbPaths(tree, targetSlug);
    const categoryId = category?.id ?? null;
    const categoryIds = category ? getAllCategoryIds(category) : null;

    return { breadcrumbs, category, categoryId, categoryIds };
  }, [categoryPath, tree]);
};
