import { RpcFunctions, supabase } from '@shared/api/supabase-client';

import {
  // mapCategories,
  // mapCategoriesTree,
  // mapCategoryBreadcrumbs,
  type BreadcrumbItemDTO,
  type CategoryDTO,
  // type Category,
  // type CategoryTree,
  type CategoryTreeDTO,
} from './mapper';

export const getRootCategories = async (): Promise<CategoryDTO[]> => {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('order_hint', { ascending: true })
    .order('name', { ascending: true })
    .throwOnError();

  return categories ?? [];
};

export const getCategoriesTree = async (): Promise<CategoryTreeDTO[]> => {
  const { data } = await supabase
    .rpc(RpcFunctions.getCategoriesTree)
    .throwOnError();
  return data;
};

export const getCategoryBreadcrumbPaths = async (
  slug: string
): Promise<BreadcrumbItemDTO[]> => {
  const { data } = await supabase
    .rpc(RpcFunctions.getCategoryBreadcrumbPaths, { cat_slug: slug })
    .throwOnError();

  return data ?? [];
};
