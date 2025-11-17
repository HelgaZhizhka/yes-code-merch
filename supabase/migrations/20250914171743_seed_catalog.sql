
with src(iso_code, name) as (
  values
    ('AT', 'Austria'),
    ('BE', 'Belgium'),
    ('BG', 'Bulgaria'),
    ('HR', 'Croatia'),
    ('CY', 'Cyprus'),
    ('CZ', 'Czech Republic'),
    ('DK', 'Denmark'),
    ('EE', 'Estonia'),
    ('FI', 'Finland'),
    ('FR', 'France'),
    ('DE', 'Germany'),
    ('GR', 'Greece'),
    ('HU', 'Hungary'),
    ('IE', 'Ireland'),
    ('IT', 'Italy'),
    ('LV', 'Latvia'),
    ('LT', 'Lithuania'),
    ('LU', 'Luxembourg'),
    ('MT', 'Malta'),
    ('NL', 'Netherlands'),
    ('PL', 'Poland'),
    ('PT', 'Portugal'),
    ('RO', 'Romania'),
    ('SK', 'Slovakia'),
    ('SI', 'Slovenia'),
    ('ES', 'Spain'),
    ('SE', 'Sweden')
)
insert into public.countries (iso_code, name)
select s.iso_code, s.name
from src s
on conflict (iso_code) do update
  set name = excluded.name;

-- ===========================================
-- import_categories_and_types
-- Seed from Commercetools exports: categories + product types + attribute definitions
-- Idempotent: safe to rerun
-- ===========================================

-- 0)  ON CONFLICT
create unique index if not exists uniq_product_types_name
  on product_types(name);

create unique index if not exists uniq_attribute_definitions_ptype_name
  on attribute_definitions(product_type_id, name);

-- 1) Product Types (upsert by name)
with pt_src(name, description) as (
  values
    ('Clothes',    null),
    ('Drinkware',  null),
    ('Office',     null),
    ('Bags',       null)
)
insert into product_types(name, description)
select s.name, s.description
from pt_src s
on conflict (name) do update
  set description = excluded.description;

-- 2) Categories: insert 
with cat_src(key, slug, name, description, order_hint, meta_title, meta_description, meta_keywords, parent_key) as (
  values
    ('hoodies',    'hoodies',    'Hoodies',     null, '0.04', null, null, null, 'clothes'),
    ('stickers',   'stickers',   'Stickers',    null, '0.05', null, null, null, 'office'),
    ('caps',       'caps',       'Caps',        null, '0.04', null, null, null, 'clothes'),
    ('bags',       'bags',       'Bags',        null, '0.09', null, null, null, null),
    ('notebook',   'notebook',   'Notebook',    null, '0.04', null, null, null, 'office'),
    ('backpacks',  'backpacks',  'Backpacks',   'Backpacks', '0.06', null, null, null, 'bags'),
    ('drinkware',  'drinkware',  'Drinkware',   null, '0.09', null, null, null, null),
    ('tops',       'tops',       'Tops',        null, '0.04', null, null, null, 'clothes'),
    ('bottles',    'bottles',    'Bottles',     null, '0.04', null, null, null, 'drinkware'),
    ('mugs',       'mugs',       'Mugs',        null, '0.05', null, null, null, 'drinkware'),
    ('t-shirt',    't-shirt',    'T-Shirt',     null, '0.05', null, null, null, 'clothes'),
    ('socks',      'socks',      'Socks',       null, '0.04', null, null, null, 'clothes'),
    ('shorts',     'shorts',     'Shorts',      null, '0.06', null, null, null, 'clothes'),
    ('office',     'office',     'Office',      null, '0.09', null, null, null, null),
    ('accessories','accessories','Accessories', null, '0.04', null, null, null, 'office'),
    ('clothes',    'clothes',    'Clothes',     null, '0.08', null, null, null, null),
    ('shoppers',   'shoppers',   'Shoppers',    null, '0.06', null, null, null, 'bags')
)
insert into categories(name, slug, description, order_hint, meta_title, meta_description, meta_keywords)
select s.name, s.slug, s.description, coalesce(s.order_hint, '0'), s.meta_title, s.meta_description, s.meta_keywords
from cat_src s
on conflict (slug) do update
  set name             = excluded.name,
      description      = excluded.description,
      order_hint       = excluded.order_hint,
      meta_title       = excluded.meta_title,
      meta_description = excluded.meta_description,
      meta_keywords    = excluded.meta_keywords,
      updated_at       = now();

