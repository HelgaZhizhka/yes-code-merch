import { supabase } from '@shared/api/supabase-client';

import { mapCountry } from './mapper';
import type { Country } from './types';

export const getCountries = async (): Promise<Country[]> => {
  const { data } = await supabase
    .from('countries')
    .select('iso_code, name, region')
    .order('name', { ascending: true })
    .throwOnError();

  return mapCountry(data);
};
