import { supabase } from '@shared/api/supabase-client';

import type { FilterOptions } from './types';

export const getFilterOptions = async (
  categoryIds: string[]
): Promise<FilterOptions> => {
  const { data, error } = await supabase
    .rpc('get_catalog_filter_options', { p_category_ids: categoryIds })
    .single();

  if (error) throw error;

  return {
    colors: data?.colors ?? [],
    sizes: data?.sizes ?? [],
    priceMin: data?.price_min ?? 0,
    priceMax: data?.price_max ?? 0,
    hasSizeFilter: data?.has_size_filter ?? false,
  };
};
