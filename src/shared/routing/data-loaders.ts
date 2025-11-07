import type { QueryClient } from '@tanstack/react-query';

// import { getCategoryBreadcrumbPaths } from '@shared/api/categories';

export interface CategoryPageData {
  breadcrumbs: unknown;
}

export const loadCategoryPageData = async (
  queryClient: QueryClient,
  slug: string
): Promise<CategoryPageData> => {
  const breadcrumbs = await queryClient.ensureQueryData({
    queryKey: ['breadcrumbsPaths', slug],
    // queryFn: () => getCategoryBreadcrumbPaths(slug),
  });

  return {
    breadcrumbs,
  };
};
