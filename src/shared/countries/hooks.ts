import { useSuspenseQuery } from '@tanstack/react-query';

import { getCountries } from '@shared/api/countries';

export const useCountries = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  return data;
};
