-- Clothes batch (SPU + master SKUs + subcategory links + color attributes)
-- Idempotent; no CROSS JOIN; no multi-CTE across statements.

-- safety indexes for upsert targets
create unique index if not exists uniq_variant_attrs on public.product_variant_attributes(variant_id, attribute_definition_id);
create unique index if not exists uniq_images_variant_url on public.product_images(variant_id, url);

--   name, slug, subcategory, base_sku, price_eur, color

-- 1) Products (SPU) — type = Clothes, publish
with prod_map(name, slug, category_slug, base_sku, price_eur, color) as (
  values
    ('Cap I''m Fine','cap-i-m-fine-fde953','caps','cap-11-orange',13.00,'red'),
    ('Long Sleeve T-Shirt Is That Possible','long-sleeve-t-shirt-is-that-possible','t-shirt','tsls-11-gray',28.00,'gray'),
    ('Socks Yeees','socks-yeees-4c7ce9','socks','scks-4-white',8.00,'white'),
    ('Cap I''m Fine','cap-i-m-fine-2ed1a4','caps','cap-11-black',13.00,'black'),
    ('Crop Top I See','crop-top-i-see','tops','crt-2-green',28.00,'green'),
    ('Hoodie Take a Junior','hoodie-take-a-junior-b8b3ce','hoodies','hd-9-black',51.00,'black'),
    ('Hoodie Take a Junior','hoodie-take-a-junior-c50c8f','hoodies','hd-9-orange',51.00,'orange'),
    ('Hoodie Take a Junior','hoodie-take-a-junior-4c3249','hoodies','hd-9-red',51.00,'red'),
    ('Hoodie Take a Junior','hoodie-take-a-junior-c68a74','hoodies','hd-9-white',51.00,'white'),
    ('T-Shirt I Did It','t-shirt-i-did-it-1e0406','t-shirt','t-1-blue',22.00,'blue'),
    ('Vest Google It','vest-google-it','tops','vst-6-white',28.00,'white'),
    ('Hoodie Take a Junior','hoodie-take-a-junior-7a8ac1','hoodies','hd-9-red',51.00,'red'),
    ('Vest Google It','vest-google-it-6281db','tops','vst-6-purple',28.00,'purple'),
    ('Shorts Wow How Cool','shorts-wow-how-cool','shorts','shrt-7-orange',28.00,'orange'),
    ('Vest Google It','vest-google-it-2f89e7','tops','vst-6-orange',28.00,'orange'),
    ('T-Shirt I Did It','t-shirt-i-did-it','t-shirt','t-1-orange',22.00,'orange'),
    ('Shorts Wow How Cool','shorts-wow-how-cool-72d3e7','shorts','shrt-7-purple',28.00,'purple'),
    ('Socks Yeees','socks-yeees-6ae3d8','socks','scks-4-purple',8.00,'purple'),
    ('Hoodie Take a Junior','hoodie-take-a-junior-21b2e6','hoodies','hd-9-white',51.00,'white')
)
insert into public.products (name, slug, description, is_published, product_type_id)
select pm.name, pm.slug, null, true, (select id from public.product_types where name='Clothes')
from prod_map pm
on conflict (slug) do update
  set name=excluded.name,
      description=excluded.description,
      is_published=excluded.is_published,
      product_type_id=excluded.product_type_id,
      updated_at=now();

with prod_map(slug) as (
  values
    ('cap-i-m-fine-fde953'),
    ('long-sleeve-t-shirt-is-that-possible'),
    ('socks-yeees-4c7ce9'),
    ('cap-i-m-fine-2ed1a4'),
    ('crop-top-i-see'),
    ('hoodie-take-a-junior-b8b3ce'),
    ('hoodie-take-a-junior-c50c8f'),
    ('hoodie-take-a-junior-4c3249'),
    ('hoodie-take-a-junior-c68a74'),
    ('t-shirt-i-did-it-1e0406'),
    ('vest-google-it'),
    ('hoodie-take-a-junior-7a8ac1'),
    ('vest-google-it-6281db'),
    ('shorts-wow-how-cool'),
    ('vest-google-it-2f89e7'),
    ('t-shirt-i-did-it'),
    ('shorts-wow-how-cool-72d3e7'),
    ('socks-yeees-6ae3d8'),
    ('hoodie-take-a-junior-21b2e6')
)
delete from public.product_categories pc
using public.products p, public.categories c, prod_map pm
where p.slug = pm.slug
  and pc.product_id = p.id
  and c.slug = 'clothes'
  and pc.category_id = c.id;

