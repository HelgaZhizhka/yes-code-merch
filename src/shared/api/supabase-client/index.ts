import { createClient } from '@supabase/supabase-js';

import type { Database } from '@shared/api/database.types';
import { config } from '@shared/config';

export type Public = Database['public'];

const { SUPABASE_URL, SUPABASE_ANON_KEY } = config;

export const RpcFunctions = {
  getCategoriesTree: 'get_all_categories_tree',
} as const;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
