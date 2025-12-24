-- Indexes for search, filtering and sorting in product catalog
-- Related to: docs/CATALOG_API_ENHANCEMENTS_RU.md

-- Enable pg_trgm extension for full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Index for full-text search by product name
-- Uses pg_trgm for efficient ILIKE searches
CREATE INDEX IF NOT EXISTS idx_products_name_trgm
  ON products USING gin (name gin_trgm_ops);

-- Index for sorting by price (price asc/desc)
CREATE INDEX IF NOT EXISTS idx_product_variants_price
  ON product_variants(price);

-- Index for filtering by stock availability (inStock filter)
CREATE INDEX IF NOT EXISTS idx_product_variants_stock
  ON product_variants(stock);

-- Index for sorting by creation date (createdAt desc - newest first)
-- DESC index optimizes ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_products_created_at
  ON products(created_at DESC);

-- Index documentation comments
COMMENT ON INDEX idx_products_name_trgm IS 'Full-text search by product name (ILIKE)';
COMMENT ON INDEX idx_product_variants_price IS 'Sorting and filtering by price';
COMMENT ON INDEX idx_product_variants_stock IS 'Filtering products in stock (stock > 0)';
COMMENT ON INDEX idx_products_created_at IS 'Sorting by creation date (newest first)';
