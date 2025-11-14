import { supabase } from '@shared/api/supabase-client';

import { mapToCatalogProduct } from './mapper';
import type { CatalogResponse, GetCatalogParams } from './types';

/**
 * Get catalog products with filtering, sorting, and pagination
 * Uses nested queries to fetch variants, images, and discounts in a single request
 */
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

  // Build base query with nested relations
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

  // Filter by category through join table
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

  // Search by name
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  // Sorting (client-side for price-based sorting)
  if (sortBy !== 'price' && sortBy !== 'finalPrice') {
    query = query.order(sortBy, { ascending: sortDir === 'asc' });
  }

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  // Execute query
  const { data, error, count } = await query;

  if (error) throw error;

  // Map raw data to domain models
  const products = (data || [])
    .map(mapToCatalogProduct)
    .filter((p): p is NonNullable<typeof p> => p !== null);

  // Sort by price on client if needed
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
