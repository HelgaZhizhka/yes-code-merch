-- Catalog & Categories RPCs — fresh (reset-ready)
-- Safe for anon/auth reads via explicit GRANTs at the end.
-- If you are truly resetting the project, you can run this as-is.
-- If NOT resetting, ensure no dependent code relies on old return types.

-- =====================================================================
-- 1) Category subtree (root + all descendants)
-- =====================================================================
create or replace function public.get_category_subtree(root_id uuid)
returns table(
  id uuid,
  name text,
  slug text,
  parent_id uuid,
  depth int
)
language sql stable
set search_path = ''
as $$
  with recursive r as (
    select c.*, 0 as depth
    from public.categories c
    where c.id = root_id
    union all
    select c.*, r.depth + 1
    from public.categories c
    join r on c.parent_id = r.id
  )
  select r.id, r.name, r.slug, r.parent_id, r.depth
  from r
  order by r.depth asc, r.name asc;
$$;

-- =====================================================================
-- 2) Breadcrumbs (ancestors up to root)
--     Returns a flat list with increasing depth from current→root.
--     Ordered by depth DESC so the root comes first in the array.
-- =====================================================================
create or replace function public.get_category_ancestors(cat_id uuid)
returns table(
  id uuid,
  name text,
  slug text,
  parent_id uuid,
  depth int
)
language sql stable
set search_path = ''
as $$
  with recursive r as (
    select c.*, 0 as depth
    from public.categories c
    where c.id = cat_id
    union all
    select p.*, r.depth + 1
    from public.categories p
    join r on r.parent_id = p.id
  )
  select id, name, slug, parent_id, depth
  from r
  order by depth desc; -- root first
$$;

-- =====================================================================
-- 3) Effective variant price (best active discount)
-- =====================================================================
create or replace function public.get_effective_variant_price(p_variant_id uuid)
returns table(
  variant_id uuid,
  original_price numeric,
  final_price numeric,
  applied_discount_id uuid
)
language sql stable
set search_path = ''
as $$
  with v as (
    select id, price
    from public.product_variants
    where id = p_variant_id
  ), d as (
    select id, discount_type, discount_value
    from public.product_discounts
    where is_active = true
      and (
        variant_id = p_variant_id
        or product_id = (select product_id from public.product_variants where id = p_variant_id)
      )
      and (valid_from is null or now() >= valid_from)
      and (valid_to   is null or now() <= valid_to)
    order by priority desc, updated_at desc
    limit 1
  )
  select v.id as variant_id,
         v.price as original_price,
         case
           when d.id is null then v.price
           when d.discount_type = 'percent' then round(v.price * (1 - d.discount_value/100.0), 2)
           else greatest(0, v.price - d.discount_value)
         end as final_price,
         d.id as applied_discount_id
  from v left join d on true;
$$;

-- =====================================================================
-- 4) Unified Catalog (PLP/Search): subtree filter + search + sorting + pagination
--     Returns BOTH prices (base + discounted) and master_variant_id for PDP routing.
--     If you are migrating from an older signature: DROP the old one first to avoid 42P13.
-- =====================================================================
-- Drop old signature to avoid "cannot change return type of existing function"
DROP FUNCTION IF EXISTS public.get_catalog(uuid, text, text, text, integer, integer);

create or replace function public.get_catalog(
  in_category uuid default null,
  q          text default null,
  sort_by    text default 'created_at',
  sort_dir   text default 'desc',
  page       int  default 1,
  page_size  int  default 24
)
returns table (
  product_id        uuid,
  slug              text,
  name              text,
  price             numeric,     -- original (master variant)
  final_price       numeric,     -- discounted (if any)
  currency          char(3),
  sku               text,
  stock             int,
  image_url         text,
  product_attrs     jsonb,
  created_at        timestamptz,
  master_variant_id uuid
)
language sql stable
set search_path = ''
as $func$
  with base as (
    select
      p.id   as product_id,
      p.slug,
      p.name,
      v.price,
      coalesce(ep.final_price, v.price) as final_price,
      v.currency,
      v.sku,
      v.stock,
      coalesce(
        (select pi.url
         from public.product_images pi
         where pi.variant_id = v.id and pi.is_primary = true
         order by pi.sort_order asc
         limit 1),
        (select pi.url
         from public.product_images pi
         where pi.variant_id = v.id
         order by pi.is_primary desc, pi.sort_order asc
         limit 1)
      ) as image_url,
      coalesce(
        (
          select jsonb_object_agg(ad.name, pa.value)
          from public.product_attributes pa
          join public.attribute_definitions ad on ad.id = pa.attribute_definition_id
          where pa.product_id = p.id and ad.is_variant_attribute = false
        ), '{}'::jsonb
      ) as product_attrs,
      p.created_at,
      v.id as master_variant_id
    from public.products p
    join public.product_variants v
      on v.product_id = p.id and v.is_master = true
    left join lateral (
      select final_price
      from public.get_effective_variant_price(v.id)
    ) ep on true
    where p.is_published = true
      and (q is null or p.name ilike '%' || q || '%')
      and (
        in_category is null
        or exists (
          select 1
          from public.get_category_subtree(in_category) sc
          join public.product_categories pc on pc.category_id = sc.id
          where pc.product_id = p.id
        )
      )
  )
  select *
  from base
  order by
    case when sort_by = 'final_price' and sort_dir = 'asc'  then final_price end asc,
    case when sort_by = 'final_price' and sort_dir = 'desc' then final_price end desc,
    case when sort_by = 'price'       and sort_dir = 'asc'  then price       end asc,
    case when sort_by = 'price'       and sort_dir = 'desc' then price       end desc,
    case when sort_by = 'name'        and sort_dir = 'asc'  then name        end asc,
    case when sort_by = 'name'        and sort_dir = 'desc' then name        end desc,
    case when sort_by = 'created_at'  and sort_dir = 'asc'  then created_at  end asc,
    case when sort_by = 'created_at'  and sort_dir = 'desc' then created_at  end desc,
    created_at desc
  limit greatest(page_size, 1)
  offset greatest((page-1), 0) * greatest(page_size, 1);
$func$;

-- =====================================================================
-- 5) (Optional cleanup) Drop legacy lightweight listing with v_plp_products
--    If you truly want to remove it. Skip this block if you still use it somewhere.
-- =====================================================================
-- drop function if exists public.list_products_by_category(uuid, text, text, int, int);

-- =====================================================================
-- 6) Grants (anon/auth read-only execution)
-- =====================================================================
grant execute on function public.get_category_subtree(uuid)                               to anon, authenticated;
grant execute on function public.get_category_ancestors(uuid)                             to anon, authenticated;
grant execute on function public.get_effective_variant_price(uuid)                        to anon, authenticated;
grant execute on function public.get_catalog(uuid, text, text, text, integer, integer)    to anon, authenticated;
