import { useEffect, useState } from 'react';

import { getCountries, type Country } from '@shared/api/countries';

export const fetchCountries = async (): Promise<Country[]> => {
  return getCountries();
};

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const loadCountries = async (): Promise<void> => {
      try {
        const data = await fetchCountries();
        setCountries(data);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      }
    };

    loadCountries();
  }, []);

  return countries;
};
