import { useQuery } from '@tanstack/react-query';

import { getCustomer } from '@shared/api/customer';
import { useViewerId } from '@shared/viewer';

export const useCustomer = () => {
  const customerId = useViewerId();

  return useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => getCustomer(customerId as string),
    enabled: !!customerId,
  });
};
