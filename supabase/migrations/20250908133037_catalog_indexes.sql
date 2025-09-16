create index if not exists idx_products_type on products(product_type_id);
create index if not exists idx_products_slug on products(slug);

create index if not exists idx_categories_parent on categories(parent_id);
create index if not exists idx_product_categories_category on product_categories(category_id);

create index if not exists idx_variants_product on product_variants(product_id);
create index if not exists idx_images_variant on product_images(variant_id, is_primary, sort_order);

create index if not exists idx_discounts_variant on product_discounts(variant_id);
create index if not exists idx_discounts_product on product_discounts(product_id);
create index if not exists idx_discounts_priority on product_discounts(priority desc, updated_at desc);

create index if not exists idx_coupons_active on coupons(is_active, valid_from, valid_to);
