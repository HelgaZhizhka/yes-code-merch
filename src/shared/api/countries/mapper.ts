import type { Public } from '@shared/api/supabase-client';

export interface Country {
  code: string;
  name: string;
}

export type ContryRow = Public['Tables']['countries']['Row'];
export const mapCountry = (country: ContryRow[]): Country[] => {
  return country.map((country) => ({
    code: country.iso_code,
    name: country.name,
  }));
};
