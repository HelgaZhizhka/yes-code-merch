import { supabase } from '@shared/api/supabase-client';

import type { CatalogParams, ProductDTO } from './types';

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 12;
export const DEFAULT_SORT_FIELD = 'created_at';
export const DEFAULT_SORT_DIRECTION = 'desc';

export interface CatalogProductsResponse {
  data: ProductDTO[];
  count: number;
}

export const getCatalogProducts = async (
  params: CatalogParams
): Promise<CatalogProductsResponse> => {
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
    .from('products')
    .select(
      `
      id,
      name,
      slug,
      description,
      created_at,
      product_variants!inner(
        id,
        sku,
        price,
        currency,
        stock,
        is_master,
        product_images(
          url,
          alt,
          is_primary,
          sort_order
        )
      ),
      product_discounts(
        id,
        name,
        discount_type,
        discount_value,
        priority,
        valid_from,
        valid_to,
        is_active,
        variant_id,
        product_id
      ),
      product_categories!inner(
        category_id
      )
    `,
      { count: 'exact' }
    )
    .eq('is_published', true)
    .eq('product_variants.is_master', true)
    .in('product_categories.category_id', categoryIds);

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (priceMin !== undefined) {
    query = query.gte('product_variants.price', priceMin);
  }

  if (priceMax !== undefined) {
    query = query.lte('product_variants.price', priceMax);
  }

  const sortColumn =
    sortField === 'price' ? 'product_variants.price' : sortField;
  query = query.order(sortColumn, { ascending: sortDirection === 'asc' });

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
