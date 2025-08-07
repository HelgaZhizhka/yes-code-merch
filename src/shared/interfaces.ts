export interface Viewer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shippingAddresses: Address[];
  useShippingAsBilling: boolean;
  dateOfBirth: string;
  billingAddresses?: Address[];
  title?: string;
  company?: string;
}

export interface Address {
  country: string;
  city: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  isDefault?: boolean;
}
