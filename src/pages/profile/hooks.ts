import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  addressSchema,
  useCreateAddress,
  useDeleteAddress,
  useGetAddressess,
  useSetDefaultAddress,
  useUpdateAddress,
  type AddressFormType,
  type AddressType,
} from '@entities/address';
import {
  personalSchema,
  useGetCustomer,
  useUpdateCustomer,
  type PersonalFormType,
} from '@entities/customer';

import { ROUTES } from '@shared/config/routes';
import {
  changePasswordSchema,
  type ChangePasswordFormType,
} from '@shared/lib/schemas';
import { useChangePassword, useViewerEmail } from '@shared/viewer';

export const useGetProfileData = () => {
  const { data: customer } = useGetCustomer();
  const { data: addresses } = useGetAddressess();
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
  const { mutate: changePassword, isPending } = useChangePassword();
  const navigate = useNavigate();
  const form = useForm<ChangePasswordFormType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: ChangePasswordFormType) => {
    changePassword(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          toast.success('Password changed successfully');
          form.reset();
          navigate({ to: ROUTES.PROFILE });
        },
        onError: (error) => {
          if (error.message.includes('incorrect')) {
            form.setError('currentPassword', {
              message: 'Current password is incorrect',
            });
            toast.error(error.message);
          } else {
            toast.error(error.message);
          }
        },
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
      { ...data },
      {
        onSuccess: () => {
          toast.success('Personal data changed successfully');
          if (customer?.email && customer?.email !== data.email) {
            toast.info(
              'Your email has been changed. Please use the new email to log in.'
            );
          }
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
  const { data: addresses } = useGetAddressess();
  const navigate = useNavigate();
  const { mutate: updateAddress, isPending } = useUpdateAddress();
  const currentAddress =
    addresses?.shippingAddresses.find((address) => address.id === addressId) ||
    addresses?.billingAddresses?.find((address) => address.id === addressId) ||
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
    updateAddress(
      { address: { ...data, id: addressId }, addressType: 'shipping' },
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
  const { mutate: deleteAddress, isPending } = useDeleteAddress();
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

  return { handleDeleteProfileAddress, isPending };
};

export const useAddAddressForm = () => {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const addressType = search.type as AddressType;
  const { mutate: createAddress, isPending } = useCreateAddress();

  const form = useForm<AddressFormType>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: '',
      city: '',
      streetName: '',
      streetNumber: '',
      postalCode: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (address: AddressFormType) => {
    createAddress(
      { address, addressType },
      {
        onSuccess: () => {
          toast.success('Address added successfully');
          navigate({ to: ROUTES.PROFILE });
        },
        onError: (error) => toast.error(error.message),
      }
    );
  };

  return { form, onSubmit, isPending };
};
