-- Cleanup duplicate indexes and move pg_trgm extension
-- Fixes Supabase Lint warnings

-- =====================================================
-- 1. Remove duplicate UNIQUE indexes
-- =====================================================
-- These indexes duplicate automatic indexes created by UNIQUE constraints
-- Keep automatic (*_key) indexes, remove explicitly created (uniq_*) ones

DROP INDEX IF EXISTS public.uniq_products_slug;
DROP INDEX IF EXISTS public.uniq_categories_slug;
DROP INDEX IF EXISTS public.uniq_variants_sku;

-- =====================================================
-- 2. Remove duplicate regular index on products.slug
-- =====================================================
-- idx_products_slug duplicates products_slug_key (automatic UNIQUE index)
DROP INDEX IF EXISTS public.idx_products_slug;

-- =====================================================
-- 3. Move pg_trgm extension from public to extensions
-- =====================================================
-- Extensions are recommended to be in a separate schema

-- First drop dependent index
DROP INDEX IF EXISTS public.idx_products_name_trgm;

-- Now we can drop the extension from public
DROP EXTENSION IF EXISTS pg_trgm;

-- Create extension in extensions schema
CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA extensions;

-- =====================================================
-- 4. Recreate trigram index with correct schema
-- =====================================================
-- Index uses operators from extensions.pg_trgm
CREATE INDEX IF NOT EXISTS idx_products_name_trgm
  ON public.products USING gin (name extensions.gin_trgm_ops);

-- Index documentation comment
COMMENT ON INDEX public.idx_products_name_trgm IS 'Full-text search by product name (ILIKE) using pg_trgm from extensions';
