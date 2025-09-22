import type { Public } from '@shared/api/supabase-client';

type CategoryDTO = Public['Tables']['categories']['Row'];
type CategoryTreeDTO =
  Public['Functions']['get_all_categories_tree']['Returns'][0];

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  orderHint: string;
}

export interface CategoryTree {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  orderHint: string;
  depth: number;
  rootId: string;
  rootName: string;
  rootSlug: string;
  children: CategoryTree[];
}

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
  // Создаем map для быстрого доступа к категориям по id
  const categoryMap = new Map<string, CategoryTree>();
  const rootCategories: CategoryTree[] = [];

  // Сначала создаем все узлы
  rows.forEach((row) => {
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
  });

  // Строим иерархию
  rows.forEach((row) => {
    const category = categoryMap.get(row.id);
    if (!category) return;

    if (row.parent_id && categoryMap.has(row.parent_id)) {
      // Это дочерняя категория
      const parent = categoryMap.get(row.parent_id);
      if (parent) {
        parent.children.push(category);
      }
    } else {
      // Это корневая категория
      rootCategories.push(category);
    }
  });

  return rootCategories;
};
