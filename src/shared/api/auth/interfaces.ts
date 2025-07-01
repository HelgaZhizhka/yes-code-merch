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

export interface Viewer {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  company?: string;
  shippingAddress: {
    country: string;
    city: string;
    street: string;
    postal_code: string;
  };
  useShippingAsBilling: boolean;
  billingAddress?: {
    country: string;
    city: string;
    street: string;
    postal_code: string;
  };
}

export type RegisterDTO = SignUpDTO & Viewer;
