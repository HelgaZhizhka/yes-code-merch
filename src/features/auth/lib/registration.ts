import type { Session, User } from '@supabase/supabase-js';

import { supabase } from '@shared/api/supabase-client';

import type { RegistrationDTO } from '../model/registration-dto';

export interface RegistrationResult {
  session: Session | null;
  user: User | null;
}

export const registration = async ({
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
