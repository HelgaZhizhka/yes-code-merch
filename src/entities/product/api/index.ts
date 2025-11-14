import { supabase } from '@shared/api/supabase-client';

import { mapToCatalogProduct } from './mapper';
import type { CatalogResponse, GetCatalogParams } from './types';

export async function getCatalogProducts(
  params: GetCatalogParams = {}
): Promise<CatalogResponse> {
  const {
    categoryId,
    search,
    page = 1,
    pageSize = 24,
    sortBy = 'created_at',
    sortDir = 'asc',
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
        discount_type,
        discount_value,
        priority,
        valid_from,
        valid_to,
        is_active,
        variant_id,
        product_id
      )
    `,
      { count: 'exact' }
    )
    .eq('is_published', true)
    .eq('product_variants.is_master', true);

  if (categoryId) {
    query = query
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
      .eq('product_categories.category_id', categoryId);
  }

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }
  if (sortBy !== 'price' && sortBy !== 'finalPrice') {
    query = query.order(sortBy, { ascending: sortDir === 'asc' });
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);
  const { data, error, count } = await query;

  if (error) throw error;

  const products = (data || [])
    .map(mapToCatalogProduct)
    .filter((p): p is NonNullable<typeof p> => p !== null);

  if (sortBy === 'price') {
    products.sort((a, b) => {
      const diff = a.originalPrice - b.originalPrice;
      return sortDir === 'asc' ? diff : -diff;
    });
  } else if (sortBy === 'finalPrice') {
    products.sort((a, b) => {
      const diff = a.finalPrice - b.finalPrice;
      return sortDir === 'asc' ? diff : -diff;
    });
  }

  return {
    products,
    pagination: {
      page,
      pageSize,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / pageSize),
    },
  };
}
