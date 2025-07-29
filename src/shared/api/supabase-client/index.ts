import { createClient } from '@supabase/supabase-js';

import type { Database } from '@shared/api/database.types';
import { config } from '@shared/config';

export type SupabaseResponse<T> = {
  error: Error | null;
  data: T | null | undefined;
};

export const AuthErrorMessages = {
  REGISTRATION_FAILED: 'User registration failed',
  ALREADY_REGISTERED: 'You are already registered. Please log in',
  UPDATE_FAILED: 'User update failed',
  NO_DATA: 'Returned no data',
} as const;

const { SUPABASE_URL, SUPABASE_ANON_KEY } = config;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

export const withErrorHandling = async <T>(
  promise: PromiseLike<SupabaseResponse<T>>
): Promise<T> => {
  const { data, error } = await promise;
  if (error) throw error;
  if (data === null || data === undefined)
    throw new Error(AuthErrorMessages.NO_DATA);
  return data;
};
