import type {
  Address,
  Addresses,
  AddressType,
  AddressWithId,
} from '@shared/api';
import { supabase } from '@shared/api/supabase-client';

import { mapAddressFromDB, mapAddressToDB } from './mapper';

import { getCurrentUser } from '../helpers';

export const getAddresses = async (): Promise<Addresses> => {
  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .throwOnError();

  const rows = addresses ?? [];

  const shippingAddresses = mapAddressFromDB(
    rows.filter((address) => address.is_shipping_address)
  );
  const billingAddresses = mapAddressFromDB(
    rows.filter((address) => address.is_billing_address)
  );

  return { shippingAddresses, billingAddresses };
};

export const setDefaultAddress = async ({
  addressId,
  addressType,
}: {
  addressId: string;
  addressType: AddressType;
}): Promise<void> => {
  const user = await getCurrentUser();

  const { data: address, error: fetchError } = await supabase
    .from('addresses')
    .select('id')
    .eq('id', addressId)
    .eq('user_id', user.id)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  if (!address) {
    throw new Error('Address not found or does not belong to current user');
  }

  const defaultField =
    addressType === 'shipping' ? 'is_default_shipping' : 'is_default_billing';

  await supabase
    .from('addresses')
    .update({ [defaultField]: false })
    .eq('user_id', user.id)
    .eq(defaultField, true)
    .throwOnError();

  await supabase
    .from('addresses')
    .update({ [defaultField]: true })
    .eq('id', addressId)
    .eq('user_id', user.id)
    .throwOnError();
};

export const updateAddress = async (
  address: AddressWithId,
  addressType: AddressType
): Promise<AddressWithId | null> => {
  const dbData = mapAddressToDB(address, addressType);

  const { data: addresses } = await supabase
    .from('addresses')
    .update(dbData)
    .eq('id', address.id)
    .select('*')
    .single()
    .throwOnError();

  return mapAddressFromDB([addresses])[0];
};

export const deleteAddress = async (addressId: string): Promise<boolean> => {
  await supabase.from('addresses').delete().eq('id', addressId).throwOnError();

  return true;
};

export const createAddress = async ({
  address,
  addressType,
}: {
  address: Address;
  addressType: AddressType;
}): Promise<AddressWithId | null> => {
  const dbData = mapAddressToDB(address, addressType);

  const { data: addresses } = await supabase
    .from('addresses')
    .insert(dbData)
    .select('*')
    .single()
    .throwOnError();

  return mapAddressFromDB([addresses])[0];
};
