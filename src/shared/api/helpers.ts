import type { User } from '@supabase/supabase-js';

import { supabase } from '@shared/api/supabase-client';

export const getCurrentUser = async (): Promise<User> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(`Authentication error: ${error.message}`);
  }

  if (!user) {
    throw new Error('User not authenticated');
  }

  return user;
};
