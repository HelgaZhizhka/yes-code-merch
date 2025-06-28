import type { Session } from '@supabase/supabase-js';

import { supabase } from '@shared/api/supabase-client';

import type {
  LoginDTO,
  RegistrationDTO,
  RegistrationResult,
} from '@/entities/session/interfaces';

export const login = async ({
  email,
  password,
}: LoginDTO): Promise<Session> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    throw error ?? new Error('No session');
  }

  return data.session;
};

export const createUser = async ({
  email,
  password,
}: RegistrationDTO): Promise<RegistrationResult> => {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw error;
  }

  return {
    session: data.session,
    user: data.user,
  };
};

export const logout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
};
