import { RpcFunctions, supabase } from '@shared/api/supabase-client';

import {
  mapCategories,
  mapCategoriesTree,
  mapCategoryBreadcrumbs,
  type BreadcrumbItem,
  type Category,
  type CategoryDTO,
  type CategoryTree,
} from './mapper';

export const getRootCategories = async (): Promise<Category[]> => {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('order_hint', { ascending: true })
    .order('name', { ascending: true })
    .throwOnError();

  return mapCategories(categories ?? []);
};

export const getCategoriesTree = async (): Promise<CategoryTree[]> => {
  const { data } = await supabase
    .rpc(RpcFunctions.getCategoriesTree)
    .throwOnError();

  return mapCategoriesTree(data ?? []);
};

export const getCategoryBySlug = async (
  slug: string
): Promise<CategoryDTO | null> => {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
    .throwOnError();

  return data ?? null;
};

export const getCategoryBreadcrumbPaths = async (
  slug: string
): Promise<BreadcrumbItem[]> => {
  const { data } = await supabase
    .rpc(RpcFunctions.getCategoryBreadcrumbPaths, { cat_slug: slug })
    .throwOnError();

  return mapCategoryBreadcrumbs(data ?? []);
};