-- 2b) Categories:  parent_id по key→slug
with cat_src(key, slug, parent_key) as (
  values
    ('hoodies','hoodies','clothes'),
    ('stickers','stickers','office'),
    ('caps','caps','clothes'),
    ('bags','bags',null),
    ('notebook','notebook','office'),
    ('backpacks','backpacks','bags'),
    ('drinkware','drinkware',null),
    ('tops','tops','clothes'),
    ('bottles','bottles','drinkware'),
    ('mugs','mugs','drinkware'),
    ('t-shirt','t-shirt','clothes'),
    ('socks','socks','clothes'),
    ('shorts','shorts','clothes'),
    ('office','office',null),
    ('accessories','accessories','office'),
    ('clothes','clothes',null),
    ('shoppers','shoppers','bags')
)
update categories child
set parent_id = parent.id,
    updated_at = now()
from cat_src c
join cat_src pmap on pmap.key = c.parent_key
join categories parent on parent.slug = pmap.slug
where child.slug = c.slug
  and (child.parent_id is distinct from parent.id);

-- 3) Attribute Definitions: upsert по (product_type_id, name)
with ad_src(product_type_name, name, label, type, is_required, is_variant_attribute) as (
  values
    ('Clothes',   'color-clothes',     'color-clothes',     'enum', true,  true),
    ('Clothes',   'size-clothes',      'size-clothes',      'enum', false, true),
    ('Drinkware', 'drinkware-color',   'drinkware-color',   'json', false, true),
    ('Office',    'color-office',      'color-office',      'enum', false, true),
    ('Bags',      'accessories-color', 'accessories-color', 'enum', false, true)
)
insert into attribute_definitions(product_type_id, name, label, type, is_required, is_variant_attribute)
select pt.id, s.name, s.label, s.type, s.is_required, s.is_variant_attribute
from ad_src s
join product_types pt on pt.name = s.product_type_name
on conflict (product_type_id, name) do update
  set label               = excluded.label,
      type                = excluded.type,
      is_required         = excluded.is_required,
      is_variant_attribute= excluded.is_variant_attribute;

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

-- Drinkware batch (SPU + master SKUs + subcategory links + drinkware-color)
-- Idempotent; no CROSS JOIN; separate statements; based on export CSV.

-- safety indexes for upsert targets
create unique index if not exists uniq_variant_attrs on public.product_variant_attributes(variant_id, attribute_definition_id);
create unique index if not exists uniq_images_variant_url on public.product_images(variant_id, url);

-- 1) Products (SPU) — type = Drinkware, publish
with prod_map(name, slug, category_slug, sku, price_eur, color) as (
  values
    ('Mug With Lid I See It That Way Green','mug-with-lid-i-see-it-that-way-green','mugs','mgld-18-green-master',12.00,'green'),
    ('Mug Everything Works Red','mug-everything-works-red','mugs','mug-19-red-master',7.00,'red'),
    ('Mug Everything Works Green','mug-everything-works-green','mugs','mug-19-green-master',7.00,'green'),
    ('Transparent Mug I''m Fine Orange','transparent-mug-im-fine-orange','mugs','trmg-11-orange-master',8.00,'orange'),
    ('Mug With Lid I See It That Way Orange','mug-with-lid-i-see-it-that-way-orange','mugs','mgld-18-orange-master',12.00,'orange'),
    ('Transparent Mug I''m Fine Blue','transparent-mug-im-fine-blue','mugs','trmg-11-blue-master',8.00,'blue'),
    ('Mug Everything Works Purple','mug-everything-works-purple','mugs','mug-19-purple-master',7.00,'purple'),
    ('Bottle Yeees Green','bottle-yeees-green','bottles','bttl-11-green-master',15.00,'green'),
    ('Bottle Yeees Black','bottle-yeees-black','bottles','bttl-11-black-master',15.00,'black'),
    ('Mug Everything Works Yellow','mug-everything-works-yellow','mugs','mug-19-yellow-master',7.00,'yellow'),
    ('Mug Everything Works Orange','mug-everything-works-orange','mugs','mug-19-orange-master',7.00,'orange'),
    ('Transparent Mug I''m Fine Green','transparent-mug-im-fine-green','mugs','trmg-11-green-master',8.00,'green'),
    ('Bottle Yeees Orange','bottle-yeees-orange','bottles','bttl-11-orange-master',15.00,'orange'),
    ('Transparent Mug I''m Fine White','transparent-mug-im-fine-white','mugs','trmg-11-white-master',8.00,'white'),
    ('Mug With Lid I See It That Way White','mug-with-lid-i-see-it-that-way-white','mugs','mgld-18-white-master',12.00,'white'),
    ('Mug Everything Works Lightblue','mug-everything-works-lightblue','mugs','mug-19-lightblue-master',7.00,'lightblue'),
    ('Mug With Lid I See It That Way Purple','mug-with-lid-i-see-it-that-way-purple','mugs','mgld-18-purple-master',12.00,'purple'),
    ('Mug With Lid I See It That Way Black','mug-with-lid-i-see-it-that-way-black','mugs','mgld-18-black-master',12.00,'black'),
    ('Mug Everything Works Blue','mug-everything-works-blue','mugs','mug-19-blue-master',7.00,'blue'),
    ('Bottle Yeees White','bottle-yeees-white','bottles','bttl-11-white-master',15.00,'white')
)
insert into public.products (name, slug, description, is_published, product_type_id)
select pm.name, pm.slug, null, true, (select id from public.product_types where name='Drinkware')
from prod_map pm
on conflict (slug) do update
  set name=excluded.name,
      description=excluded.description,
      is_published=excluded.is_published,
      product_type_id=excluded.product_type_id,
      updated_at=now();

