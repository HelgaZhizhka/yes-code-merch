-- Bags batch (SPU + master SKUs + subcategory links + accessories-color)
-- Idempotent; no CROSS JOIN; separate statements; based on export CSV.

-- safety indexes for upsert targets
create unique index if not exists uniq_variant_attrs on public.product_variant_attributes(variant_id, attribute_definition_id);
create unique index if not exists uniq_images_variant_url on public.product_images(variant_id, url);

-- 1) Products (SPU) — type = Bags, publish
with prod_map(name, slug, category_slug, sku, price_eur, color) as (
  values
    ('Shopper Bag Yeees Orange','shopper-bag-yeees-orange','shoppers','shpr-22-orange-master',12.00,'orange'),
    ('Backpack I See It That Way White','backpack-i-see-it-that-way-white','backpacks','bp-18-white-master',30.00,'white'),
    ('Shopper Bag Yeees Black','shopper-bag-yeees-black','shoppers','shpr-22-black-master',12.00,'black'),
    ('Backpack I See It That Way Green','backpack-i-see-it-that-way-green','backpacks','bp-18-green-master',30.00,'green'),
    ('Drawstring Backpack Take a Junior Green','drawstring-backpack-take-a-junior-green','backpacks','drbp-6-green-master',10.00,'green'),
    ('Drawstring Backpack Take a Junior Purple','drawstring-backpack-take-a-junior-purple','backpacks','drbp-6-purple-master',10.00,'purple'),
    ('Drawstring Backpack Take a Junior Orange','drawstring-backpack-take-a-junior-orange','backpacks','drbp-6-orange-master',10.00,'orange'),
    ('Backpack I See It That Way Purple','backpack-i-see-it-that-way-purple','backpacks','bp-18-purple-master',30.00,'purple'),
    ('Drawstring Backpack Take a Junior White','drawstring-backpack-take-a-junior-white','backpacks','drbp-6-white-master',10.00,'white'),
    ('Backpack I See It That Way White Black','backpack-i-see-it-that-way-white-black','backpacks','bp-18-black-master',30.00,'black'),
    ('Drawstring Backpack Take a Junior Black','drawstring-backpack-take-a-junior-black','backpacks','drbp-6-black-master',10.00,'black'),
    ('Shopper Bag Yeees Blue','shopper-bag-yeees-blue','shoppers','shpr-22-blue-master',12.00,'blue'),
    ('Shopper Bag Yeees White','shopper-bag-yeees-white','shoppers','shpr-22-white-master',12.00,'white'),
    ('Shopper Bag Yeees Green','shopper-bag-yeees-green','shoppers','shpr-22-green-master',12.00,'green'),
    ('Backpack I See It That Way Blue','backpack-i-see-it-that-way-blue','backpacks','bp-18-blue-master',30.00,'blue'),
    ('Shopper Bag Yeees Purple','shopper-bag-yeees-purple','shoppers','shpr-22-purple-master',12.00,'purple')
)
insert into public.products (name, slug, description, is_published, product_type_id)
select pm.name, pm.slug, null, true, (select id from public.product_types where name='Bags')
from prod_map pm
on conflict (slug) do update
  set name=excluded.name,
      description=excluded.description,
      is_published=excluded.is_published,
      product_type_id=excluded.product_type_id,
      updated_at=now();

-- 2) Remove link to top-level 'bags' (if existed), add correct subcategory links
with prod_map(slug) as (
  values
    ('shopper-bag-yeees-orange'),
    ('backpack-i-see-it-that-way-white'),
    ('shopper-bag-yeees-black'),
    ('backpack-i-see-it-that-way-green'),
    ('drawstring-backpack-take-a-junior-green'),
    ('drawstring-backpack-take-a-junior-purple'),
    ('drawstring-backpack-take-a-junior-orange'),
    ('backpack-i-see-it-that-way-purple'),
    ('drawstring-backpack-take-a-junior-white'),
    ('backpack-i-see-it-that-way-white-black'),
    ('drawstring-backpack-take-a-junior-black'),
    ('shopper-bag-yeees-blue'),
    ('shopper-bag-yeees-white'),
    ('shopper-bag-yeees-green'),
    ('backpack-i-see-it-that-way-blue'),
    ('shopper-bag-yeees-purple')
)
delete from public.product_categories pc
using public.products p, public.categories c, prod_map pm
where p.slug = pm.slug
  and pc.product_id = p.id
  and c.slug = 'bags'
  and pc.category_id = c.id;

