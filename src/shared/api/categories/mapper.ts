import type { Public } from '@shared/api/supabase-client';
import type { Category } from '@shared/interfaces';

export type CategoryDTO = Public['Tables']['categories']['Row'];

export const mapCategories = (categories: CategoryDTO[]): Category[] => {
  return categories.map(({ id, name, slug, parent_id, order_hint }) => ({
    id,
    name,
    slug,
    parentId: parent_id,
    orderHint: order_hint,
  }));
};
