import { RpcFunctions, supabase } from '@shared/api/supabase-client';

import {
  mapCategories,
  mapCategoriesTree,
  type Category,
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

export const getAllCategoriesTree = async (): Promise<CategoryTree[]> => {
  const { data } = await supabase
    .rpc(RpcFunctions.getAllCategoriesTree)
    .throwOnError();

  return mapCategoriesTree(data ?? []);
};