with prod_map(slug, category_slug) as (
  values
    ('shopper-bag-yeees-orange', 'shoppers'),
    ('backpack-i-see-it-that-way-white', 'backpacks'),
    ('shopper-bag-yeees-black', 'shoppers'),
    ('backpack-i-see-it-that-way-green', 'backpacks'),
    ('drawstring-backpack-take-a-junior-green', 'backpacks'),
    ('drawstring-backpack-take-a-junior-purple', 'backpacks'),
    ('drawstring-backpack-take-a-junior-orange', 'backpacks'),
    ('backpack-i-see-it-that-way-purple', 'backpacks'),
    ('drawstring-backpack-take-a-junior-white', 'backpacks'),
    ('backpack-i-see-it-that-way-white-black', 'backpacks'),
    ('drawstring-backpack-take-a-junior-black', 'backpacks'),
    ('shopper-bag-yeees-blue', 'shoppers'),
    ('shopper-bag-yeees-white', 'shoppers'),
    ('shopper-bag-yeees-green', 'shoppers'),
    ('backpack-i-see-it-that-way-blue', 'backpacks'),
    ('shopper-bag-yeees-purple', 'shoppers')
)
insert into public.product_categories(product_id, category_id)
select p.id, c.id
from prod_map pm
join public.products p   on p.slug = pm.slug
join public.categories c on c.slug = pm.category_slug
on conflict do nothing;

-- 3) Master variants (one per product)
with prod_map(slug, sku, price_eur) as (
  values
    ('shopper-bag-yeees-orange', 'shpr-22-orange-master', 12.00),
    ('backpack-i-see-it-that-way-white', 'bp-18-white-master', 30.00),
    ('shopper-bag-yeees-black', 'shpr-22-black-master', 12.00),
    ('backpack-i-see-it-that-way-green', 'bp-18-green-master', 30.00),
    ('drawstring-backpack-take-a-junior-green', 'drbp-6-green-master', 10.00),
    ('drawstring-backpack-take-a-junior-purple', 'drbp-6-purple-master', 10.00),
    ('drawstring-backpack-take-a-junior-orange', 'drbp-6-orange-master', 10.00),
    ('backpack-i-see-it-that-way-purple', 'bp-18-purple-master', 30.00),
    ('drawstring-backpack-take-a-junior-white', 'drbp-6-white-master', 10.00),
    ('backpack-i-see-it-that-way-white-black', 'bp-18-black-master', 30.00),
    ('drawstring-backpack-take-a-junior-black', 'drbp-6-black-master', 10.00),
    ('shopper-bag-yeees-blue', 'shpr-22-blue-master', 12.00),
    ('shopper-bag-yeees-white', 'shpr-22-white-master', 12.00),
    ('shopper-bag-yeees-green', 'shpr-22-green-master', 12.00),
    ('backpack-i-see-it-that-way-blue', 'bp-18-blue-master', 30.00),
    ('shopper-bag-yeees-purple', 'shpr-22-purple-master', 12.00)
)
insert into public.product_variants(product_id, sku, price, currency, stock, is_master)
select p.id,
       pm.sku,
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

-- 3b) Ensure master per product
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

-- 4) Variant attribute: accessories-color (by master variant)
with prod_map(slug, color) as (
  values
    ('shopper-bag-yeees-orange', 'orange'),
    ('backpack-i-see-it-that-way-white', 'white'),
    ('shopper-bag-yeees-black', 'black'),
    ('backpack-i-see-it-that-way-green', 'green'),
    ('drawstring-backpack-take-a-junior-green', 'green'),
    ('drawstring-backpack-take-a-junior-purple', 'purple'),
    ('drawstring-backpack-take-a-junior-orange', 'orange'),
    ('backpack-i-see-it-that-way-purple', 'purple'),
    ('drawstring-backpack-take-a-junior-white', 'white'),
    ('backpack-i-see-it-that-way-white-black', 'black'),
    ('drawstring-backpack-take-a-junior-black', 'black'),
    ('shopper-bag-yeees-blue', 'blue'),
    ('shopper-bag-yeees-white', 'white'),
    ('shopper-bag-yeees-green', 'green'),
    ('backpack-i-see-it-that-way-blue', 'blue'),
    ('shopper-bag-yeees-purple', 'purple')
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
 and ad.name = 'accessories-color'
on conflict (variant_id, attribute_definition_id)
do update set value = excluded.value;
