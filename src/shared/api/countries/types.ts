import type { Public } from '@shared/api/supabase-client';

export interface Country {
  code: string;
  name: string;
}

export type CountryRow = Public['Tables']['countries']['Row'];
