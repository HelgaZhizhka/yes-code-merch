-- 1) subtree
create or replace function public.get_category_subtree(root_id uuid)
returns table(id uuid, name text, slug text, parent_id uuid, depth int)
language sql stable
set search_path = ''
as $$
with recursive r as (
  select c.*, 0 as depth from public.categories c where c.id = root_id
  union all
  select c.*, r.depth + 1 from public.categories c
  join r on c.parent_id = r.id
)
select r.id, r.name, r.slug, r.parent_id, r.depth
from r
order by r.depth asc, r.name asc;
$$;

-- 2) breadcrumbs
create or replace function public.get_category_ancestors(cat_id uuid)
returns table(id uuid, name text, slug text, parent_id uuid, depth int)
language sql stable
set search_path = ''
as $$
with recursive r as (
  select c.*, 0 as depth from public.categories c where c.id = cat_id
  union all
  select p.*, r.depth + 1 from public.categories p
  join r on r.parent_id = p.id
)
select id, name, slug, parent_id, depth
from r
order by depth desc;
$$;

-- 3) effective variant price
create or replace function public.get_effective_variant_price(p_variant_id uuid)
returns table(variant_id uuid, original_price numeric, final_price numeric, applied_discount_id uuid)
language sql stable
set search_path = ''
as $$
with v as (
  select id, price from public.product_variants where id = p_variant_id
), d as (
  select id, discount_type, discount_value
  from public.product_discounts
  where is_active = true
    and (variant_id = p_variant_id
         or product_id = (select product_id from public.product_variants where id = p_variant_id))
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

-- 4) PLP by category (safe sorting)
create or replace function public.list_products_by_category(
  p_category_id uuid,
  p_sort_by text default 'name',
  p_sort_dir text default 'asc',
  p_limit int default 24,
  p_offset int default 0
) returns setof public.v_plp_products
language plpgsql stable
set search_path = ''
as $$
declare
  _order text;
  _sql   text;
begin
  _order := case lower(p_sort_by)
              when 'name' then 'name'
              when 'master_price' then 'master_price'
              else 'name'
            end || ' ' || case when lower(p_sort_dir) = 'desc' then 'desc' else 'asc' end;

  _sql := '
    with recursive r as (
      select id from public.categories where id = $1
      union all
      select c.id from public.categories c join r on c.parent_id = r.id
    )
    select v.*
    from public.v_plp_products v
    join public.product_categories pc on pc.product_id = v.product_id
    where pc.category_id in (select id from r)
    order by ' || _order || ' limit $2 offset $3';

  return query execute _sql using p_category_id, p_limit, p_offset;
end;
$$;

-- 5) unified catalog (search/sort/pagination)
create or replace function public.get_catalog(
  in_category uuid default null,
  q text default null,
  sort_by text default 'created_at',
  sort_dir text default 'desc',
  page int default 1,
  page_size int default 24
)
returns table (
  product_id uuid,
  slug text,
  name text,
  price numeric,
  currency char(3),
  sku text,
  stock int,
  image_url text,
  product_attrs jsonb,
  created_at timestamptz
)
language sql stable
set search_path = ''
as $$
with base as (
  select
    p.id as product_id,
    p.slug,
    p.name,
    v.price,
    v.currency,
    v.sku,
    v.stock,
    coalesce(
      (select pi.url from public.product_images pi
       where pi.variant_id = v.id and pi.is_primary = true
       order by pi.sort_order asc
       limit 1),
      (select pi.url from public.product_images pi
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
    p.created_at
  from public.products p
  join public.product_variants v on v.product_id = p.id and v.is_master = true
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
  case when sort_by = 'price' and sort_dir = 'asc' then price end asc,
  case when sort_by = 'price' and sort_dir = 'desc' then price end desc,
  case when sort_by = 'name'  and sort_dir = 'asc' then name  end asc,
  case when sort_by = 'name'  and sort_dir = 'desc' then name  end desc,
  case when sort_by = 'created_at' and sort_dir = 'asc' then created_at end asc,
  case when sort_by = 'created_at' and sort_dir = 'desc' then created_at end desc,
  created_at desc
limit greatest(page_size, 1)
offset greatest((page-1), 0) * greatest(page_size, 1);
$$;


grant execute on function
  public.get_category_subtree(uuid),
  public.get_category_ancestors(uuid),
  public.get_effective_variant_price(uuid),
  public.list_products_by_category(uuid, text, text, int, int),
  public.get_catalog(uuid, text, text, text, int, int)
to anon, authenticated;
