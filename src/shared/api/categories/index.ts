import { RpcFunctions, supabase } from '@shared/api/supabase-client';

import type { CategoryDTO, CategoryTreeDTO } from './types';

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
