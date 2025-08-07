import type { Database } from '@shared/api/database.types';

import type { Viewer } from '@/shared/interfaces';

export type CustomerDTO = Database['public']['Tables']['customers']['Row'];
export const mapCustomer = (customer: CustomerDTO): Viewer => ({
  firstName: customer.first_name,
  lastName: customer.last_name,
  email: customer.email,
  phone: customer.phone,
  dateOfBirth: customer.date_of_birth,
  shippingAddresses: [],
  billingAddresses: [],
  useShippingAsBilling: false,
});
