drop policy if exists categories_public_read                   on categories;
drop policy if exists product_categories_public_read           on product_categories;
drop policy if exists products_public_read_published           on products;
drop policy if exists variants_public_read_if_parent_published on product_variants;
drop policy if exists images_public_read_if_parent_published   on product_images;
drop policy if exists attr_defs_public_read                    on attribute_definitions;
drop policy if exists prod_attrs_public_read_if_published      on product_attributes;
drop policy if exists var_attrs_public_read_if_published       on product_variant_attributes;
drop policy if exists discounts_public_read_active             on product_discounts;

-- 1)  RLS
alter table products                      enable row level security;
alter table product_variants              enable row level security;
alter table product_images                enable row level security;
alter table attribute_definitions         enable row level security;
alter table product_attributes            enable row level security;
alter table product_variant_attributes    enable row level security;
alter table categories                    enable row level security;
alter table product_categories            enable row level security;
alter table product_discounts             enable row level security;
alter table coupons                       enable row level security;

-- categories
create policy categories_public_read
  on categories for select
  using (true);

-- product_categories
create policy product_categories_public_read
  on product_categories for select
  using (true);

-- products
create policy products_public_read_published
  on products for select
  using (is_published = true);

-- variants
create policy variants_public_read_if_parent_published
  on product_variants for select
  using (
    exists (
      select 1 from products p
      where p.id = product_variants.product_id
        and p.is_published = true
    )
  );

-- images
create policy images_public_read_if_parent_published
  on product_images for select
  using (
    exists (
      select 1
      from product_variants v
      join products p on p.id = v.product_id
      where v.id = product_images.variant_id
        and p.is_published = true
    )
  );

-- attribute_definitions
create policy attr_defs_public_read
  on attribute_definitions for select
  using (true);

-- product_attributes
create policy prod_attrs_public_read_if_published
  on product_attributes for select
  using (
    exists (
      select 1 from products p
      where p.id = product_attributes.product_id
        and p.is_published = true
    )
  );

-- product_variant_attributes
create policy var_attrs_public_read_if_published
  on product_variant_attributes for select
  using (
    exists (
      select 1
      from product_variants v
      join products p on p.id = v.product_id
      where v.id = product_variant_attributes.variant_id
        and p.is_published = true
    )
  );

-- product_discounts
create policy discounts_public_read_active
  on product_discounts for select
  using (
    is_active = true
    and (valid_from is null or now() >= valid_from)
    and (valid_to   is null or now() <= valid_to)
  );

-- coupons

-- grant execute on functions to anon, authenticated
grant execute on function
  get_category_subtree(uuid),
  get_category_ancestors(uuid),
  get_effective_variant_price(uuid),
  list_products_by_category(uuid, text, text, int, int),
  get_catalog(uuid, text, text, text, int, int)
to anon, authenticated;

grant select on table v_plp_products to anon, authenticated;
