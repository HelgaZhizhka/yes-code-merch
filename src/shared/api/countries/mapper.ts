import type { Country, CountryRowDTO } from './types';

export const mapCountry = (countries: readonly CountryRowDTO[]): Country[] => {
  return countries.map((country) => ({
    code: country.iso_code,
    name: country.name,
  }));
};
