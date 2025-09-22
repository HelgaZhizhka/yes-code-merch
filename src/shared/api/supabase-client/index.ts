import { createClient } from '@supabase/supabase-js';

import type { Database } from '@shared/api/database.types';
import { config } from '@shared/config';

export type Public = Database['public'];

const { SUPABASE_URL, SUPABASE_ANON_KEY } = config;

export const RpcFunctions = {
  registration: 'complete_registration',
  setDefaultAddress: 'set_default_address',
  clearDefaultAddress: 'clear_default_address',
  getCategoriesTree: 'get_all_categories_tree',
  getCategoryBreadcrumbPaths: 'get_category_breadcrumb_paths',
} as const;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
