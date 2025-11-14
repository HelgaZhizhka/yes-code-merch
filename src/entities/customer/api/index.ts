import { getCurrentUser } from '@shared/api/helpers';
import { supabase } from '@shared/api/supabase-client';

import { mapCustomerFromDB, mapCustomerToDB } from './mapper';
import type { CustomerData, CustomerRowDTO } from './types';

export const getCustomer = async (): Promise<CustomerRowDTO | null> => {
  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .maybeSingle()
    .throwOnError();

  return customer ?? null;
};

export const updateCustomer = async (
  data: CustomerData
): Promise<CustomerData | null> => {
  const user = await getCurrentUser();
  const dbData = mapCustomerToDB({ ...data, id: user.id });

  const { data: customer } = await supabase
    .from('customers')
    .upsert(dbData, {
      onConflict: 'user_id',
    })
    .select('*')
    .single()
    .throwOnError();

  return mapCustomerFromDB(customer);
};
