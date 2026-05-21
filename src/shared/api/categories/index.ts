import { RpcFunctions, supabase } from '@shared/api/supabase-client';

import type { CategoryTreeDTO } from './types';

export const getCategoriesTree = async (): Promise<CategoryTreeDTO[]> => {
  const { data } = await supabase
    .rpc(RpcFunctions.getCategoriesTree)
    .throwOnError();
  return data ?? [];
};
