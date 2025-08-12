import { useSuspenseQuery } from '@tanstack/react-query';

import { getCustomer } from '@shared/api/customer';
import type { Customer } from '@shared/interfaces';

export const useGetCustomer = (): {
  data: Customer | null;
} => {
  const { data } = useSuspenseQuery<Customer | null>({
    queryKey: ['customer'],
    queryFn: getCustomer,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return { data };
};
