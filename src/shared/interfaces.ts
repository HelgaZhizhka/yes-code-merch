export interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
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

export interface Viewer extends PersonalData {
  shippingAddresses: Address[];
  billingAddresses?: Address[];
  useShippingAsBilling: boolean;
}

export interface Customer extends PersonalData {
  shippingAddresses: Address[];
  billingAddresses?: Address[];
}
