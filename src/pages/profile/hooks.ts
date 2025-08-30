import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  useGetCustomer,
  useGetCustomerAddress,
  useSetDefaultAddress,
  useUpdateCustomer,
  type AddressType,
} from '@shared/api';
import { ROUTES } from '@shared/config/routes';
import {
  newPasswordSchema,
  personalSchema,
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
          toast.info(
            'Your password has been changed. Please use the new password to log in.'
          );
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
