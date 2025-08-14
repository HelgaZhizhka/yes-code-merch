import { toast } from 'sonner';

import {
  useGetCustomer,
  useGetCustomerAddress,
  useSetDefaultAddress,
  type AddressType,
} from '@shared/api';
import { useViewerEmail } from '@shared/viewer';

export const useGetProfileData = () => {
  const { data: customer } = useGetCustomer();
  const { data: addresses } = useGetCustomerAddress();
  const email = useViewerEmail() ?? '';

  const personalData = {
    firstName: customer ? customer.firstName : '',
    lastName: customer ? customer.lastName : '',
    email: customer ? customer.email : email,
  };

  const addressesData = {
    shippingAddresses: addresses ? addresses.shippingAddresses : [],
    billingAddresses: addresses ? addresses.billingAddresses : [],
  };

  return { personalData, addressesData };
};

export const useSetDefaultProfileAddress = () => {
  const { mutate: setDefaultAddress, isPending } = useSetDefaultAddress();

  const handleSetAddressDefault = (
    addressId: string,
    addressType: AddressType
  ) => {
    setDefaultAddress(
      { addressId, addressType },
      {
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  return { handleSetAddressDefault, isPending };
};
