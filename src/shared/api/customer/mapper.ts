import type { Database } from '@shared/api/database.types';

import type { Address, Customer } from '@/shared/interfaces';

export type CustomerDTO = Database['public']['Tables']['customers']['Row'];
export type AddressDTO = Database['public']['Tables']['addresses']['Row'];

export const mapCustomer = (
  customer: CustomerDTO,
  shippingAddresses: Address[],
  billingAddresses: Address[]
): Customer => ({
  firstName: customer.first_name,
  lastName: customer.last_name,
  email: customer.email,
  phone: customer.phone,
  dateOfBirth: customer.date_of_birth,
  shippingAddresses,
  billingAddresses,
});

export const mapAddress = (address: AddressDTO[]): Address[] => {
  return address.map((address) => ({
    country: address.country,
    city: address.city,
    streetName: address.street_name ?? '',
    streetNumber: address.street_number ?? '',
    postalCode: address.postal_code,
    isDefault: address.is_default_shipping || address.is_default_billing,
  }));
};
