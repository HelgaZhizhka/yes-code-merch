import type { Public } from '@shared/api/supabase-client';

export interface Address {
  country: string;
  city: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  isDefault?: boolean;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  title?: string | null;
}

export interface AddressWithId extends Address {
  id: string;
}

export interface Addresses {
  shippingAddresses: AddressWithId[];
  billingAddresses?: AddressWithId[];
}

export type AddressType = 'shipping' | 'billing';

export type AddressRowDTO = Public['Tables']['addresses']['Row'];
export type AddressInsertDTO = Public['Tables']['addresses']['Insert'];

export interface AddressListProps {
  addresses: AddressWithId[];
  addressType: AddressType;
}
