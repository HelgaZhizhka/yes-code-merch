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

// await supabase.rpc('complete_registration', {
//   first_name:       form.first_name,
//   last_name:        form.last_name,
//   date_of_birth:    form.date_of_birth,
//   phone:            form.phone,
//   company:          form.company,
//   ship_country:     form.shippingAddress.country,
//   ship_city:        form.shippingAddress.city,
//   ship_street:      form.shippingAddress.street,
//   ship_postal:      form.shippingAddress.postal_code,
//   use_ship_as_bill: form.useShippingAsBilling,
//   bill_country:     form.billingAddress?.country,
//   bill_city:        form.billingAddress?.city,
//   bill_street:      form.billingAddress?.street,
//   bill_postal:      form.billingAddress?.postal_code
// });
