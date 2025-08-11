import { AddressBlock } from '@pages/profile/ui/address-block';
import { PersonalBlock } from '@pages/profile/ui/personal-block';

import { useViewerId } from '@shared/viewer';

export const Overview = () => {
  const customerId = useViewerId();

  if (!customerId) {
    return null;
  }

  return (
    <div className="space-y-6 w-full max-w-xl mx-auto p-6">
      <PersonalBlock customerId={customerId} />
      <AddressBlock customerId={customerId} />
    </div>
  );
};
