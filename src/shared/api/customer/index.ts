import type { CustomerData, CustomerDataWithId } from '@shared/api';
import { supabase } from '@shared/api/supabase-client';

import { mapCustomerFromDB, mapCustomerToDB } from './mapper';

import { getCurrentUser } from '../helpers';

export const getCustomer = async (): Promise<CustomerDataWithId | null> => {
  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .maybeSingle()
    .throwOnError();

  return customer ? mapCustomerFromDB(customer) : null;
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
