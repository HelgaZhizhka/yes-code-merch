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
    ('clothes',    'clothes',    'Clothes',     null, '0.09', null, null, null, null),
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
