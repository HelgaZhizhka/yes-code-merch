import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  useDeleteCustomerAddress,
  useGetCustomer,
  useGetCustomerAddress,
  useSetDefaultAddress,
  useUpdateCustomer,
  useUpdateCustomerAddress,
  type AddressType,
} from '@shared/api';
import { ROUTES } from '@shared/config/routes';
import {
  addressSchema,
  newPasswordSchema,
  personalSchema,
  type AddressFormType,
  type NewPasswordFormType,
  type PersonalFormType,
} from '@shared/lib/schemas';
import { useUpdateUser, useViewerEmail } from '@shared/viewer';

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

export const useChangePasswordForm = () => {
  const { mutate: updateUser, isPending } = useUpdateUser();
  const navigate = useNavigate();
  const form = useForm<NewPasswordFormType>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: NewPasswordFormType) => {
    updateUser(
      { password: data.password },
      {
        onSuccess: () => {
          toast.success('Password changed successfully');
          navigate({ to: ROUTES.PROFILE });
        },
        onError: (error) => toast.error(error.message),
      }
    );
  };

  return { form, onSubmit, isPending };
};

export const useEditPersonalForm = () => {
  const { data: customer } = useGetCustomer();
  const navigate = useNavigate();
  const { mutate: updateCustomer, isPending } = useUpdateCustomer();

  const form = useForm<PersonalFormType>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      email: customer?.email ?? '',
      firstName: customer?.firstName ?? '',
      lastName: customer?.lastName ?? '',
      dateOfBirth: customer?.dateOfBirth ?? '',
      phone: customer?.phone ?? '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: PersonalFormType) => {
    updateCustomer(
      { id: customer?.id ?? '', ...data },
      {
        onSuccess: () => {
          toast.success('Personal data changed successfully');
          navigate({ to: ROUTES.PROFILE });
        },
        onError: (error) => toast.error(error.message),
      }
    );
  };

  return { form, onSubmit, isPending };
};

export const useEditAddressForm = () => {
  const { addressId } = useParams({ strict: false });
  const { data: addresses } = useGetCustomerAddress();
  const navigate = useNavigate();
  const { mutate: updateCustomerAddress, isPending } =
    useUpdateCustomerAddress();

  const currentAddress =
    addresses?.shippingAddresses.find((a) => a.id === addressId) ||
    addresses?.billingAddresses?.find((a) => a.id === addressId) ||
    null;

  const form = useForm<AddressFormType>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: currentAddress?.country ?? '',
      city: currentAddress?.city ?? '',
      streetName: currentAddress?.streetName ?? '',
      streetNumber: currentAddress?.streetNumber ?? '',
      postalCode: currentAddress?.postalCode ?? '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: AddressFormType) => {
    updateCustomerAddress(
      { id: addressId, ...data },
      {
        onSuccess: () => {
          toast.success('Address updated successfully');
          navigate({ to: ROUTES.PROFILE });
        },
        onError: (error) => toast.error(error.message),
      }
    );
  };

  return { form, onSubmit, isPending };
};

export const useDeleteProfileAddress = () => {
  const { mutate: deleteAddress, isPending: isDeleting } =
    useDeleteCustomerAddress();

  const handleDeleteProfileAddress = (addressId: string) => {
    deleteAddress(addressId, {
      onSuccess: () => {
        toast.success('Address deleted successfully');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return { handleDeleteProfileAddress, isDeleting };
};
