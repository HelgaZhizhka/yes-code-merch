import type { BreadcrumbItem, CategoryTree } from './types';

const findCategoryPath = (
  nodes: CategoryTree[],
  slug: string,
  path: CategoryTree[] = []
): CategoryTree[] | null => {
  for (const node of nodes) {
    if (node.slug === slug) {
      return [...path, node];
    }

    if (node.children.length > 0) {
      const result = findCategoryPath(node.children, slug, [...path, node]);
      if (result) return result;
    }
  }
  return null;
};

export const getCategoryBySlug = (
  tree: CategoryTree[],
  slug: string
): CategoryTree | null => {
  const path = findCategoryPath(tree, slug);
  return path ? (path.at(-1) ?? null) : null;
};

export const getAllCategoryIds = (category: CategoryTree): string[] => {
  const ids = [category.id];

  if (category.children.length > 0) {
    for (const child of category.children) {
      ids.push(...getAllCategoryIds(child));
    }
  }

  return ids;
};

export const getCategoryBreadcrumbPaths = (
  tree: CategoryTree[],
  targetSlug: string
): BreadcrumbItem[] => {
  const path = findCategoryPath(tree, targetSlug);

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
