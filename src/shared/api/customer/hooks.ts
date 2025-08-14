import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  type UseMutationResult,
} from '@tanstack/react-query';

import type { CustomerAddresses, CustomerData } from '@shared/interfaces';

import type { AddressType } from './mapper';

import {
  getCustomer,
  getCustomerAddress,
  setDefaultAddress,
  type SetDefaultAddressResult,
} from './';

const queryKey = {
  customerData: ['customerData'],
  customerAddresses: ['customerAddresses'],
};

export const useGetCustomer = (): {
  data: CustomerData | null;
} => {
  const { data } = useSuspenseQuery<CustomerData | null>({
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
