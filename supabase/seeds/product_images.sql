-- Seed product images for initial 3 products with photos
-- Idempotent: safe to rerun multiple times
--
-- Products with images in storage:
-- 1. bdg-10-white-master (Badge Wow That Is Cool White)
-- 2. hd-9-white-6980f3-master (Hoodie Take a Junior White)
-- 3. t-1-blue-7703ff-master (T-Shirt I Did It Blue)
--
-- Storage bucket: catalog
-- Full storage path: catalog/variants/{sku}/{size}/{sku}.png
-- Example: catalog/variants/bdg-10-white-master/large/bdg-10-white-master.png
--
-- Image sizes: large (600x600), medium (384x384), small (120x120)
--
-- Grouping logic:
-- - All three sizes of one image have the same sort_order (0)
-- - Mapper filters by min sort_order and groups by size (large/medium/small)
-- - For future image galleries, use sort_order = 1, 2, 3, etc.

-- First, ensure sort_order is consistent for all existing images
-- (fixes any data that might exist from previous migrations)
UPDATE public.product_images
SET sort_order = 0
WHERE sort_order != 0;

-- Insert or update product images
with img_data(sku, size_folder, width, height, sort_order) as (
  values
    -- Badge Wow That Is Cool White (Office/Accessories)
    ('bdg-10-white-master', 'large',  600, 600, 0),
    ('bdg-10-white-master', 'medium', 384, 384, 0),
    ('bdg-10-white-master', 'small',  120, 120, 0),

    -- Hoodie Take a Junior White (Clothes/Hoodies)
    ('hd-9-white-6980f3-master', 'large',  600, 600, 0),
    ('hd-9-white-6980f3-master', 'medium', 384, 384, 0),
    ('hd-9-white-6980f3-master', 'small',  120, 120, 0),

    -- T-Shirt I Did It Blue (Clothes/T-shirt)
    ('t-1-blue-7703ff-master', 'large',  600, 600, 0),
    ('t-1-blue-7703ff-master', 'medium', 384, 384, 0),
    ('t-1-blue-7703ff-master', 'small',  120, 120, 0)
)
insert into public.product_images(variant_id, url, alt, width, height, is_primary, sort_order)
select
  pv.id as variant_id,
  'catalog/variants/' || img.sku || '/' || img.size_folder || '/' || img.sku || '.png' as url,
  p.name as alt,
  img.width,
  img.height,
  false as is_primary,  -- is_primary is deprecated, not used by mapper
  img.sort_order
from img_data img
join public.product_variants pv on pv.sku = img.sku
join public.products p on p.id = pv.product_id
on conflict (variant_id, url) do update
  set alt = excluded.alt,
      width = excluded.width,
      height = excluded.height,
      is_primary = excluded.is_primary,
      sort_order = excluded.sort_order;
