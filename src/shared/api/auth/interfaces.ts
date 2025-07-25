export interface LoginDTO {
  email: string;
  password: string;
}

export interface SignUpDTO {
  email: string;
  password: string;
}

export interface Address {
  country: string;
  city: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  isDefault: boolean;
}

export interface Viewer {
  firstName: string;
  lastName: string;
  phone: string;
  shippingAddresses: Address[];
  useShippingAsBilling: boolean;
  billingAddresses: Address[];
  dateOfBirth: string;
  title?: string;
  company?: string;
}
