import { supabase } from '@shared/api/supabase-client';

import type {
  CatalogParams,
  CatalogResult,
  PaginationMeta,
  SortField,
  SortOrder,
} from './types';

// Default values
const DEFAULT_PAGE_SIZE = 12;
const DEFAULT_SORT_FIELD: SortField = 'createdAt';
const DEFAULT_SORT_ORDER: SortOrder = 'desc';

// Calculate pagination range for Supabase
const getPaginationRange = (
  page: number,
  pageSize: number
): { from: number; to: number } => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return { from, to };
};

// Get total count of products for pagination
const getCatalogProductsCount = async (
  params: CatalogParams
): Promise<number> => {
  const { categoryIds, search, priceRange, inStock } = params;

  let query = supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('is_published', true)
    .eq('product_variants.is_master', true);

  // Apply filters (same as main query)
  if (categoryIds && categoryIds.length > 0) {
    query = query.in('product_categories.category_id', categoryIds);
  }

  if (search) {
    const searchPattern = `%${search}%`;
    query = query.or(
      `name.ilike.${searchPattern},description.ilike.${searchPattern}`
    );
  }

  if (priceRange?.min !== undefined) {
    query = query.gte('product_variants.price', priceRange.min);
  }

  if (priceRange?.max !== undefined) {
    query = query.lte('product_variants.price', priceRange.max);
  }

  if (inStock) {
    query = query.gt('product_variants.stock', 0);
  }

  const { count, error } = await query;

  if (error) throw error;

  return count ?? 0;
};

export const getCatalogProducts = async (
  params: CatalogParams
): Promise<CatalogResult> => {
  const {
    categoryIds,
    search,
    priceRange,
    inStock,
    sortBy = DEFAULT_SORT_FIELD,
    sortOrder = DEFAULT_SORT_ORDER,
    pagination = { page: 1, pageSize: DEFAULT_PAGE_SIZE },
  } = params;

  // 1. Build base query
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
    `
    )
    .eq('is_published', true)
    .eq('product_variants.is_master', true);

  // 2. Apply category filter
  if (categoryIds && categoryIds.length > 0) {
    query = query.in('product_categories.category_id', categoryIds);
  }

  // 3. Apply search
  if (search) {
    const searchPattern = `%${search}%`;
    query = query.or(
      `name.ilike.${searchPattern},description.ilike.${searchPattern}`
    );
  }

  // 4. Apply price filter
  if (priceRange?.min !== undefined) {
    query = query.gte('product_variants.price', priceRange.min);
  }

  if (priceRange?.max !== undefined) {
    query = query.lte('product_variants.price', priceRange.max);
  }

  // 5. Apply stock filter
  if (inStock) {
    query = query.gt('product_variants.stock', 0);
  }

  // 6. Apply sorting
  const ascending = sortOrder === 'asc';
  switch (sortBy) {
    case 'price': {
      query = query.order('product_variants.price', { ascending });
      break;
    }
    case 'name': {
      query = query.order('name', { ascending });
      break;
    }
    case 'createdAt': {
      query = query.order('created_at', { ascending });
      break;
    }
    default: {
      query = query.order('created_at', { ascending });
      break;
    }
  }

  // 7. Apply pagination
  const { from, to } = getPaginationRange(pagination.page, pagination.pageSize);
  query = query.range(from, to);

  // 8. Execute query
  const { data, error } = await query;

  if (error) throw error;

  // 9. Get total count for pagination metadata
  const totalItems = await getCatalogProductsCount(params);

  // 10. Build pagination metadata
  const totalPages = Math.ceil(totalItems / pagination.pageSize);
  const paginationMeta: PaginationMeta = {
    currentPage: pagination.page,
    pageSize: pagination.pageSize,
    totalItems,
    totalPages,
    hasNextPage: pagination.page < totalPages,
    hasPreviousPage: pagination.page > 1,
  };

  return {
    products: data ?? [],
    pagination: paginationMeta,
  };
};
