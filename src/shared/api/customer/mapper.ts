import type { Public } from '@shared/api/supabase-client';

import type { AddressWithID, CustomerDataWithID } from '@/shared/interfaces';

export type AddressType = 'shipping' | 'billing';
export type CustomerDTO = Public['Tables']['customers']['Row'];
export type AddressDTO = Public['Tables']['addresses']['Row'];

export const mapCustomer = (customer: CustomerDTO): CustomerDataWithID => ({
  id: customer.user_id,
  firstName: customer.first_name,
  lastName: customer.last_name,
  email: customer.email,
  phone: customer.phone,
  dateOfBirth: customer.date_of_birth,
});

export const mapAddress = (address: AddressDTO[]): AddressWithID[] => {
  return address.map((address) => ({
    id: address.id,
    country: address.country,
    city: address.city,
    streetName: address.street_name ?? '',
    streetNumber: address.street_number ?? '',
    postalCode: address.postal_code,
    isDefault: address.is_default_shipping || address.is_default_billing,
  }));
};

export const mapSetDefaultAddress = (
  addressId: string,
  addressType: AddressType
) => ({
  _address_id: addressId,
  _address_type: addressType,
});
