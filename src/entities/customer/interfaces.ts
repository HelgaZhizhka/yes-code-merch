export interface Customer {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phone?: string;
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
