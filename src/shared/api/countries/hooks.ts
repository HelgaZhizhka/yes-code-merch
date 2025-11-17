import { useSuspenseQuery } from '@tanstack/react-query';

import { mapCountry } from './mapper';
import type { Country, CountryRowDTO } from './types';

import { queryKey } from '../constants';

import { getCountries } from './';

export const useCountries = (): Country[] => {
  const { data } = useSuspenseQuery<CountryRowDTO[], Error, Country[]>({
    queryKey: queryKey.countries,
    queryFn: getCountries,
    select: mapCountry,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return data;
};
