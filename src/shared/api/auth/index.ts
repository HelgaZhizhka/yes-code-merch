import type { Session, User } from '@supabase/supabase-js';

import type { Address } from '@shared/api/countries';
import type { Database } from '@shared/api/database.types';
import { supabase } from '@shared/api/supabase-client';
import { config } from '@shared/config';
import { ONBOARDING_STEPS, ROUTES } from '@shared/config/routes';

import { mapViewerDataToRpcArgs } from './mapper';
import type { AuthCredentials, ResetPasswordDTO, UpdateUserDTO } from './types';

export interface Viewer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shippingAddresses: Address[];
  useShippingAsBilling: boolean;
  billingAddresses: Address[];
  dateOfBirth: string;
  title?: string;
  company?: string;
}

export const RpcFunctions = {
  registration: 'complete_registration',
} as const;

export const AuthErrorMessages = {
  REGISTRATION_FAILED: 'User registration failed',
  ALREADY_REGISTERED: 'You are already registered. Please log in',
  UPDATE_FAILED: 'User update failed',
  NO_DATA: 'Returned no data',
} as const;

export const getSession = async (): Promise<Session | null> => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return session;
};

export const onAuthStateChange = (
  callback: (session: Session | null) => void
) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return subscription;
};

export const login = async ({
  email,
  password,
}: AuthCredentials): Promise<Session> => {
  const {
    data: { session },
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !session) {
    throw error || AuthErrorMessages.NO_DATA;
  }

  return session;
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
}: AuthCredentials): Promise<User> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${config.HOST}${ONBOARDING_STEPS.INIT}`,
    },
  });

  if (error || !user) {
    throw error || AuthErrorMessages.REGISTRATION_FAILED;
  }

  if (user && Array.isArray(user.identities) && user.identities.length === 0) {
    throw new Error(AuthErrorMessages.ALREADY_REGISTERED);
  }

  return user;
};

export const resetPassword = async ({
  email,
}: ResetPasswordDTO): Promise<void> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${config.HOST}${ROUTES.RESET}`,
  });

  if (error) {
    throw error;
  }
};

export const updateUser = async ({
  password,
}: UpdateUserDTO): Promise<User> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.updateUser({
    password,
  });

  if (error || !user) {
    throw error || AuthErrorMessages.UPDATE_FAILED;
  }

  return user;
};

export type CompleteRegistrationResult =
  Database['public']['Functions']['complete_registration']['Returns'];

export const completeRegistration = async (
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
