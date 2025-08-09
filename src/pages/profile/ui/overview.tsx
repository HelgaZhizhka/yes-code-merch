import { Link } from '@tanstack/react-router';
import { Pencil } from 'lucide-react';

import { useCustomer } from '@pages/profile/hooks';
import { AddressBlock } from '@pages/profile/ui/address-block';

import { ROUTES } from '@shared/config/routes';
import { getLinkButtonClass } from '@shared/ui/link-button';

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
    <div className="space-y-6 w-full max-w-lg mx-auto p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-4">
          <h2>
            {customer.firstName} {customer.lastName}
          </h2>
          <p className="text-base text-muted-foreground">{customer.email}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            to={ROUTES.PROFILE_PERSONAL}
            className={getLinkButtonClass('outline', 'lg')}
          >
            <Pencil className="mr-1.5" />
            Edit profile
          </Link>
          <Link
            to={ROUTES.PROFILE_SECRET}
            className={getLinkButtonClass('outline', 'lg')}
          >
            Change password
          </Link>
        </div>
      </div>
      {addressBlocks.map(({ addresses, type }) => (
        <AddressBlock key={type} addresses={addresses} type={type} />
      ))}
    </div>
  );
};
