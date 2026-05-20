import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  getAllCategoryIds,
  getCategoryBreadcrumbPaths,
  getCategoryBySlug,
} from './helpers';
import { mapCategoriesTree } from './mapper';
import { categoriesTreeQueryOptions } from './queries';
import type { CategoryTree } from './types';

export const useCategoriesTree = (): {
  data: CategoryTree[];
} => {
  const { data } = useSuspenseQuery({
    ...categoriesTreeQueryOptions(),
    select: mapCategoriesTree,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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
        tree: [],
      };
    }

    const segments = categoryPath.split('/').filter(Boolean);
    const targetSlug = segments.at(-1) ?? '';

    const category = getCategoryBySlug(tree, targetSlug);
    const breadcrumbs = getCategoryBreadcrumbPaths(tree, targetSlug);
    const categoryId = category?.id ?? null;
    const categoryIds = category ? getAllCategoryIds(category) : null;

    return { breadcrumbs, category, categoryId, categoryIds, tree };
  }, [categoryPath, tree]);
};
