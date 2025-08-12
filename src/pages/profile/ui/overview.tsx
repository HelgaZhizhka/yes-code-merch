import { useProfileForm } from '@pages/profile/hooks';
import { AddressBlock } from '@pages/profile/ui/address-block';
import { PersonalBlock } from '@pages/profile/ui/personal-block';

import { useViewerEmail } from '@shared/viewer';

export const Overview = () => {
  const customer = useProfileForm();
  const email = useViewerEmail() ?? '';

  const personalData = {
    firstName: customer ? customer.firstName : '',
    lastName: customer ? customer.lastName : '',
    email: customer ? customer.email : email,
  };

  const addressesData = {
    shippingAddresses: customer ? customer.shippingAddresses : [],
    billingAddresses: customer ? customer.billingAddresses : [],
  };

  return (
    <div className="space-y-6 w-full max-w-xl mx-auto p-6">
      <PersonalBlock {...personalData} />
      <AddressBlock {...addressesData} />
    </div>
  );
};
