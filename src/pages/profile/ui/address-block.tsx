import { useCustomer } from '@shared/customer';

import { AddressList } from '@/pages/profile/ui/address-list';

type AddressBlockProps = {
  customerId: string;
};

export const AddressBlock = ({ customerId }: AddressBlockProps) => {
  const customer = useCustomer(customerId);

  const addressBlocks = [
    {
      addresses: customer.shippingAddresses,
      type: 'Shipping',
    },
    {
      addresses: customer.billingAddresses ?? [],
      type: 'Billing',
    },
  ];

  return (
    <>
      {addressBlocks.map(({ addresses, type }) => (
        <AddressList key={type} addresses={addresses} type={type} />
      ))}
    </>
  );
};
