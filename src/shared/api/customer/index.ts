import type { Database } from '@shared/api/database.types';
import { RpcFunctions, supabase } from '@shared/api/supabase-client';
import type {
  Address,
  AddressWithID,
  CustomerAddresses,
  CustomerDataWithID,
} from '@shared/interfaces';

import {
  mapAddress,
  mapCustomer,
  mapSetDefaultAddress,
  type AddressType,
} from './mapper';

export const getCustomer = async (): Promise<CustomerDataWithID | null> => {
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

export const updateCustomer = async (
  data: CustomerDataWithID
): Promise<CustomerDataWithID | null> => {
  const { data: customer } = await supabase
    .from('customers')
    .update({
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      date_of_birth: data.dateOfBirth,
      phone: data.phone,
    })
    .eq('user_id', data.id)
    .select('*')
    .maybeSingle()
    .throwOnError();

  if (!customer) {
    return null;
  }

  return mapCustomer(customer);
};

export const updateCustomerAddress = async (
  data: AddressWithID
): Promise<AddressWithID | null> => {
  const { data: addresses } = await supabase
    .from('addresses')
    .update({
      country: data.country,
      city: data.city,
      street_name: data.streetName,
      street_number: data.streetNumber,
      postal_code: data.postalCode,
    })
    .eq('id', data.id)
    .select('*')
    .maybeSingle()
    .throwOnError();

  if (!addresses) {
    return null;
  }

  return mapAddress([addresses])[0];
};

export const deleteCustomerAddress = async (
  addressId: string
): Promise<boolean> => {
  await supabase.from('addresses').delete().eq('id', addressId).throwOnError();

  return true;
};

export const addCustomerAddress = async ({
  data,
  addressType,
}: {
  data: Address;
  addressType: AddressType;
}): Promise<AddressWithID | null> => {
  const { data: addresses } = await supabase
    .from('addresses')
    .insert({
      country: data.country,
      city: data.city,
      street_name: data.streetName,
      street_number: data.streetNumber,
      postal_code: data.postalCode,
      is_shipping_address: addressType === 'shipping',
      is_billing_address: addressType === 'billing',
    })
    .select('*')
    .maybeSingle()
    .throwOnError();

  if (!addresses) return null;

  return mapAddress([addresses])[0];
};
