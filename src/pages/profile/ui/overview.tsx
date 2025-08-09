import { useCustomer } from '@pages/profile/hooks';
import { AddressBlock } from '@pages/profile/ui/address-block';
import { PersonalBlock } from '@pages/profile/ui/personal-block';

export const Overview = () => {
  const customer = useCustomer();

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
    <div className="space-y-6 w-full max-w-xl mx-auto p-6">
      <PersonalBlock
        firstName={customer.firstName}
        lastName={customer.lastName}
        email={customer.email}
      />
      {addressBlocks.map(({ addresses, type }) => (
        <AddressBlock key={type} addresses={addresses} type={type} />
      ))}
    </div>
  );
};
