import { supabase } from '@shared/api/supabase-client';
import type { Customer } from '@shared/interfaces';

import { mapAddress, mapCustomer } from './mapper';

export const getCustomer = async (): Promise<Customer | null> => {
  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .maybeSingle()
    .throwOnError();

  if (!customer) {
    return null;
  }

  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .throwOnError();

  const shippingAddresses = mapAddress(
    addresses.filter((address) => address.is_shipping_address)
  );
  const billingAddresses = mapAddress(
    addresses.filter((address) => address.is_billing_address)
  );

  return mapCustomer(customer, shippingAddresses, billingAddresses);
};
