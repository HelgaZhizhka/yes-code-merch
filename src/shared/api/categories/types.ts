import type { Public } from '@shared/api/supabase-client';

export type CategoryRowDTO = Public['Tables']['categories']['Row'];
export type CategoryTreeDTO =
  Public['Functions']['get_all_categories_tree']['Returns'][0];

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
