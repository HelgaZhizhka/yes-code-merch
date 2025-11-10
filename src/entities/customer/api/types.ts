import type { Public } from '@shared/api/supabase-client';

export type CustomerRowDTO = Public['Tables']['customers']['Row'];
export type CustomerInsertDTO = Public['Tables']['customers']['Insert'];

export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  title?: string | null;
  company?: string | null;
}

export interface CustomerDataWithId extends CustomerData {
  id: string;
}
