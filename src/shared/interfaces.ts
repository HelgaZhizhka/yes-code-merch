export interface CustomerData {
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

export interface CustomerDataWithID extends CustomerData {
  id: string;
}

export interface AddressWithID extends Address {
  id: string;
}

export interface Viewer extends CustomerData {
  shippingAddresses: Address[];
  billingAddresses?: Address[];
  useShippingAsBilling: boolean;
}

export interface CustomerAddresses {
  shippingAddresses: AddressWithID[];
  billingAddresses?: AddressWithID[];
}
