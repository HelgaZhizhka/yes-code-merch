import type { Database } from '@shared/api/database.types';

export interface Country {
  code: string;
  name: string;
}

export type ContryRow = Database['public']['Tables']['countries']['Row'];
export const mapCountry = (country: ContryRow[]): Country[] => {
  return country.map((country) => ({
    code: country.iso_code,
    name: country.name,
  }));
};
