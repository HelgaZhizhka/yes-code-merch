import type { Session, User } from '@supabase/supabase-js';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface SignUpDTO {
  email: string;
  password: string;
}

export interface SignUpResponse {
  session: Session | null;
  user: User | null;
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
