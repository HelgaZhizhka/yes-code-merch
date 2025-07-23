import type { Session, User } from '@supabase/supabase-js';

import type { Database } from '@shared/api/database.types';
import { supabase } from '@shared/api/supabase-client';
import { config } from '@shared/config';
import { ONBOARDING_STEPS } from '@shared/config/routes';

import type { LoginDTO, SignUpDTO, Viewer } from './interfaces';
import { mapViewerDataToRpcArgs } from './mapper';

export const RpcFunctions = {
  registration: 'complete_registration',
} as const;

export const getSession = async (): Promise<Session | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const onAuthStateChange = (
  callback: (session: Session | null) => void
) => {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return data.subscription;
};

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

export const logout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error ?? new Error('No session');
  }
};

export const signUp = async ({ email, password }: SignUpDTO): Promise<User> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${config.HOST}${ONBOARDING_STEPS.INIT}`,
    },
  });

  console.log('SignUp Response:', {
    user: data?.user,

    session: data?.session,
    error,
  });

  if (error) {
    throw error;
  }

  const { user } = data;

  if (!user) {
    throw new Error('User registration failed');
  }

  if (user && Array.isArray(user.identities) && user.identities.length === 0) {
    throw new Error('You are already registered. Please log in');
  }

  return user;
};

type CompleteRegistrationResult =
  Database['public']['Functions']['complete_registration']['Returns'];

export const createViewer = async (
  viewer: Viewer
): Promise<CompleteRegistrationResult> => {
  const rpcArgs = mapViewerDataToRpcArgs(viewer);
  const { data, error } = await supabase.rpc(
    RpcFunctions.registration,
    rpcArgs
  );

  if (error) {
    throw error;
  }

  return data;
};
