import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  type UseMutationResult,
} from '@tanstack/react-query';

import type {
  AddressWithID,
  CustomerAddresses,
  CustomerDataWithID,
} from '@shared/interfaces';

import type { AddressType } from './mapper';

import {
  getCustomer,
  getCustomerAddress,
  setDefaultAddress,
  updateCustomer,
  updateCustomerAddress,
  type SetDefaultAddressResult,
} from './';

const queryKey = {
  customerData: ['customerData'],
  customerAddresses: ['customerAddresses'],
};

export const useGetCustomer = (): {
  data: CustomerDataWithID | null;
} => {
  const { data } = useSuspenseQuery<CustomerDataWithID | null>({
    queryKey: queryKey.customerData,
    queryFn: getCustomer,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return { data };
};

export const useGetCustomerAddress = (): {
  data: CustomerAddresses | null;
} => {
  const { data } = useSuspenseQuery<CustomerAddresses>({
    queryKey: queryKey.customerAddresses,
    queryFn: getCustomerAddress,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return { data };
};

export const useSetDefaultAddress = (): UseMutationResult<
  SetDefaultAddressResult,
  Error,
  { addressId: string; addressType: AddressType }
> => {
  const queryClient = useQueryClient();

  return useMutation<
    SetDefaultAddressResult,
    Error,
    { addressId: string; addressType: AddressType }
  >({
    mutationFn: ({ addressId, addressType }) =>
      setDefaultAddress({ addressId, addressType }),
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Setting default address failed:', error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.customerAddresses });
    },
  });
};

export const useUpdateCustomer = (): UseMutationResult<
  CustomerDataWithID | null,
  Error,
  CustomerDataWithID
> => {
  const queryClient = useQueryClient();

  return useMutation<CustomerDataWithID | null, Error, CustomerDataWithID>({
    mutationFn: (data: CustomerDataWithID) => updateCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.customerData });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Updating customer failed:', error.message);
      }
    },
  });
};

export const useUpdateCustomerAddress = (): UseMutationResult<
  AddressWithID | null,
  Error,
  AddressWithID
> => {
  const queryClient = useQueryClient();

  return useMutation<AddressWithID | null, Error, AddressWithID>({
    mutationFn: (data: AddressWithID) => updateCustomerAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.customerAddresses });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Updating address failed:', error.message);
      }
    },
  });
};
