import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  type UseMutationResult,
} from '@tanstack/react-query';

import type { CustomerData, CustomerDataWithId } from './types';

import { getCustomer, updateCustomer } from './';

export const queryKey = {
  customerData: ['customerData'],
} as const;

export const useGetCustomer = (): {
  data: CustomerDataWithId | null;
} => {
  const { data } = useSuspenseQuery<CustomerDataWithId | null>({
    queryKey: queryKey.customerData,
    queryFn: getCustomer,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return { data };
};

export const useUpdateCustomer = (): UseMutationResult<
  CustomerData | null,
  Error,
  CustomerData
> => {
  const queryClient = useQueryClient();

  return useMutation<CustomerData | null, Error, CustomerData>({
    mutationFn: (data: CustomerData) => updateCustomer(data),
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
