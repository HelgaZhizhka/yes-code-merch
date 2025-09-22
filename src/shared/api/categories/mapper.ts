import type { Public } from '@shared/api/supabase-client';

export type CategoryDTO = Public['Tables']['categories']['Row'];
type CategoryTreeDTO =
  Public['Functions']['get_all_categories_tree']['Returns'][0];
type BreadcrumbsDTO =
  Public['Functions']['get_category_breadcrumb_paths']['Returns'][0];

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  orderHint: string;
}

export type CategoryTree = Category & {
  depth: number;
  rootId: string;
  rootName: string;
  rootSlug: string;
  children: CategoryTree[];
};

export type BreadcrumbItem = {
  path: string;
  name: string;
  isCurrent: boolean;
};

export const mapCategories = (categories: CategoryDTO[]): Category[] => {
  return categories.map(({ id, name, slug, parent_id, order_hint }) => ({
    id,
    name,
    slug,
    parentId: parent_id,
    orderHint: order_hint,
  }));
};

export const mapCategoriesTree = (rows: CategoryTreeDTO[]): CategoryTree[] => {
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
  rows: BreadcrumbsDTO[]
): BreadcrumbItem[] => {
  return rows.map(({ path, name, is_current }) => ({
    path,
    name,
    isCurrent: is_current,
  }));
};
