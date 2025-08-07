import { supabase } from '@shared/api/supabase-client';

import { mapCustomer } from './mapper';

export const getCustomer = async (customerId: string) => {
  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', customerId)
    .single()
    .throwOnError();

  return mapCustomer(customer);
};
