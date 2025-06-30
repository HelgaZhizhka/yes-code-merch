import { supabase } from '@shared/api/supabase-client';

import type { Customer } from '../interfaces';
import { mapDataToRpcArgs } from '../model/mapper';

export const createCustomer = async (data: Customer) => {
  const rpcArgs = mapDataToRpcArgs(data);
  const { error } = await supabase.rpc('complete_registration', rpcArgs);
  if (error) {
    throw error;
  }
};
