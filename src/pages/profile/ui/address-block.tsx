import type { AddressListProps } from '@pages/profile/interfaces';
import { AddressList } from '@pages/profile/ui/address-list';

import type { CustomerAddresses } from '@shared/interfaces';

export const AddressBlock = ({
  shippingAddresses,
  billingAddresses,
}: CustomerAddresses) => {
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
