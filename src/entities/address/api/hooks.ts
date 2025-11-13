import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  type UseMutationResult,
} from '@tanstack/react-query';

import type { Address, AddressType, AddressWithId, Addresses } from './types';

import {
  createAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from './';

export const queryKey = {
  addresses: ['addresses'],
} as const;

export const useGetAddressess = (): {
  data: Addresses | null;
} => {
  const { data } = useSuspenseQuery<Addresses>({
    queryKey: queryKey.addresses,
    queryFn: getAddresses,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return { data };
};

export const useSetDefaultAddress = (): UseMutationResult<
  unknown,
  Error,
  { addressId: string; addressType: AddressType }
> => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
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
      queryClient.invalidateQueries({ queryKey: queryKey.addresses });
    },
  });
};

export const useUpdateAddress = (): UseMutationResult<
  AddressWithId | null,
  Error,
  { address: AddressWithId; addressType: AddressType }
> => {
  const queryClient = useQueryClient();

  return useMutation<
    AddressWithId | null,
    Error,
    { address: AddressWithId; addressType: AddressType }
  >({
    mutationFn: ({ address, addressType }) =>
      updateAddress(address, addressType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.addresses });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Updating address failed:', error.message);
      }
    },
  });
};

export const useDeleteAddress = (): UseMutationResult<
  boolean,
  Error,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (addressId) => deleteAddress(addressId),
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Deleting address failed:', error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.addresses });
    },
  });
};

export const useCreateAddress = (): UseMutationResult<
  AddressWithId | null,
  Error,
  { address: Address; addressType: AddressType }
> => {
  const queryClient = useQueryClient();

  return useMutation<
    AddressWithId | null,
    Error,
    { address: Address; addressType: AddressType }
  >({
    mutationFn: ({ address, addressType }) =>
      createAddress({ address, addressType }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.addresses });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Adding address failed:', error.message);
      }
    },
  });
};
