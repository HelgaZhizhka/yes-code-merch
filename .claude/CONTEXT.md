# Project Context & Memory

This file tracks significant changes, decisions, and context for the yes-code-merch project.

---

### 2026-01-22 - Product Search/Pagination/Sort/Filter API

**Note:** Merged with discount feature from develop (`f00dd4e - Implement Calculation Price with Discounts`)

- **Changes**:

  - `entities/product/api/types.ts` - Added `ProductSortField`, extended `CatalogParams`, added `PaginationMeta`, `PaginatedCatalogProducts`
  - `entities/product/api/index.ts` - Added search (`ilike`), price filters (`gte/lte`), stock filter (`gt`), sorting (`order`), pagination (`range`), count (`{ count: 'exact' }`)
  - `entities/product/api/hooks.ts` - Updated `useProducts` to return `PaginatedCatalogProducts` with metadata
  - `entities/product/index.ts` - Exported new types
  - `pages/catalog/ui/catalog-list/index.tsx` - Updated to use `paginatedProducts.data`

- **Decisions**:

  - Used `ilike` for search (simple, case-insensitive) instead of full-text search (overkill for current needs)
  - Price filter on `product_variants.price` (cents) - filters master variant only
  - Server-side pagination with `range()` - better for large catalogs
  - Query key includes all params for proper cache invalidation per filter combination
  - Defaults: page=1, pageSize=12, sortField='created_at', sortDirection='desc'

- **Tech Debt/Next**:
  - UI components for search input, price filter, sort select, pagination not yet implemented
  - Consider full-text search if product catalog grows significantly
  - May need debouncing for search input in UI layer

---

### 2026-01-30 - Unit Testing for Business Logic & Search Validation

- **Changes**:

  - `entities/product/lib/calculate-discount.test.ts` - 19 tests covering discount logic
  - `entities/product/lib/catalog-search-schema.test.ts` - 14 tests for Zod schema
  - `docs/SEARCH.md` - Added search input escaping note (PostgREST injection prevention)
  - `docs/TESTING-GUIDE.md` - Added "When to Write Tests" section with decision table
  - `pnpm-lock.yaml` - Fixed frozen-lockfile CI mismatch (vitest packages)

- **Decisions**:

  - Test business logic (discounts, calculations) and validation (Zod schemas) only
  - Skip tests for mappers (TypeScript coverage), navigation hooks (E2E), simple components (Storybook)
  - Escape special PostgREST chars in search: `,`, `%`, `(`, `)`, `\` to prevent filter injection
  - E2E testing deferred to separate sprint when full cart/order flow is ready

- **Tech Debt/Next**:
  - E2E tests with Playwright when cart and checkout are implemented
  - Consider adding integration tests for React Query hooks if needed
