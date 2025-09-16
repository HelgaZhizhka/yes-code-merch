import type { Public } from '@shared/api/supabase-client';
import { supabase } from '@shared/api/supabase-client';

export type Category = Public['Tables']['categories']['Row'];

export async function getRootCategories() {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('order_hint', { ascending: true })
    .order('name', { ascending: true })
    .throwOnError();

  if (!data) {
    return null;
  }

  return data as Category[];
}