with prod_map(slug, category_slug) as (
  values
    ('cap-i-m-fine-fde953','caps'),
    ('long-sleeve-t-shirt-is-that-possible','t-shirt'),
    ('socks-yeees-4c7ce9','socks'),
    ('cap-i-m-fine-2ed1a4','caps'),
    ('crop-top-i-see','tops'),
    ('hoodie-take-a-junior-b8b3ce','hoodies'),
    ('hoodie-take-a-junior-c50c8f','hoodies'),
    ('hoodie-take-a-junior-4c3249','hoodies'),
    ('hoodie-take-a-junior-c68a74','hoodies'),
    ('t-shirt-i-did-it-1e0406','t-shirt'),
    ('vest-google-it','tops'),
    ('hoodie-take-a-junior-7a8ac1','hoodies'),
    ('vest-google-it-6281db','tops'),
    ('shorts-wow-how-cool','shorts'),
    ('vest-google-it-2f89e7','tops'),
    ('t-shirt-i-did-it','t-shirt'),
    ('shorts-wow-how-cool-72d3e7','shorts'),
    ('socks-yeees-6ae3d8','socks'),
    ('hoodie-take-a-junior-21b2e6','hoodies')
)
insert into public.product_categories(product_id, category_id)
select p.id, c.id
from prod_map pm
join public.products p   on p.slug = pm.slug
join public.categories c on c.slug = pm.category_slug
on conflict do nothing;

-- 4) Master variants — SKU = base_sku || '-' || substr(md5(slug),1,6) || '-master'
with prod_map(slug, base_sku, price_eur) as (
  values
    ('cap-i-m-fine-fde953','cap-11-orange',13.00),
    ('long-sleeve-t-shirt-is-that-possible','tsls-11-gray',28.00),
    ('socks-yeees-4c7ce9','scks-4-white',8.00),
    ('cap-i-m-fine-2ed1a4','cap-11-black',13.00),
    ('crop-top-i-see','crt-2-green',28.00),
    ('hoodie-take-a-junior-b8b3ce','hd-9-black',51.00),
    ('hoodie-take-a-junior-c50c8f','hd-9-orange',51.00),
    ('hoodie-take-a-junior-4c3249','hd-9-red',51.00),
    ('hoodie-take-a-junior-c68a74','hd-9-white',51.00),
    ('t-shirt-i-did-it-1e0406','t-1-blue',22.00),
    ('vest-google-it','vst-6-white',28.00),
    ('hoodie-take-a-junior-7a8ac1','hd-9-red',51.00),
    ('vest-google-it-6281db','vst-6-purple',28.00),
    ('shorts-wow-how-cool','shrt-7-orange',28.00),
    ('vest-google-it-2f89e7','vst-6-orange',28.00),
    ('t-shirt-i-did-it','t-1-orange',22.00),
    ('shorts-wow-how-cool-72d3e7','shrt-7-purple',28.00),
    ('socks-yeees-6ae3d8','scks-4-purple',8.00),
    ('hoodie-take-a-junior-21b2e6','hd-9-white',51.00)
)
insert into public.product_variants(product_id, sku, price, currency, stock, is_master)
select p.id,
       pm.base_sku || '-' || substr(md5(pm.slug),1,6) || '-master' as sku,
       pm.price_eur::numeric(12,2),
       'EUR',
       0,
       true
from prod_map pm
join public.products p on p.slug = pm.slug
on conflict (sku) do update
  set price     = excluded.price,
      currency  = excluded.currency,
      stock     = excluded.stock,
      is_master = excluded.is_master,
      updated_at= now();

with no_master as (
  select product_id
  from public.product_variants
  group by product_id
  having sum(case when is_master then 1 else 0 end)=0
), pick as (
  select distinct on (pv.product_id) pv.id
  from public.product_variants pv
  join no_master nm on nm.product_id = pv.product_id
  order by pv.product_id, pv.created_at asc, pv.sku asc
)
update public.product_variants v
set is_master = true, updated_at = now()
from pick where v.id = pick.id;

-- 5) Variant attribute: color-clothes
with prod_map(slug, color) as (
  values
    ('cap-i-m-fine-fde953','red'),
    ('long-sleeve-t-shirt-is-that-possible','gray'),
    ('socks-yeees-4c7ce9','white'),
    ('cap-i-m-fine-2ed1a4','black'),
    ('crop-top-i-see','green'),
    ('hoodie-take-a-junior-b8b3ce','black'),
    ('hoodie-take-a-junior-c50c8f','orange'),
    ('hoodie-take-a-junior-4c3249','red'),
    ('hoodie-take-a-junior-c68a74','white'),
    ('t-shirt-i-did-it-1e0406','blue'),
    ('vest-google-it','white'),
    ('hoodie-take-a-junior-7a8ac1','red'),
    ('vest-google-it-6281db','purple'),
    ('shorts-wow-how-cool','orange'),
    ('vest-google-it-2f89e7','orange'),
    ('t-shirt-i-did-it','orange'),
    ('shorts-wow-how-cool-72d3e7','purple'),
    ('socks-yeees-6ae3d8','purple'),
    ('hoodie-take-a-junior-21b2e6','white')
)
insert into public.product_variant_attributes(variant_id, attribute_definition_id, value)
select pv.id,
       ad.id,
       to_jsonb(pm.color::text)
from prod_map pm
join public.products p on p.slug = pm.slug
join public.product_variants pv on pv.product_id = p.id and pv.is_master = true
join public.attribute_definitions ad
  on ad.product_type_id = p.product_type_id
 and ad.name = 'color-clothes'
on conflict (variant_id, attribute_definition_id)
do update set value = excluded.value;
