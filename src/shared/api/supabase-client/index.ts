import { createClient } from '@supabase/supabase-js';

import type { Database } from '@shared/api/database.types';
import { config } from '@shared/config';

const { SUPABASE_URL, SUPABASE_ANON_KEY } = config;

export const RpcFunctions = {
  registration: 'complete_registration',
  setDefaultAddress: 'set_default_address',
  clearDefaultAddress: 'clear_default_address',
} as const;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
