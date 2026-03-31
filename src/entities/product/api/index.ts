import { supabase } from '@shared/api/supabase-client';

import type { CatalogParams, CatalogProductsViewResponse } from './types';

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_FIELD,
  SORT_DIRECTIONS,
} from '../lib';

export const getCatalogProducts = async (
  params: CatalogParams
): Promise<CatalogProductsViewResponse> => {
  const {
    categoryIds,
    search,
    priceMin,
    priceMax,
    page = DEFAULT_PAGE,
    pageSize = DEFAULT_PAGE_SIZE,
    sortField = DEFAULT_SORT_FIELD,
    sortDirection = DEFAULT_SORT_DIRECTION,
  } = params;

  let query = supabase
    .from('products_search')
    .select('*', { count: 'exact' })
    .in('category_id', categoryIds);

  if (search) {
    const escapedSearch = search.replaceAll(/[,%()\\]/g, String.raw`\$&`);
    query = query.or(
      `name.ilike.%${escapedSearch}%,description.ilike.%${escapedSearch}%`
    );
  }

  if (priceMin !== undefined) {
    query = query.gte('price', priceMin);
  }

  if (priceMax !== undefined) {
    query = query.lte('price', priceMax);
  }

  query = query.order(sortField, {
    ascending: sortDirection === SORT_DIRECTIONS.ASC,
  });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: data ?? [],
    count: count ?? 0,
  };
};
