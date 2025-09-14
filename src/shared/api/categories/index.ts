import type { Public } from '@shared/api/supabase-client';
import { supabase } from '@shared/api/supabase-client';

export type Category = Public['Tables']['categories']['Row'];

export type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  depth: number;
};

export async function getRootCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('order_hint', { ascending: true })
    .order('name', { ascending: true });
  if (error) throw error;
  return data as Category[];
}