-- 2) Remove link to top-level 'drinkware' (if existed), add correct subcategory links
with prod_map(slug) as (
  values
    ('mug-with-lid-i-see-it-that-way-green'),
    ('mug-everything-works-red'),
    ('mug-everything-works-green'),
    ('transparent-mug-im-fine-orange'),
    ('mug-with-lid-i-see-it-that-way-orange'),
    ('transparent-mug-im-fine-blue'),
    ('mug-everything-works-purple'),
    ('bottle-yeees-green'),
    ('bottle-yeees-black'),
    ('mug-everything-works-yellow'),
    ('mug-everything-works-orange'),
    ('transparent-mug-im-fine-green'),
    ('bottle-yeees-orange'),
    ('transparent-mug-im-fine-white'),
    ('mug-with-lid-i-see-it-that-way-white'),
    ('mug-everything-works-lightblue'),
    ('mug-with-lid-i-see-it-that-way-purple'),
    ('mug-with-lid-i-see-it-that-way-black'),
    ('mug-everything-works-blue'),
    ('bottle-yeees-white')
)
delete from public.product_categories pc
using public.products p, public.categories c, prod_map pm
where p.slug = pm.slug
  and pc.product_id = p.id
  and c.slug = 'drinkware'
  and pc.category_id = c.id;

