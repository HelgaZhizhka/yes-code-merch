import type { Database } from '@shared/api/database.types';
import { supabase } from '@shared/api/supabase-client';
import { RpcFunctions } from '@shared/config';
import type { CustomerAddresses, CustomerData } from '@shared/interfaces';

import {
  mapAddress,
  mapCustomer,
  mapSetDefaultAddress,
  type AddressType,
} from './mapper';

export const getCustomer = async (): Promise<CustomerData | null> => {
  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .maybeSingle()
    .throwOnError();

  if (!customer) {
    return null;
  }

  return mapCustomer(customer);
};

export const getCustomerAddress = async (): Promise<CustomerAddresses> => {
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

  return { shippingAddresses, billingAddresses };
};

export type SetDefaultAddressResult =
  Database['public']['Functions']['set_default_address']['Returns'];

export const setDefaultAddress = async ({
  addressId,
  addressType,
}: {
  addressId: string;
  addressType: AddressType;
}): Promise<SetDefaultAddressResult> => {
  const rpcArgs = mapSetDefaultAddress(addressId, addressType);
  const { data, error } = await supabase.rpc(
    RpcFunctions.setDefaultAddress,
    rpcArgs
  );

  if (error) {
    throw error;
  }

  return data;
};
