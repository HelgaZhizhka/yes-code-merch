import { useSuspenseQuery } from '@tanstack/react-query';

import { getCustomer } from '@shared/api/customer';
import { useViewerId } from '@shared/viewer';

export const useCustomer = () => {
  const customerId = useViewerId();

  if (!customerId) throw new Error('No customer id');

  const { data } = useSuspenseQuery({
    queryKey: ['customer'],
    queryFn: () => getCustomer(customerId),
  });
  return data;
};