with prod_map(slug, category_slug) as (
  values
    ('mug-with-lid-i-see-it-that-way-green', 'mugs'),
    ('mug-everything-works-red', 'mugs'),
    ('mug-everything-works-green', 'mugs'),
    ('transparent-mug-im-fine-orange', 'mugs'),
    ('mug-with-lid-i-see-it-that-way-orange', 'mugs'),
    ('transparent-mug-im-fine-blue', 'mugs'),
    ('mug-everything-works-purple', 'mugs'),
    ('bottle-yeees-green', 'bottles'),
    ('bottle-yeees-black', 'bottles'),
    ('mug-everything-works-yellow', 'mugs'),
    ('mug-everything-works-orange', 'mugs'),
    ('transparent-mug-im-fine-green', 'mugs'),
    ('bottle-yeees-orange', 'bottles'),
    ('transparent-mug-im-fine-white', 'mugs'),
    ('mug-with-lid-i-see-it-that-way-white', 'mugs'),
    ('mug-everything-works-lightblue', 'mugs'),
    ('mug-with-lid-i-see-it-that-way-purple', 'mugs'),
    ('mug-with-lid-i-see-it-that-way-black', 'mugs'),
    ('mug-everything-works-blue', 'mugs'),
    ('bottle-yeees-white', 'bottles')
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
    ('mug-with-lid-i-see-it-that-way-green', 'mgld-18-green-master', 12.00),
    ('mug-everything-works-red', 'mug-19-red-master', 7.00),
    ('mug-everything-works-green', 'mug-19-green-master', 7.00),
    ('transparent-mug-im-fine-orange', 'trmg-11-orange-master', 8.00),
    ('mug-with-lid-i-see-it-that-way-orange', 'mgld-18-orange-master', 12.00),
    ('transparent-mug-im-fine-blue', 'trmg-11-blue-master', 8.00),
    ('mug-everything-works-purple', 'mug-19-purple-master', 7.00),
    ('bottle-yeees-green', 'bttl-11-green-master', 15.00),
    ('bottle-yeees-black', 'bttl-11-black-master', 15.00),
    ('mug-everything-works-yellow', 'mug-19-yellow-master', 7.00),
    ('mug-everything-works-orange', 'mug-19-orange-master', 7.00),
    ('transparent-mug-im-fine-green', 'trmg-11-green-master', 8.00),
    ('bottle-yeees-orange', 'bttl-11-orange-master', 15.00),
    ('transparent-mug-im-fine-white', 'trmg-11-white-master', 8.00),
    ('mug-with-lid-i-see-it-that-way-white', 'mgld-18-white-master', 12.00),
    ('mug-everything-works-lightblue', 'mug-19-lightblue-master', 7.00),
    ('mug-with-lid-i-see-it-that-way-purple', 'mgld-18-purple-master', 12.00),
    ('mug-with-lid-i-see-it-that-way-black', 'mgld-18-black-master', 12.00),
    ('mug-everything-works-blue', 'mug-19-blue-master', 7.00),
    ('bottle-yeees-white', 'bttl-11-white-master', 15.00)
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

-- 4) Variant attribute: drinkware-color (by master variant)
with prod_map(slug, color) as (
  values
    ('mug-with-lid-i-see-it-that-way-green', 'green'),
    ('mug-everything-works-red', 'red'),
    ('mug-everything-works-green', 'green'),
    ('transparent-mug-im-fine-orange', 'orange'),
    ('mug-with-lid-i-see-it-that-way-orange', 'orange'),
    ('transparent-mug-im-fine-blue', 'blue'),
    ('mug-everything-works-purple', 'purple'),
    ('bottle-yeees-green', 'green'),
    ('bottle-yeees-black', 'black'),
    ('mug-everything-works-yellow', 'yellow'),
    ('mug-everything-works-orange', 'orange'),
    ('transparent-mug-im-fine-green', 'green'),
    ('bottle-yeees-orange', 'orange'),
    ('transparent-mug-im-fine-white', 'white'),
    ('mug-with-lid-i-see-it-that-way-white', 'white'),
    ('mug-everything-works-lightblue', 'lightblue'),
    ('mug-with-lid-i-see-it-that-way-purple', 'purple'),
    ('mug-with-lid-i-see-it-that-way-black', 'black'),
    ('mug-everything-works-blue', 'blue'),
    ('bottle-yeees-white', 'white')
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
 and ad.name = 'drinkware-color'
on conflict (variant_id, attribute_definition_id)
do update set value = excluded.value;

-- Office batch (SPU + master SKUs + subcategory links + color-office)
-- Idempotent; no CROSS JOIN; separate statements; based on export CSV.

-- safety indexes for upsert targets
create unique index if not exists uniq_variant_attrs on public.product_variant_attributes(variant_id, attribute_definition_id);
create unique index if not exists uniq_images_variant_url on public.product_images(variant_id, url);

-- 1) Products (SPU) — type = Office, publish
with prod_map(name, slug, category_slug, sku, price_eur, color) as (
  values
    ('Notebook Take a Junior Orange','notebook-take-a-junior-orange','notebook','ntb-6-orange-master',5.00,'orange'),
    ('Mouse Pad I''m Fine','mouse-pad-im-fine','accessories','mspd-11-black-master',7.00,'black'),
    ('Notebook Take a Junior Green','notebook-take-a-junior-green','notebook','ntb-6-green-master',5.00,'green'),
    ('Notebook I''m Fine White','notebook-im-fine-white','notebook','ntb-11-white-master',5.00,'white'),
    ('Cork Notebook I''m Fine Brown','cork-notebook-im-fine-brown','notebook','cntbk-11-brown-master',12.00,'brown'),
    ('Phone Case Wow That Is Cool Red','phone-case-wow-that-is-cool-red','accessories','phc-10-red-master',10.00,'red'),
    ('Phone Case I''m Fine Red','phone-case-im-fine-red','accessories','phc-11-red-master',10.00,'red'),
    ('Notebook I''m Fine Purple','notebook-im-fine-purple','notebook','ntb-11-purple-master',5.00,'purple'),
    ('Mouse Pad Yeees','mouse-pad-yeees','accessories','mspd-22-black-master',7.00,'black'),
    ('Notebook Take a Junior Purple','notebook-take-a-junior-purple','notebook','ntb-6-purple-master',5.00,'purple'),
    ('Notebook I''m Fine Orange','notebook-im-fine-orange','notebook','ntb-11-orange-master',5.00,'orange'),
    ('Mouse Pad Wow That Is Cool','mouse-pad-wow-that-is-cool','accessories','mspd-10-black-master',7.00,'black'),
    ('Badge I''m Fine White','badge-im-fine-white','accessories','bdg-11-white-master',1.10,'white'),
    ('Badge Wow That Is Cool White','badge-wow-that-is-cool-white','accessories','bdg-10-white-master',1.10,'white'),
    ('Phone Case Yeees Purple','phone-case-yeees-purple','accessories','phc-22-purple-master',10.00,'purple'),
    ('Notebook I''m Fine Green','notebook-im-fine-green','notebook','ntb-11-green-master',5.00,'green'),
    ('Phone Case Yeees Red','phone-case-yeees-red','accessories','phc-22-red-master',10.00,'red'),
    ('Cork Notebook Take a Junior Brown','cork-notebook-take-a-junior-brown','notebook','cntbk-6-brown-master',12.00,'brown'),
    ('Phone Case Wow That Is Cool Purple','phone-case-wow-that-is-cool-purple','accessories','phc-10-purple-master',10.00,'purple'),
    ('Sticker Set 01','sticker-set-01','stickers','sts-1-master',2.00,'multicolor'),
    ('Sticker Set 04','sticker-set-04','stickers','sts-4-master',2.00,'multicolor'),
    ('Phone Case Google It Red','phone-case-google-it-red','accessories','phc-14-red-master',10.00,'red'),
    ('Notebook Take a Junior White','notebook-take-a-junior-white','notebook','ntb-6-white-master',5.00,'white'),
    ('Cork Notebook Wow That Is Cool Brown','cork-notebook-wow-that-is-cool-brown','notebook','cntbk-10-brown-master',12.00,'brown'),
    ('Cork Notebook Yeees Brown','cork-notebook-yeees-brown','notebook','cntbk-22-brown-master',12.00,'brown'),
    ('Phone Case Google It Purple','phone-case-google-it-purple','accessories','phc-14-purple-master',10.00,'purple'),
    ('Sticker Set 02','sticker-set-02','stickers','sts-2-master',2.00,'multicolor'),
    ('Notebook Take a Junior Black','notebook-take-a-junior-black','notebook','ntb-6-black-master',5.00,'black'),
    ('Cork Notebook Google It Brown','cork-notebook-google-it-brown','notebook','cntbk-14-brown-master',12.00,'brown'),
    ('Phone Case I''m Fine Purple','phone-case-im-fine-purple','accessories','phc-11-purple-master',10.00,'purple'),
    ('Mouse Pad Google It','mouse-pad-google-it','accessories','mspd-14-black-master',7.00,'black'),
    ('Sticker Set 03','sticker-set-03','stickers','sts-3-master',2.00,'multicolor'),
    ('Badge Google It White','badge-google-it-white','accessories','bdg-14-white-master',1.10,'white'),
    ('Badge Take a Junior White','badge-take-a-junior-white','accessories','bdg-6-white-master',1.10,'white'),
    ('Notebook I''m Fine Black','notebook-im-fine-black','notebook','ntb-11-black-master',5.00,'black')
)
insert into public.products (name, slug, description, is_published, product_type_id)
select pm.name, pm.slug, null, true, (select id from public.product_types where name='Office')
from prod_map pm
on conflict (slug) do update
  set name=excluded.name,
      description=excluded.description,
      is_published=excluded.is_published,
      product_type_id=excluded.product_type_id,
      updated_at=now();

