import type { Session } from '@supabase/supabase-js';

import { supabase } from '@shared/api/supabase-client';

import type { LoginDTO } from '../model/login-dto';

export const login = async ({
  email,
  password,
}: LoginDTO): Promise<Session> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    throw error || new Error('No session');
  }

  return data.session;
};
