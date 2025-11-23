import { supabase } from '@shared/api/supabase-client';

import type { GetCatalogParams, ProductDTO } from './types';

export const getCatalogProducts = async (
  params: GetCatalogParams
): Promise<ProductDTO[]> => {
  const { categoryIds } = params;

  const query = supabase
    .from('products')
    .select(
      `
      id,
      name,
      slug,
      description,
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
    .eq('product_variants.is_master', true)
    .in('product_categories.category_id', categoryIds);

  const { data, error } = await query;

  if (error) throw error;

  return data ?? [];
};
