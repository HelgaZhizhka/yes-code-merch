import type { Database } from '@shared/api/database.types';

import type { AddressWithID, Customer } from '@/shared/interfaces';

export type CustomerDTO = Database['public']['Tables']['customers']['Row'];
export type AddressDTO = Database['public']['Tables']['addresses']['Row'];

export const mapCustomer = (
  customer: CustomerDTO,
  shippingAddresses: AddressWithID[],
  billingAddresses: AddressWithID[]
): Customer => ({
  firstName: customer.first_name,
  lastName: customer.last_name,
  email: customer.email,
  phone: customer.phone,
  dateOfBirth: customer.date_of_birth,
  shippingAddresses,
  billingAddresses,
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
