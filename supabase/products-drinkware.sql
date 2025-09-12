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
