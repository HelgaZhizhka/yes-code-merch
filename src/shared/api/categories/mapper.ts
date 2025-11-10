import type {
  BreadcrumbItem,
  BreadcrumbItemDTO,
  Category,
  CategoryDTO,
  CategoryTree,
  CategoryTreeDTO,
} from './types';

export const mapCategories = (
  categories: readonly CategoryDTO[]
): Category[] => {
  return categories.map(({ id, name, slug, parent_id, order_hint }) => ({
    id,
    name,
    slug,
    parentId: parent_id,
    orderHint: order_hint,
  }));
};

export const mapCategoriesTree = (
  rows: readonly CategoryTreeDTO[]
): CategoryTree[] => {
  const categoryMap = new Map<string, CategoryTree>();
  const rootCategories: CategoryTree[] = [];

  for (const row of rows) {
    const category: CategoryTree = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      parentId: row.parent_id,
      orderHint: row.order_hint,
      depth: row.depth,
      rootId: row.root_id,
      rootName: row.root_name,
      rootSlug: row.root_slug,
      children: [],
    };
    categoryMap.set(row.id, category);
  }

  for (const row of rows) {
    const category = categoryMap.get(row.id);
    if (!category) continue;

    if (row.parent_id && categoryMap.has(row.parent_id)) {
      const parent = categoryMap.get(row.parent_id);

      if (parent) {
        parent.children.push(category);
      }
    } else {
      rootCategories.push(category);
    }
  }

  return rootCategories;
};

export const mapCategoryBreadcrumbs = (
  rows: readonly BreadcrumbItemDTO[]
): BreadcrumbItem[] => {
  return rows.map(({ path, name, is_current }) => ({
    path,
    name,
    isCurrent: is_current,
  }));
};
