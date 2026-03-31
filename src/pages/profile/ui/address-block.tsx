import { AddressList } from '@pages/profile/ui/address-list';

import type { Addresses, AddressListProps } from '@entities/address';

export const AddressBlock = ({
  shippingAddresses,
  billingAddresses,
}: Addresses): React.JSX.Element => {
  const addressBlocks: AddressListProps[] = [
    { addresses: shippingAddresses, addressType: 'shipping' },
    { addresses: billingAddresses ?? [], addressType: 'billing' },
  ];

  return (
    <>
      {addressBlocks.map(({ addresses, addressType }) => (
        <AddressList
          key={addressType}
          addresses={addresses}
          addressType={addressType}
        />
      ))}
    </>
  );
};
