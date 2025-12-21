export {
  useCreateAddress,
  useDeleteAddress,
  useGetAddressess,
  useSetDefaultAddress,
  useUpdateAddress,
} from './api/hooks';
export type {
  Address,
  Addresses,
  AddressListProps,
  AddressType,
} from './api/types';
export {
  addressSchema,
  defaultAddress,
  type AddressFormType,
} from './lib/schema';
export { AddressForm } from './ui/address-form';
