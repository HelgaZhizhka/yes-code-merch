import type { Session } from '@supabase/supabase-js';

import type { Database } from '@shared/api/database.types';
import { supabase } from '@shared/api/supabase-client';
import { RpcFunctions } from '@shared/config';

import type {
  LoginDTO,
  RegisterDTO,
  SignUpDTO,
  SignUpResponse,
  Viewer,
} from './interfaces';
import { mapViewerDataToRpcArgs } from './mapper';

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
    throw error;
  }
};

export const signUp = async ({
  email,
  password,
}: SignUpDTO): Promise<SignUpResponse> => {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw error;
  }

  const { session, user } = data;

  return {
    session,
    user,
  };
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

export const register = async (dto: RegisterDTO): Promise<Session> => {
  const { email, password } = dto;
  const { session, user } = await signUp({
    email,
    password,
  });

  if (!session || !user) throw new Error('Registration failed at signUp');

  await createViewer({
    ...dto,
  });

  return session;
};