-- 2) Remove link to top-level 'office' (if existed), add correct subcategory links
with prod_map(slug) as (
  values
    ('notebook-take-a-junior-orange'),
    ('mouse-pad-im-fine'),
    ('notebook-take-a-junior-green'),
    ('notebook-im-fine-white'),
    ('cork-notebook-im-fine-brown'),
    ('phone-case-wow-that-is-cool-red'),
    ('phone-case-im-fine-red'),
    ('notebook-im-fine-purple'),
    ('mouse-pad-yeees'),
    ('notebook-take-a-junior-purple'),
    ('notebook-im-fine-orange'),
    ('mouse-pad-wow-that-is-cool'),
    ('badge-im-fine-white'),
    ('badge-wow-that-is-cool-white'),
    ('phone-case-yeees-purple'),
    ('notebook-im-fine-green'),
    ('phone-case-yeees-red'),
    ('cork-notebook-take-a-junior-brown'),
    ('phone-case-wow-that-is-cool-purple'),
    ('sticker-set-01'),
    ('sticker-set-04'),
    ('phone-case-google-it-red'),
    ('notebook-take-a-junior-white'),
    ('cork-notebook-wow-that-is-cool-brown'),
    ('cork-notebook-yeees-brown'),
    ('phone-case-google-it-purple'),
    ('sticker-set-02'),
    ('notebook-take-a-junior-black'),
    ('cork-notebook-google-it-brown'),
    ('phone-case-im-fine-purple'),
    ('mouse-pad-google-it'),
    ('sticker-set-03'),
    ('badge-google-it-white'),
    ('badge-take-a-junior-white'),
    ('notebook-im-fine-black')
)
delete from public.product_categories pc
using public.products p, public.categories c, prod_map pm
where p.slug = pm.slug
  and pc.product_id = p.id
  and c.slug = 'office'
  and pc.category_id = c.id;

