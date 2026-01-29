# Product Catalog Search, Sorting & Pagination

This document describes the product catalog functionality: search, sorting, filtering, and pagination. It serves as a guide for implementing UI components on top of the existing API foundation.

---

## Overview

The catalog uses a **PostgreSQL VIEW** called `products_search` to efficiently query products with support for:

- **Search** — case-insensitive text search by name and description
- **Sorting** — by price, name, or creation date (ascending/descending)
- **Pagination** — page-based with configurable page size
- **Price filtering** — min/max price range
- **URL state** — all params synced to URL via TanStack Router

---

## Architecture

### Why a DATABASE VIEW?

PostgREST (Supabase's REST API) cannot sort by columns from joined tables in one-to-many relationships. For example, sorting by `product_variants.price` fails because each product can have multiple variants.

**Solution:** A VIEW called `products_search` flattens the data structure by joining `products` with their master variant. This makes `price` a direct column that can be sorted and filtered without limitations.

```
┌─────────────────────────────────────────┐
│           products_search VIEW           │
│                                         │
│  products + product_variants (master)   │
│  + primary_image + discounts            │
│  + category                             │
│                                         │
│  Result: flat table with all fields     │
│  → can sort by price directly           │
│  → can filter by any column             │
└─────────────────────────────────────────┘
```

**Why VIEW is portable:**

- Standard SQL — works in any database (PostgreSQL, MySQL, etc.)
- No data duplication — executes the JOIN query on each request
- Easy to migrate — just copy the SQL script to another database
- The client code (`getCatalogProducts`) stays the same regardless of backend

### Migration file

**Location:** `supabase/migrations/20260127_create_products_search_view.sql`

The VIEW includes:

- Product fields: `id`, `name`, `slug`, `description`, `created_at`
- Master variant fields: `variant_id`, `price`, `sku`, `currency`, `stock`
- Primary image: `primary_image_url` (first image by sort_order)
- Discounts: `product_discounts` (JSONB array of active discounts)
- Category: `category_id`

### API Layer

**Location:** `src/entities/product/api/index.ts`

The `getCatalogProducts` function queries the VIEW:

```typescript
import { supabase } from '@shared/api/supabase-client';

export const getCatalogProducts = async (
  params: CatalogParams
): Promise<CatalogProductsViewResponse> => {
  const {
    categoryIds,
    search,
    priceMin,
    priceMax,
    page,
    pageSize,
    sortField,
    sortDirection,
  } = params;

  // 1. Base query to the VIEW
  let query = supabase
    .from('products_search')
    .select('*', { count: 'exact' }) // count for pagination meta
    .in('category_id', categoryIds); // filter by category

  // 2. Search (optional)
  // Escape special PostgREST characters to prevent filter injection
  if (search) {
    const escapedSearch = search.replaceAll(/[,%()\\]/g, String.raw`\$&`);
    query = query.or(
      `name.ilike.%${escapedSearch}%,description.ilike.%${escapedSearch}%`
    );
  }

  // 3. Price range filter (optional)
  if (priceMin !== undefined) {
    query = query.gte('price', priceMin); // greater than or equal to a value
  }
  if (priceMax !== undefined) {
    query = query.lte('price', priceMax); // less than or equal to a value
  }

  // 4. Sorting — price works because it's a direct column in VIEW
  query = query.order(sortField, { ascending: sortDirection === 'asc' });

  // 5. Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return { data: data ?? [], count: count ?? 0 };
};
```

### Mapper

**Location:** `src/entities/product/api/mapper.ts`

`mapFromViewToCatalogProducts` transforms flat VIEW data into `CatalogProduct[]`:

```typescript
// VIEW returns flat data:
// { id, name, price, product_discounts: [...], primary_image_url, ... }

// Mapper produces:
// { productId, name, originalPrice, finalPrice, hasDiscount, images, ... }
```

- Applies discounts via `applyDiscountsToProduct()` (existing logic)
- Generates image URLs (large/medium/small) from `primary_image_url`
- Filters out records with missing required fields

### React Hook

**Location:** `src/entities/product/api/hooks.ts`

```typescript
// Usage in components:
const { data } = useProducts({
  categoryIds: ['clothes'],
  search: 'shirt',
  sortField: 'price',
  sortDirection: 'asc',
  page: 1,
  pageSize: 12,
});

// data.data — CatalogProduct[]
// data.meta — { page, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage }
```

### URL State Management

**Location:** `src/entities/product/model/use-catalog-search.ts`

The `useCatalogSearch` hook provides helpers for updating URL params:

```typescript
const {
  searchParams, // Current params from URL
  setSearchQuery, // Update search text (resets page to 1)
  setPage, // Update page number
  setSorting, // Update sort field/direction (resets page to 1)
  setPriceRange, // Update price min/max (resets page to 1)
  resetSearch, // Reset all params to defaults
  updateSearch, // Generic update (merge params)
} = useCatalogSearch();
```

### Zod Schema (URL validation)

**Location:** `src/entities/product/lib/catalog-search-schema.ts`

```typescript
export const catalogSearchSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(12),
  search: z.string().optional(),
  priceMin: z.number().int().nonnegative().optional(),
  priceMax: z.number().int().nonnegative().optional(),
  sortField: z.enum(['name', 'price', 'created_at']).default('created_at'),
  sortDirection: z.enum(['asc', 'desc']).default('desc'),
});
```

---

## Data Flow

```
URL: /category/clothes?search=shirt&sortField=price&page=2

1. TanStack Router validates URL params via Zod schema
2. Component calls useCatalogSearch() → gets searchParams
3. Component calls useProducts(searchParams)
4. useProducts → getCatalogProducts() → queries products_search VIEW
5. VIEW executes JOIN (products + master variant + discounts) on the fly
6. Response: flat array + total count
7. Mapper: applies discounts, generates image URLs → CatalogProduct[]
8. React Query caches result (5 minutes)
9. Component renders product cards
```

---

## UI Implementation Guide

### What's available to you:

```typescript
// Hook to manage search params
const {
  searchParams,
  setSearchQuery,
  setPage,
  setSorting,
  setPriceRange,
  resetSearch,
} = useCatalogSearch();

// data.data — array of products to render
// data.meta — pagination info { totalPages, hasNextPage, hasPreviousPage, ... }
// meta as props for pagination
```
### Tasks to implement:

#### 1. Search Input (`catalog-search/`)

The search should trigger only on **Enter key press or button click** — not on every keystroke. This reduces API calls and gives the user control over when to search.

**What to implement:**

- Text input for the search query
- Search triggers on form submit (Enter key or button click)
- Show clear button when search is active
- Clear button resets search and shows all products
- Input should reflect current URL search param (for page refresh)

**Hints:**

- Use `<form>` with `onSubmit` — this handles both Enter and button click automatically
- Use local `useState` for the input value (what user types)
- Use `searchParams.search` from `useCatalogSearch()` to sync input with URL on page load
- Call `setSearchQuery(value)` only on form submit, not on every input change
- Don't forget `e.preventDefault()` in the submit handler

#### 2. Sort Controls (`catalog-sort/`)

```typescript
const CatalogSort = () => {
  const { searchParams, setSorting } = useCatalogSearch();

  // Available sort options:
  // sortField: 'name' | 'price' | 'created_at'
  // sortDirection: 'asc' | 'desc'

  // TODO: Create sort selector (dropdown or buttons)
  // TODO: Show current sort from searchParams.sortField + searchParams.sortDirection
  // TODO: On change → call setSorting(field, direction)

  return (
    <div>
      {/* TODO: Sort field selector */}
      {/* TODO: Sort direction toggle (asc/desc) */}
    </div>
  );
};
```

#### 3. Price Filter (`catalog-price-filter/`)

**Important:** Prices in the database are stored in **cents** (smallest currency unit).

- Database value `1500` = displayed as `15.00`
- When sending to API: multiply user input by 100
- When displaying: divide by 100

**What to implement:**

- Two number inputs: min price and max price
- Inputs show prices in the user-friendly format (e.g. `15.00`)
- On submit → convert to cents and call `setPriceRange(minCents, maxCents)`
- Sync input values with current URL params on page load
- Consider using form submit (like search) instead of debounce

#### 4. Pagination (`catalog-pagination/`)

```typescript
const CatalogPagination = () => {
  const { searchParams, setPage } = useCatalogSearch();
  const { data } = useProducts({ categoryIds, ...searchParams });

  const { totalPages, hasNextPage, hasPreviousPage, page } = data.meta;

  // TODO: Render page numbers (1, 2, 3, ...)
  // TODO: Previous/Next buttons
  // TODO: Highlight current page
  // TODO: On page click → call setPage(pageNumber)
  // TODO: Disable prev button on first page, next button on last page

  return (
    <nav>
      {/* TODO: Previous button */}
      {/* TODO: Page number buttons */}
      {/* TODO: Next button */}
    </nav>
  );
};
```

---

## Important Notes

### Price sorting uses base price

Sorting is done by `price` (base price from master variant), not by `finalPrice` (after discounts). The discount calculation happens client-side in the mapper.

If sorting by discounted price becomes important, the VIEW or query logic would need to be updated.

### Images

Each product has one primary image URL from the VIEW. The mapper generates 3 sizes:

- `images.large` — original
- `images.medium` — medium size
- `images.small` — small size

All can be `null` if no image is set.

### Stock

Currently all products have `stock = 0` (not yet used in the project). Products with `stock = null` are filtered out by the mapper as a data integrity check.

### Future: Variant attribute filters

When implementing filters by size, color, etc., the approach will be:

```typescript
// Filter by attribute (any variant, not just master)
// This will be a separate task
if (size) {
  // Show product if ANY of its variants matches
  // Implementation details TBD
}
```

The VIEW stays the same — attribute filtering will use additional subqueries.

---

## Testing Checklist

After implementing UI components, verify:

- [ ] Search finds products by name (case-insensitive)
- [ ] Search finds products by description
- [ ] Partial matching works ("shir" finds "shirt")
- [ ] URL updates with search query
- [ ] Page resets to 1 when search/sort/filter changes
- [ ] Sort by price ascending works
- [ ] Sort by price descending works
- [ ] Sort by name works
- [ ] Sort by date works
- [ ] Price filter min/max works
- [ ] Pagination shows correct pages
- [ ] Next/Prev buttons work
- [ ] Refresh page preserves all URL params
- [ ] Discounts are shown (finalPrice < originalPrice)

---

## URL Examples

```bash
# Basic catalog
/category/clothes

# Search
/category/clothes?search=shirt

# Sort by price ascending
/category/clothes?sortField=price&sortDirection=asc

# Price range
/category/clothes?priceMin=500&priceMax=2000

# Full combination
/category/clothes?search=shirt&sortField=price&sortDirection=asc&priceMin=500&page=2
```

---

## File Structure Reference

```
src/
├── entities/product/
│   ├── api/
│   │   ├── constants.ts          # DEFAULT_PAGE, SORT_FIELDS, etc.
│   │   ├── index.ts              # getCatalogProducts() — API query
│   │   ├── hooks.ts              # useProducts() — React Query hook
│   │   ├── mapper.ts             # VIEW data → CatalogProduct[]
│   │   └── types.ts              # ProductSearchViewDTO, CatalogProduct, etc.
│   ├── lib/
│   │   └── catalog-search-schema.ts  # Zod schema for URL params
│   └── model/
│       └── use-catalog-search.ts     # Hook for managing URL search params
├── pages/catalog/
│   └── ui/
│       ├── catalog-content/      # Main catalog component
│       ├── catalog-header/       # Header area
│       └── [your new components] # TODO: search, sort, pagination, filters
└── app/routing/
    └── routes.ts                 # Route config with validateSearch
```
