import { supabase } from '@shared/api/supabase-client';

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_FIELD,
  DISCOUNTED_FETCH_HARD_LIMIT,
  DISCOUNTED_LIMIT,
  SORT_DIRECTIONS,
} from '../lib/constants';
import { mapFromViewToCatalogProducts } from '../lib/mapper';
import type {
  CatalogParams,
  CatalogProduct,
  CatalogProductsViewResponse,
  FilterOptions,
} from '../model/types';

export const getCatalogProducts = async (
  params: CatalogParams
): Promise<CatalogProductsViewResponse> => {
  const {
    categoryIds,
    search,
    priceMin,
    priceMax,
    colors,
    sizes,
    page = DEFAULT_PAGE,
    pageSize = DEFAULT_PAGE_SIZE,
    sortField = DEFAULT_SORT_FIELD,
    sortDirection = DEFAULT_SORT_DIRECTION,
  } = params;

  let query = supabase.from('products_search').select('*', { count: 'exact' });

  if (categoryIds && categoryIds.length > 0) {
    query = query.overlaps('category_ids', categoryIds);
  }

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

  if (colors && colors.length > 0) {
    query = query.overlaps('colors', colors);
  }

  if (sizes && sizes.length > 0) {
    query = query.overlaps('sizes', sizes);
  }

  query = query.order(sortField, {
    ascending: sortDirection === SORT_DIRECTIONS.ASC,
  });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, count } = await query.throwOnError();

  return {
    data: data ?? [],
    count: count ?? 0,
  };
};

export const getDiscountedProducts = async (): Promise<CatalogProduct[]> => {
  const { data } = await supabase
    .from('products_search')
    .select('*')
    .not('product_discounts', 'is', null)
    .order('created_at', { ascending: false })
    .range(0, DISCOUNTED_FETCH_HARD_LIMIT - 1)
    .throwOnError();

  return mapFromViewToCatalogProducts(data ?? [])
    .filter((product) => product.hasDiscount)
    .slice(0, DISCOUNTED_LIMIT);
};

export const getFilterOptions = async (
  categoryIds: string[]
): Promise<FilterOptions> => {
  const { data } = await supabase
    .rpc('get_catalog_filter_options', { p_category_ids: categoryIds })
    .single()
    .throwOnError();

  return {
    colors: data?.colors ?? [],
    sizes: data?.sizes ?? [],
    priceMin: data?.price_min ?? 0,
    priceMax: data?.price_max ?? 0,
    hasSizeFilter: data?.has_size_filter ?? false,
  };
};
