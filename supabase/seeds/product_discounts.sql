-- Seed product_discounts for testing percentage discounts (Phase 1)
-- Idempotent: safe to rerun multiple times (uses ON CONFLICT)
--
-- IMPORTANT: This seed adds only percentage discounts (discount_type = 'percent')
-- Fixed amount discounts (discount_type = 'amount') will be added in Phase 2
--
-- Test scenarios:
-- 1. Permanent 10% discount on all T-Shirt category products (no time limit)
-- 2. Time-limited 20% discount on Shoppers category until New Year (valid until 2025-12-31)
-- 3. Inactive 15% discount for testing filtering logic

insert into public.product_discounts(
  id,
  name,
  description,
  discount_type,
  discount_value,
  product_id,
  variant_id,
  priority,
  valid_from,
  valid_to,
  is_active
)
-- Use deterministic UUIDs (uuid_generate_v5) for idempotency
-- Namespace: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' (standard test namespace)
select
  uuid_generate_v5(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'tshirt-permanent-' || p.id::text
  ) as id,  -- Deterministic UUID based on product_id
  'T-Shirt Permanent Sale' as name,
  'Permanent 10% discount on all T-Shirt products' as description,
  'percent'::text as discount_type,
  10::numeric as discount_value,
  p.id as product_id,
  null::uuid as variant_id,  -- Apply to entire product (all variants)
  10::integer as priority,
  null::timestamptz as valid_from,  -- No start date (always active)
  null::timestamptz as valid_to,    -- No end date (permanent)
  true::boolean as is_active
from products p
join product_categories pc on pc.product_id = p.id
join categories c on c.id = pc.category_id
where c.slug = 't-shirt'  -- T-Shirt category
  and p.is_published = true

union all

select
  uuid_generate_v5(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'shoppers-newyear-' || p.id::text
  ),  -- Deterministic UUID based on product_id
  'Shoppers New Year Sale',
  '20% discount on all Shopper Bags until New Year',
  'percent'::text,
  20::numeric,
  p.id,
  null::uuid,  -- Apply to entire product (all variants)
  15::integer,  -- Higher priority than T-Shirt discount
  '2025-11-24 00:00:00+00'::timestamptz,  -- Started today
  '2025-12-31 23:59:59+00'::timestamptz,  -- Valid until New Year
  true::boolean
from products p
join product_categories pc on pc.product_id = p.id
join categories c on c.id = pc.category_id
where c.slug = 'shoppers'  -- Shoppers category
  and p.is_published = true

union all

select
  uuid_generate_v5(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'tshirt-inactive-' || p.id::text
  ),  -- Deterministic UUID based on product_id
  'Inactive Test Discount',
  'This discount is disabled for testing is_active filtering',
  'percent'::text,
  15::numeric,
  p.id,
  null::uuid,
  20::integer,  -- Even higher priority, but inactive
  null::timestamptz,
  null::timestamptz,
  false::boolean  -- INACTIVE - should not be applied!
from (
  select p.id
  from products p
  join product_categories pc on pc.product_id = p.id
  join categories c on c.id = pc.category_id
  where c.slug = 't-shirt'  -- T-Shirt category
    and p.is_published = true
  limit 1  -- Apply to only one T-shirt product for testing
) p
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  discount_type = excluded.discount_type,
  discount_value = excluded.discount_value,
  product_id = excluded.product_id,
  variant_id = excluded.variant_id,
  priority = excluded.priority,
  valid_from = excluded.valid_from,
  valid_to = excluded.valid_to,
  is_active = excluded.is_active;
