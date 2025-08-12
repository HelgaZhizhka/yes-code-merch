import { toast } from 'sonner';

import { useCustomer } from '@shared/customer';

export const useProfileForm = () => {
  const { data: customer, error } = useCustomer();

  if (error) {
    toast.error(error.message);
  }

  return customer;
};
