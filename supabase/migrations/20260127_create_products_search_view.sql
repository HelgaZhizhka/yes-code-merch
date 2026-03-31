-- Create a view for catalog search that includes master variant data
-- This allows sorting by price and other variant fields directly
-- SECURITY INVOKER ensures RLS policies are applied for the querying user

create or replace view products_search
with (security_invoker = true) as
select
  p.id,
  p.name,
  p.slug,
  p.description,
  p.created_at,
  p.is_published,
  p.product_type_id,
  -- Master variant fields (flattened for easy access)
  pv.id as variant_id,
  pv.sku,
  pv.price,
  pv.currency,
  pv.stock,
  pv.is_master,
  -- Primary image URL (for quick access)
  (
    select pi.url
    from product_images pi
    where pi.variant_id = pv.id
    order by pi.sort_order
    limit 1
  ) as primary_image_url,
  -- Product discounts as JSONB array (for applying discounts)
  (
    select jsonb_agg(jsonb_build_object(
      'id', pd.id,
      'name', pd.name,
      'discount_type', pd.discount_type,
      'discount_value', pd.discount_value,
      'priority', pd.priority,
      'valid_from', pd.valid_from,
      'valid_to', pd.valid_to,
      'is_active', pd.is_active,
      'variant_id', pd.variant_id,
      'product_id', pd.product_id
    ))
    from product_discounts pd
    where (pd.product_id = p.id or pd.variant_id = pv.id)
      and pd.is_active = true
  ) as product_discounts,
  -- Category ID (for filtering)
  pc.category_id
from products p
inner join product_variants pv
  on pv.product_id = p.id and pv.is_master = true
left join product_categories pc
  on pc.product_id = p.id
where p.is_published = true;

-- Create indexes for frequently filtered/sorted columns
create index if not exists idx_products_search_price on product_variants(price) where is_master = true;
create index if not exists idx_products_search_name on products(name);
create index if not exists idx_products_search_created_at on products(created_at);

-- Grant access to view
grant select on products_search to authenticated, anon;

-- Add comment
comment on view products_search is 'Flattened view of products with master variant data for catalog search, sorting, and filtering';
