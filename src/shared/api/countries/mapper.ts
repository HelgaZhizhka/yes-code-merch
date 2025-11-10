import type { Country, CountryRow } from './types';

export const mapCountry = (country: CountryRow[]): Country[] => {
  return country.map((country) => ({
    code: country.iso_code,
    name: country.name,
  }));
};
