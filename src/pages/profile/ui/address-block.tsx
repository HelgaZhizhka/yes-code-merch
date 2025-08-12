import type { AddressListProps } from '@pages/profile/interfaces';
import { AddressList } from '@pages/profile/ui/address-list';

import type { Customer } from '@shared/interfaces';

interface AddressBlockProps {
  shippingAddresses: Customer['shippingAddresses'];
  billingAddresses: Customer['billingAddresses'];
}

export const AddressBlock = ({
  shippingAddresses,
  billingAddresses,
}: AddressBlockProps) => {
  const addressBlocks: AddressListProps[] = [
    { addresses: shippingAddresses, type: 'Shipping' },
    { addresses: billingAddresses ?? [], type: 'Billing' },
  ];

  return (
    <>
      {addressBlocks.map(({ addresses, type }) => (
        <AddressList key={type} addresses={addresses} type={type} />
      ))}
    </>
  );
};
