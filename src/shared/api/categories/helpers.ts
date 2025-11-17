import type { BreadcrumbItem, CategoryTree } from './types';

export const getCategoryBreadcrumbPaths = (
  tree: CategoryTree[],
  targetSlug: string
): BreadcrumbItem[] => {
  const findPath = (
    nodes: CategoryTree[],
    slug: string,
    path: CategoryTree[] = []
  ): CategoryTree[] | null => {
    for (const node of nodes) {
      if (node.slug === slug) {
        return [...path, node];
      }

      if (node.children.length > 0) {
        const result = findPath(node.children, slug, [...path, node]);
        if (result) return result;
      }
    }
    return null;
  };

  const path = findPath(tree, targetSlug);

  if (!path) return [];

  return path.map((category, index) => ({
    path: path
      .slice(0, index + 1)
      .map((c) => c.slug)
      .join('/'),
    name: category.name,
    isCurrent: index === path.length - 1,
  }));
};
