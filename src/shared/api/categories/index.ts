import { supabase } from '@shared/api/supabase-client';
import type { Category } from '@shared/interfaces';

import { mapCategories } from './mapper';

export const getRootCategories = async (): Promise<Category[] | null> => {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('order_hint', { ascending: true })
    .order('name', { ascending: true })
    .throwOnError();

  if (!categories) {
    return null;
  }

  return mapCategories(categories);
};
