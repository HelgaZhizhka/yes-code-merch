import { useSuspenseQuery } from '@tanstack/react-query';

import { queryKey } from '../constants';

import { getCountries } from './';

export const useCountries = () => {
  const { data } = useSuspenseQuery({
    queryKey: queryKey.countries,
    queryFn: getCountries,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  return data;
};
