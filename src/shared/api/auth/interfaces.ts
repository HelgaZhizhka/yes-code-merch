export interface LoginDTO {
  email: string;
  password: string;
}

export interface SignUpDTO {
  email: string;
  password: string;
}

export interface ResetPasswordDTO {
  email: string;
}

export interface UpdateUserDTO {
  password?: string;
}

export interface Address {
  country: string;
  city: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  isDefault: boolean;
  title?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface Viewer {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  shippingAddresses: Address[];
  useShippingAsBilling: boolean;
  billingAddresses?: Address[];
  title?: string;
  dateOfBirth?: string;
  company?: string;
}

export type RegisterDTO = SignUpDTO & Viewer;
