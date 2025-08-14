import { useGetProfileData } from '@pages/profile/hooks';

import { AddressBlock } from './address-block';
import { PersonalBlock } from './personal-block';

export const Overview = () => {
  const { personalData, addressesData } = useGetProfileData();

  return (
    <div className="space-y-6 w-full max-w-xl mx-auto p-6">
      <PersonalBlock {...personalData} />
      <AddressBlock {...addressesData} />
    </div>
  );
};
