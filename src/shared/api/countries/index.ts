import { supabase } from '@shared/api/supabase-client';

import type { CountryRowDTO } from './types';

export const getCountries = async (): Promise<CountryRowDTO[]> => {
  const { data } = await supabase
    .from('countries')
    .select('iso_code, name, region')
    .order('name', { ascending: true })
    .throwOnError();

  return data ?? [];
};
