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
