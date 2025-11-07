import type {
  Address,
  AddressInsertDTO,
  AddressRowDTO,
  AddressType,
  AddressWithId,
} from '@shared/api';

export const mapAddressToDB = (
  address: Address,
  addressType: AddressType
): AddressInsertDTO => {
  return {
    country: address.country,
    city: address.city,
    street_name: address.streetName,
    street_number: address.streetNumber,
    postal_code: address.postalCode,
    is_default_shipping: addressType === 'shipping' ? address.isDefault : false,
    is_default_billing: addressType === 'billing' ? address.isDefault : false,
    is_billing_address: addressType === 'billing',
    is_shipping_address: addressType === 'shipping',
  };
};

export const mapAddressFromDB = (address: AddressRowDTO[]): AddressWithId[] => {
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
