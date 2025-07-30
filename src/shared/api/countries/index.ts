import { supabase } from '@shared/api/supabase-client';

import { mapCountry, type Country } from './mapper';

export interface Address {
  country: string;
  city: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  isDefault: boolean;
}

export const getCountries = async (): Promise<Country[]> => {
  const { data } = await supabase
    .from('countries')
    .select('iso_code, name, region')
    .order('name', { ascending: true })
    .throwOnError();

  return mapCountry(data);
};
