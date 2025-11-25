-- Convert product prices from decimal (EUR) to integer (cents)
-- This migration converts all prices to use cents for better precision and performance

-- Step 1: Convert price column to integer (multiply by 100)
ALTER TABLE public.product_variants
ALTER COLUMN price TYPE INTEGER
USING (price * 100)::INTEGER;

-- Step 2: Add comment for documentation
COMMENT ON COLUMN public.product_variants.price IS 'Price in cents (e.g., 3000 = €30.00)';

-- Verify conversion (example query to check after migration)
-- SELECT sku, price, price::float / 100 as price_in_euros FROM product_variants LIMIT 5;
