-- view PLP products (master variant + primary image)
create or replace view v_plp_products as
select p.id as product_id,
       p.name,
       p.slug,
       p.is_published,
       mv.id   as master_variant_id,
       mv.sku  as master_sku,
       mv.price as master_price,
       mv.currency,
       coalesce(pi.url, null) as primary_image_url
from products p
join lateral (
  select v.* from product_variants v
  where v.product_id = p.id and v.is_master = true
  limit 1
) mv on true
left join lateral (
  select i.url from product_images i
  where i.variant_id = mv.id and i.is_primary = true
  order by i.sort_order asc, i.created_at asc
  limit 1
) pi on true
where p.is_published = true;
