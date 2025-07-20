import { useEffect, useState } from 'react';

import { getCountries, type Country } from '@shared/api/countries';

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const loadCountries = async (): Promise<void> => {
      try {
        const data = await getCountries();
        setCountries(data);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      }
    };

    loadCountries();
  }, []);

  return countries;
};