with prod_map(slug, category_slug) as (
  values
    ('notebook-take-a-junior-orange', 'notebook'),
    ('mouse-pad-im-fine', 'accessories'),
    ('notebook-take-a-junior-green', 'notebook'),
    ('notebook-im-fine-white', 'notebook'),
    ('cork-notebook-im-fine-brown', 'notebook'),
    ('phone-case-wow-that-is-cool-red', 'accessories'),
    ('phone-case-im-fine-red', 'accessories'),
    ('notebook-im-fine-purple', 'notebook'),
    ('mouse-pad-yeees', 'accessories'),
    ('notebook-take-a-junior-purple', 'notebook'),
    ('notebook-im-fine-orange', 'notebook'),
    ('mouse-pad-wow-that-is-cool', 'accessories'),
    ('badge-im-fine-white', 'accessories'),
    ('badge-wow-that-is-cool-white', 'accessories'),
    ('phone-case-yeees-purple', 'accessories'),
    ('notebook-im-fine-green', 'notebook'),
    ('phone-case-yeees-red', 'accessories'),
    ('cork-notebook-take-a-junior-brown', 'notebook'),
    ('phone-case-wow-that-is-cool-purple', 'accessories'),
    ('sticker-set-01', 'stickers'),
    ('sticker-set-04', 'stickers'),
    ('phone-case-google-it-red', 'accessories'),
    ('notebook-take-a-junior-white', 'notebook'),
    ('cork-notebook-wow-that-is-cool-brown', 'notebook'),
    ('cork-notebook-yeees-brown', 'notebook'),
    ('phone-case-google-it-purple', 'accessories'),
    ('sticker-set-02', 'stickers'),
    ('notebook-take-a-junior-black', 'notebook'),
    ('cork-notebook-google-it-brown', 'notebook'),
    ('phone-case-im-fine-purple', 'accessories'),
    ('mouse-pad-google-it', 'accessories'),
    ('sticker-set-03', 'stickers'),
    ('badge-google-it-white', 'accessories'),
    ('badge-take-a-junior-white', 'accessories'),
    ('notebook-im-fine-black', 'notebook')
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
    ('notebook-take-a-junior-orange', 'ntb-6-orange-master', 5.00),
    ('mouse-pad-im-fine', 'mspd-11-black-master', 7.00),
    ('notebook-take-a-junior-green', 'ntb-6-green-master', 5.00),
    ('notebook-im-fine-white', 'ntb-11-white-master', 5.00),
    ('cork-notebook-im-fine-brown', 'cntbk-11-brown-master', 12.00),
    ('phone-case-wow-that-is-cool-red', 'phc-10-red-master', 10.00),
    ('phone-case-im-fine-red', 'phc-11-red-master', 10.00),
    ('notebook-im-fine-purple', 'ntb-11-purple-master', 5.00),
    ('mouse-pad-yeees', 'mspd-22-black-master', 7.00),
    ('notebook-take-a-junior-purple', 'ntb-6-purple-master', 5.00),
    ('notebook-im-fine-orange', 'ntb-11-orange-master', 5.00),
    ('mouse-pad-wow-that-is-cool', 'mspd-10-black-master', 7.00),
    ('badge-im-fine-white', 'bdg-11-white-master', 1.10),
    ('badge-wow-that-is-cool-white', 'bdg-10-white-master', 1.10),
    ('phone-case-yeees-purple', 'phc-22-purple-master', 10.00),
    ('notebook-im-fine-green', 'ntb-11-green-master', 5.00),
    ('phone-case-yeees-red', 'phc-22-red-master', 10.00),
    ('cork-notebook-take-a-junior-brown', 'cntbk-6-brown-master', 12.00),
    ('phone-case-wow-that-is-cool-purple', 'phc-10-purple-master', 10.00),
    ('sticker-set-01', 'sts-1-master', 2.00),
    ('sticker-set-04', 'sts-4-master', 2.00),
    ('phone-case-google-it-red', 'phc-14-red-master', 10.00),
    ('notebook-take-a-junior-white', 'ntb-6-white-master', 5.00),
    ('cork-notebook-wow-that-is-cool-brown', 'cntbk-10-brown-master', 12.00),
    ('cork-notebook-yeees-brown', 'cntbk-22-brown-master', 12.00),
    ('phone-case-google-it-purple', 'phc-14-purple-master', 10.00),
    ('sticker-set-02', 'sts-2-master', 2.00),
    ('notebook-take-a-junior-black', 'ntb-6-black-master', 5.00),
    ('cork-notebook-google-it-brown', 'cntbk-14-brown-master', 12.00),
    ('phone-case-im-fine-purple', 'phc-11-purple-master', 10.00),
    ('mouse-pad-google-it', 'mspd-14-black-master', 7.00),
    ('sticker-set-03', 'sts-3-master', 2.00),
    ('badge-google-it-white', 'bdg-14-white-master', 1.10),
    ('badge-take-a-junior-white', 'bdg-6-white-master', 1.10),
    ('notebook-im-fine-black', 'ntb-11-black-master', 5.00)
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

-- 4) Variant attribute: color-office (by master variant)
with prod_map(slug, color) as (
  values
    ('notebook-take-a-junior-orange', 'orange'),
    ('mouse-pad-im-fine', 'black'),
    ('notebook-take-a-junior-green', 'green'),
    ('notebook-im-fine-white', 'white'),
    ('cork-notebook-im-fine-brown', 'brown'),
    ('phone-case-wow-that-is-cool-red', 'red'),
    ('phone-case-im-fine-red', 'red'),
    ('notebook-im-fine-purple', 'purple'),
    ('mouse-pad-yeees', 'black'),
    ('notebook-take-a-junior-purple', 'purple'),
    ('notebook-im-fine-orange', 'orange'),
    ('mouse-pad-wow-that-is-cool', 'black'),
    ('badge-im-fine-white', 'white'),
    ('badge-wow-that-is-cool-white', 'white'),
    ('phone-case-yeees-purple', 'purple'),
    ('notebook-im-fine-green', 'green'),
    ('phone-case-yeees-red', 'red'),
    ('cork-notebook-take-a-junior-brown', 'brown'),
    ('phone-case-wow-that-is-cool-purple', 'purple'),
    ('sticker-set-01', 'multicolor'),
    ('sticker-set-04', 'multicolor'),
    ('phone-case-google-it-red', 'red'),
    ('notebook-take-a-junior-white', 'white'),
    ('cork-notebook-wow-that-is-cool-brown', 'brown'),
    ('cork-notebook-yeees-brown', 'brown'),
    ('phone-case-google-it-purple', 'purple'),
    ('sticker-set-02', 'multicolor'),
    ('notebook-take-a-junior-black', 'black'),
    ('cork-notebook-google-it-brown', 'brown'),
    ('phone-case-im-fine-purple', 'purple'),
    ('mouse-pad-google-it', 'black'),
    ('sticker-set-03', 'multicolor'),
    ('badge-google-it-white', 'white'),
    ('badge-take-a-junior-white', 'white'),
    ('notebook-im-fine-black', 'black')
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
 and ad.name = 'color-office'
on conflict (variant_id, attribute_definition_id)
do update set value = excluded.value;
