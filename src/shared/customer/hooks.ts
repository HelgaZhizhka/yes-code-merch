import { useSuspenseQuery } from '@tanstack/react-query';

import { getCustomer } from '@shared/api/customer';
import type { Customer } from '@shared/interfaces';

export const useCustomer = (customerId: string) => {
  const { data } = useSuspenseQuery<Customer, Error, Customer>({
    queryKey: ['customer', customerId],
    queryFn: () => getCustomer(customerId),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return data;
};
