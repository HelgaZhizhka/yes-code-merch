import type { Country } from '@shared/api/countries';
import { createAppStore } from '@shared/lib/create-app-store';

export interface CountriesState {
  countries: Country[];
}

export const useCountriesStore = createAppStore<CountriesState>(
  (set) => ({
    countries: [],

    setCountries: (countries: Country[]) => set({ countries }),
  }),
  { name: 'countries' }
);

export const useCountries = () => useCountriesStore((state) => state.countries);
