-- Extend products_search view with attribute aggregates for filtering.
-- Removes the LEFT JOIN on product_categories that produced duplicate rows
-- when a product belonged to multiple categories.

-- ⚠️ DEPLOYMENT GATE: Apply together with entity-layer Task 6 (getCatalogProducts
-- switch from .in('category_id') to .overlaps('category_ids')). Applying this
-- migration alone leaves getCatalogProducts broken — column was renamed.

drop view if exists products_search cascade;

create view products_search
with (security_invoker = true) as
select
  p.id,
  p.name,
  p.slug,
  p.description,
  p.created_at,
  p.is_published,
  p.product_type_id,
  pv.id as variant_id,
  pv.sku,
  pv.price,
  pv.currency,
  pv.stock,
  pv.is_master,
  (
    select pi.url
    from product_images pi
    where pi.variant_id = pv.id
    order by pi.sort_order
    limit 1
  ) as primary_image_url,
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
  coalesce(
    (select array_agg(pc.category_id)
     from product_categories pc
     where pc.product_id = p.id),
    '{}'::uuid[]
  ) as category_ids,
  coalesce(
    (select array_agg(distinct (pva.value #>> '{}')::text)
     from product_variant_attributes pva
     join attribute_definitions ad on ad.id = pva.attribute_definition_id
     join product_variants pv2 on pv2.id = pva.variant_id
     where pv2.product_id = p.id
       -- Intentionally broad: matches color-clothes, color-office,
       -- accessories-color, drinkware-color. See spec Section 3, finding #6.
       and ad.name like '%color%'),
    '{}'::text[]
  ) as colors,
  coalesce(
    (select array_agg(distinct (pva.value #>> '{}')::text)
     from product_variant_attributes pva
     join attribute_definitions ad on ad.id = pva.attribute_definition_id
     join product_variants pv2 on pv2.id = pva.variant_id
     where pv2.product_id = p.id
       and ad.name = 'size-clothes'),
    '{}'::text[]
  ) as sizes
from products p
inner join product_variants pv
  on pv.product_id = p.id and pv.is_master = true
where p.is_published = true;

grant select on products_search to authenticated, anon;

comment on view products_search is
  'Flattened view of published products with master variant data and attribute aggregates (colors, sizes, category_ids) for catalog search and filtering.';

-- RPC: returns available filter values for a set of categories.
-- Single round-trip used by the sidebar to populate color/size lists,
-- price range, and decide whether the size filter is shown at all.
create or replace function get_catalog_filter_options(p_category_ids uuid[])
returns table(
  colors text[],
  sizes text[],
  price_min int,
  price_max int,
  has_size_filter boolean
)
language sql stable security invoker
set search_path = public
as $$
  select
    (
      select array_agg(distinct c)
      from products_search ps, unnest(ps.colors) c
      where ps.category_ids && p_category_ids
    ),
    (
      select array_agg(distinct s)
      from products_search ps, unnest(ps.sizes) s
      where ps.category_ids && p_category_ids
    ),
    (
      select min(price)::int
      from products_search
      where category_ids && p_category_ids
    ),
    (
      select max(price)::int
      from products_search
      where category_ids && p_category_ids
    ),
    exists(
      select 1 from products_search ps
      where ps.category_ids && p_category_ids
        and cardinality(ps.sizes) > 0
    );
$$;

grant execute on function get_catalog_filter_options(uuid[]) to authenticated, anon;

-- Supporting indexes (idempotent).
create index if not exists idx_pva_attr_value
  on product_variant_attributes (attribute_definition_id, ((value #>> '{}')));
create index if not exists idx_attr_def_name
  on attribute_definitions (name);
