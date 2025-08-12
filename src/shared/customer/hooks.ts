import { useSuspenseQuery } from '@tanstack/react-query';

import { getCustomer } from '@shared/api/customer';
import type { Customer } from '@shared/interfaces';

export const useCustomer = (): {
  data: Customer | null;
  error: Error | null;
} => {
  const { data, error } = useSuspenseQuery<Customer | null, Error, Customer>({
    queryKey: ['customer'],
    queryFn: getCustomer,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return { data, error };
};
