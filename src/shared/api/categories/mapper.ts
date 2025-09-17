import type { Public } from '@shared/api/supabase-client';
import type { Category } from '@shared/interfaces';

export type CategoryDTO = Public['Tables']['categories']['Row'];

export const mapCategories = (categories: CategoryDTO[]): Category[] => {
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    parentId: category.parent_id,
    orderHint: category.order_hint,
  }));
};
