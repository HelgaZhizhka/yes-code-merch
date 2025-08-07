import { supabase } from '@shared/api/supabase-client';
import type { Customer } from '@shared/interfaces';

import { mapCustomer, mapAddress } from './mapper';

export const getCustomer = async (customerId: string): Promise<Customer> => {
  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', customerId)
    .single()
    .throwOnError();

  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', customerId)
    .throwOnError();

  const shippingAddresses = mapAddress(
    addresses.filter((address) => address.is_shipping_address)
  );
  const billingAddresses = mapAddress(
    addresses.filter((address) => address.is_billing_address)
  );

  return mapCustomer(customer, shippingAddresses, billingAddresses);
};
