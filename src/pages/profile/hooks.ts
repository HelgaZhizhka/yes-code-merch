import { useCustomer } from '@shared/customer';

export const useProfileForm = () => {
  const { data: customer } = useCustomer();

  return customer;
};
