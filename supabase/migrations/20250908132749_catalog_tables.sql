-- product_types
create table if not exists product_types (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text
);

-- products
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  is_published boolean not null default false,
  product_type_id uuid not null references product_types(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- categories
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  parent_id uuid references categories(id) on delete set null,
  order_hint text not null default '0',
  meta_title text,
  meta_description text,
  meta_keywords text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- product ↔ category
create table if not exists product_categories (
  product_id uuid not null references products(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  primary key (product_id, category_id)
);

-- variants
create table if not exists product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  sku text unique not null,
  price numeric(12,2) not null,
  currency char(3) not null default 'EUR',
  stock int not null default 0,
  is_master boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- attribute definitions
create table if not exists attribute_definitions (
  id uuid primary key default uuid_generate_v4(),
  product_type_id uuid not null references product_types(id) on delete cascade,
  name text not null,
  label text,
  type text not null,
  is_required boolean not null default false,
  is_variant_attribute boolean not null default true
);

-- unique index for attribute_definitions on (product_type_id, name)
create unique index if not exists uniq_attribute_definitions_ptype_name
  on attribute_definitions(product_type_id, name);
-- product-level attributes
create table if not exists product_attributes (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  attribute_definition_id uuid not null references attribute_definitions(id) on delete cascade,
  value jsonb not null
);

-- variant-level attributes
create table if not exists product_variant_attributes (
  id uuid primary key default uuid_generate_v4(),
  variant_id uuid not null references product_variants(id) on delete cascade,
  attribute_definition_id uuid not null references attribute_definitions(id) on delete cascade,
  value jsonb not null
);

-- images
create table if not exists product_images (
  id uuid primary key default uuid_generate_v4(),
  variant_id uuid not null references product_variants(id) on delete cascade,
  url text not null,
  alt text,
  width int,
  height int,
  is_primary boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- product discounts
create table if not exists product_discounts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  discount_type text not null,
  discount_value numeric(12,2) not null,
  product_id uuid references products(id) on delete cascade,
  variant_id uuid references product_variants(id) on delete cascade,
  priority int not null default 0,
  valid_from timestamptz,
  valid_to timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_discounts_type_chk check (discount_type in ('percent','amount'))
);

-- coupons
create table if not exists coupons (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  name text not null,
  description text,
  discount_type text not null,
  discount_value numeric(12,2) not null,
  applies_to text not null default 'cart',
  product_id uuid references products(id) on delete cascade,
  variant_id uuid references product_variants(id) on delete cascade,
  valid_from timestamptz,
  valid_to timestamptz,
  is_active boolean not null default true,
  min_order_total numeric(12,2) not null default 0,
  max_redemptions_per_user int,
  max_redemptions int,
  used_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint coupons_type_chk check (discount_type in ('percent','amount')),
  constraint coupons_applies_chk check (applies_to in ('cart','product'))
);
