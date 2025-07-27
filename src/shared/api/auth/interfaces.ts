import type { Address } from '../countries/interfaces';

export interface Viewer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shippingAddresses: Address[];
  useShippingAsBilling: boolean;
  billingAddresses: Address[];
  dateOfBirth: string;
  title?: string;
  company?: string;
}
