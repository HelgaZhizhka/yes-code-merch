# Product Filters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement context-aware product filtering (price + color + size) over the existing Supabase catalog, with URL-driven state and SSR-ready router loaders.

**Architecture:** Extend the existing `products_search` PostgreSQL view with array aggregates for `colors`, `sizes`, and `category_ids`. Add an RPC `get_catalog_filter_options` for available filter values per category context. Drive UI from URL via Zod schema. Use `queryOptions` factories to share queries between router loader (`ensureQueryData`) and components (`useQuery` + `placeholderData` for smooth transitions).

**Tech Stack:** Supabase (PostgreSQL + PostgREST + RPC), TanStack Router (loaders), TanStack Query v5 (queryOptions, placeholderData), React 18, TypeScript, Tailwind CSS, Radix Slider, Zod, Vitest, Storybook 8.

**Spec:** [`docs/superpowers/specs/2026-05-01-product-filters-design.md`](../specs/2026-05-01-product-filters-design.md)

---

## File Structure

### New files

| Path | Responsibility |
|---|---|
| `supabase/migrations/20260501_extend_products_search_for_filters.sql` | Replace view with attribute aggregates + new RPC + indexes |
| `src/entities/product/api/filter-options.ts` | `getFilterOptions(categoryIds)` — calls RPC |
| `src/entities/product/api/queries.ts` | `productQueries.catalog`, `productQueries.filterOptions` factories |
| `src/entities/product/api/queries.test.ts` | Unit tests for query factories (key shape) |
| `src/entities/product/api/filter-options.test.ts` | Unit test for filter-options mapper |
| `src/shared/api/categories/queries.ts` | `categoriesTreeQueryOptions` factory for loader use |
| `src/pages/catalog/lib/catalog-text.ts` | All UI strings + ARIA labels (`CATALOG_TEXT`) |
| `src/pages/catalog/lib/index.ts` | Re-exports |
| `src/pages/catalog/ui/catalog-filters/index.tsx` | Sidebar filters orchestrator (header + active-tags + sections) |
| `src/pages/catalog/ui/catalog-filters/filter-section.tsx` | Reusable accordion primitive `<FilterSection>` |
| `src/pages/catalog/ui/catalog-filters/filter-section.stories.tsx` | Storybook for FilterSection |
| `src/pages/catalog/ui/catalog-active-filters/index.tsx` | Color/size chips with X in sidebar top |
| `src/pages/catalog/ui/catalog-active-filters/index.stories.tsx` | |
| `src/pages/catalog/ui/catalog-color-filter/index.tsx` | Color circles multi-select |
| `src/pages/catalog/ui/catalog-color-filter/index.stories.tsx` | |
| `src/pages/catalog/ui/catalog-size-filter/index.tsx` | Size chips multi-select |
| `src/pages/catalog/ui/catalog-size-filter/index.stories.tsx` | |
| `src/pages/catalog/ui/catalog-price-filter/index.tsx` | Dual slider + 2 inputs + Apply |
| `src/pages/catalog/ui/catalog-price-filter/index.stories.tsx` | |
| `src/pages/catalog/ui/catalog-empty-state/index.tsx` | "No products found" + reset CTA |
| `src/pages/catalog/ui/catalog-empty-state/index.stories.tsx` | |
| `src/pages/catalog/ui/catalog-header/grid-view-toggle.tsx` | 4-col / 3-col toggle |
| `src/pages/catalog/ui/catalog-layout/index.tsx` | Wrapper (sidebar + content shell) extracted from page |
| `docs/FILTERS.md` | User-facing filter API documentation |

### Modified files

| Path | What changes |
|---|---|
| `src/app/styles/index.css` | + `--primary-soft`, `--primary-soft-border` CSS vars and Tailwind theme entries |
| `src/entities/product/api/index.ts` | + `colors`/`sizes` filters, `.overlaps('category_ids')` |
| `src/entities/product/api/types.ts` | + `colors`/`sizes` in `CatalogParams`, + `FilterOptions` interface |
| `src/entities/product/api/hooks.ts` | `useProducts` → `useQuery` + `placeholderData`; + `useFilterOptions` |
| `src/entities/product/api/mapper.ts` | Type updates only; behavior unchanged |
| `src/entities/product/lib/catalog-search-schema.ts` | + `colors[]`, `sizes[]`, `view` |
| `src/entities/product/lib/catalog-search-schema.test.ts` | + tests for colors/sizes/view |
| `src/entities/product/lib/constants.ts` | + `DEFAULT_VIEW`, `CATALOG_VIEWS` |
| `src/entities/product/model/use-catalog-search.ts` | + `toggleColor`, `toggleSize`, `setView`, `removeFilter`, `resetFilters` |
| `src/entities/product/index.ts` | Re-exports |
| `src/app/routing/index.tsx` | + `context: { queryClient }` |
| `src/app/routing/routes.ts` | + `loaderDeps`, `loader` on category route, defaults for `view` |
| `src/pages/catalog/index.tsx` | Use `<CatalogLayout>`; remove top-level Suspense (loader handles it) |
| `src/pages/catalog/ui/catalog-content/index.tsx` | Pass `view` to grid; render `<CatalogEmptyState>` when `count === 0`; `aria-busy` |
| `src/pages/catalog/ui/catalog-header/index.tsx` | + grid-view toggle + total count |
| `src/pages/catalog/ui/sidebar/index.tsx` | + `<CatalogFilters>` |
| `src/shared/ui/categories-tree/index.tsx` | Tree links navigate with `search: { view: prev.view }` |
| `docs/SEARCH.md` | Note that filter behaviour is now documented in `docs/FILTERS.md` |
| `.claude/CONTEXT.md` | New entry per project's GG protocol |

---

## Conventions used in this plan

- **Commands:** all run from repo root unless stated; package manager is `pnpm`.
- **Tests:** unit tests use `pnpm vitest run <path> --config vitest.unit.config.ts`. Storybook tests run via `pnpm test:storybook`.
- **TypeScript types from DB:** after every Supabase migration, regenerate types with `pnpm types:db:local` and verify `database.types.ts` reflects new view columns.
- **Commits:** conventional commits (the project uses commitlint). Each task ends with one commit.
- **DO NOT push to GitHub** unless explicitly told. All work stays on the `yes-100` branch locally until the user pushes.

---

## Phase 1 — Database

### Task 1: Create migration file with extended `products_search` view

**Files:**
- Create: `supabase/migrations/20260501_extend_products_search_for_filters.sql`

- [ ] **Step 1: Create the migration file**

Create `supabase/migrations/20260501_extend_products_search_for_filters.sql` with:

```sql
-- Extend products_search view with attribute aggregates for filtering.
-- Removes the LEFT JOIN on product_categories that produced duplicate rows
-- when a product belonged to multiple categories.

drop view if exists products_search;

create view products_search
with (security_invoker = true) as
select
  p.id,
  p.name,
  p.slug,
  p.description,
  p.created_at,
  p.is_published,
  p.product_type_id,
  pv.id as variant_id,
  pv.sku,
  pv.price,
  pv.currency,
  pv.stock,
  pv.is_master,
  (
    select pi.url
    from product_images pi
    where pi.variant_id = pv.id
    order by pi.sort_order
    limit 1
  ) as primary_image_url,
  (
    select jsonb_agg(jsonb_build_object(
      'id', pd.id,
      'name', pd.name,
      'discount_type', pd.discount_type,
      'discount_value', pd.discount_value,
      'priority', pd.priority,
      'valid_from', pd.valid_from,
      'valid_to', pd.valid_to,
      'is_active', pd.is_active,
      'variant_id', pd.variant_id,
      'product_id', pd.product_id
    ))
    from product_discounts pd
    where (pd.product_id = p.id or pd.variant_id = pv.id)
      and pd.is_active = true
  ) as product_discounts,
  (
    select array_agg(pc.category_id)
    from product_categories pc
    where pc.product_id = p.id
  ) as category_ids,
  (
    select array_agg(distinct (pva.value #>> '{}')::text)
    from product_variant_attributes pva
    join attribute_definitions ad on ad.id = pva.attribute_definition_id
    join product_variants pv2 on pv2.id = pva.variant_id
    where pv2.product_id = p.id
      and ad.name like '%color%'
  ) as colors,
  (
    select array_agg(distinct (pva.value #>> '{}')::text)
    from product_variant_attributes pva
    join attribute_definitions ad on ad.id = pva.attribute_definition_id
    join product_variants pv2 on pv2.id = pva.variant_id
    where pv2.product_id = p.id
      and ad.name = 'size-clothes'
  ) as sizes
from products p
inner join product_variants pv
  on pv.product_id = p.id and pv.is_master = true
where p.is_published = true;

grant select on products_search to authenticated, anon;

comment on view products_search is
  'Flattened view of published products with master variant data and attribute aggregates (colors, sizes, category_ids) for catalog search and filtering.';
```

- [ ] **Step 2: Apply migration locally**

Run: `pnpm supabase migration up` (or `supabase migration up` if globally installed)
Expected: migration applies cleanly, no errors. If using `supabase db reset` workflow, run that instead per project convention.

- [ ] **Step 3: Verify view structure**

Run:
```bash
psql "$SUPABASE_DB_URL" -c "\d products_search"
```
Or via Supabase Studio → Database → Views.

Expected: see columns `category_ids uuid[]`, `colors text[]`, `sizes text[]` in the view.

- [ ] **Step 4: Sanity-check data**

Run:
```sql
select id, name, category_ids, colors, sizes
from products_search
where slug = 'cap-im-fine-black';
```

Expected: one row with non-null `category_ids` array, `colors` containing `['black']`, `sizes` containing `['one-size']`.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260501_extend_products_search_for_filters.sql
git commit -m "feat(db): extend products_search view with attribute aggregates"
```

---

### Task 2: Add `get_catalog_filter_options` RPC and indexes

**Files:**
- Modify: `supabase/migrations/20260501_extend_products_search_for_filters.sql`

- [ ] **Step 1: Append RPC and indexes to the migration file**

Append at the end of `supabase/migrations/20260501_extend_products_search_for_filters.sql`:

```sql
-- RPC: returns available filter values for a set of categories.
-- Single round-trip used by the sidebar to populate color/size lists,
-- price range, and decide whether the size filter is shown at all.
create or replace function get_catalog_filter_options(p_category_ids uuid[])
returns table(
  colors text[],
  sizes text[],
  price_min int,
  price_max int,
  has_size_filter boolean
)
language sql stable security invoker
set search_path = public
as $$
  select
    (
      select array_agg(distinct c)
      from products_search ps, unnest(ps.colors) c
      where ps.category_ids && p_category_ids
        and ps.colors is not null
    ),
    (
      select array_agg(distinct s)
      from products_search ps, unnest(ps.sizes) s
      where ps.category_ids && p_category_ids
        and ps.sizes is not null
    ),
    (
      select min(price)::int
      from products_search
      where category_ids && p_category_ids
    ),
    (
      select max(price)::int
      from products_search
      where category_ids && p_category_ids
    ),
    exists(
      select 1 from products_search ps
      where ps.category_ids && p_category_ids
        and ps.sizes is not null
    );
$$;

grant execute on function get_catalog_filter_options(uuid[]) to authenticated, anon;

-- Supporting indexes (idempotent).
create index if not exists idx_pva_attr_value
  on product_variant_attributes (attribute_definition_id, ((value #>> '{}')));
create index if not exists idx_attr_def_name
  on attribute_definitions (name);
```

- [ ] **Step 2: Apply migration**

Run: `pnpm supabase migration up`
Expected: no errors.

- [ ] **Step 3: Smoke-test the RPC**

Run:
```sql
select * from get_catalog_filter_options(
  array(select id from categories where slug = 'clothes')
);
```

Expected: a single row with `colors` containing several values (e.g. `{'black','white','red',...}`), `sizes` non-null, `price_min`/`price_max` present, `has_size_filter = true`.

Run:
```sql
select * from get_catalog_filter_options(
  array(select id from categories where slug = 'drinkware')
);
```

Expected: `has_size_filter = false`, `sizes = null`, colors present.

- [ ] **Step 4: Regenerate Supabase types**

Run: `pnpm types:db:local`
Expected: `src/shared/api/database.types.ts` updated. Verify the `Views.products_search.Row` type now includes `category_ids: string[] | null`, `colors: string[] | null`, `sizes: string[] | null`. Verify `Functions.get_catalog_filter_options` exists with `Args: { p_category_ids: string[] }` and a `Returns` shape matching the RPC.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260501_extend_products_search_for_filters.sql src/shared/api/database.types.ts
git commit -m "feat(db): add get_catalog_filter_options RPC and supporting indexes"
```

---

## Phase 2 — Entity layer (types, API, queries, hooks)

### Task 3: Extend types with `colors`, `sizes`, `FilterOptions`

**Files:**
- Modify: `src/entities/product/api/types.ts`

- [ ] **Step 1: Add filter-related types**

Open `src/entities/product/api/types.ts`. Modify `CatalogParams` and add `FilterOptions`:

```ts
// Replace the existing CatalogParams definition with:
export interface CatalogParams {
  categoryIds: string[];
  search?: string;
  priceMin?: number;
  priceMax?: number;
  colors?: string[];
  sizes?: string[];
  page?: number;
  pageSize?: number;
  sortField?: ProductSortField;
  sortDirection?: SortDirection;
  view?: CatalogView;
}

// Append at the end of the file:
export interface FilterOptions {
  colors: string[];
  sizes: string[];
  priceMin: number;
  priceMax: number;
  hasSizeFilter: boolean;
}
```

(The `CatalogView` type comes from constants in Task 4. If TypeScript complains right now about the missing import, that's expected — Task 4 fixes it.)

- [ ] **Step 2: Verify TypeScript catches the missing import**

Run: `pnpm tsc -p tsconfig.json --noEmit` (or open the file in IDE)
Expected: error referencing `CatalogView`. This is intentional and resolved by Task 4.

- [ ] **Step 3: Commit**

Hold the commit until Task 4 lands so types compile. Skip step 3 here.

---

### Task 4: Add `CATALOG_VIEWS` constant and `CatalogView` type

**Files:**
- Modify: `src/entities/product/lib/constants.ts`
- Modify: `src/entities/product/api/types.ts`

- [ ] **Step 1: Add `CATALOG_VIEWS` and `DEFAULT_VIEW` to constants**

Open `src/entities/product/lib/constants.ts` and append at the end:

```ts
export const CATALOG_VIEWS = {
  GRID_4: 'grid-4',
  GRID_3: 'grid-3',
} as const;

export const DEFAULT_VIEW = CATALOG_VIEWS.GRID_4;
```

- [ ] **Step 2: Add `CatalogView` type next to `ProductSortField`**

Open `src/entities/product/api/types.ts`. Add the import alongside the existing `PRODUCT_SORT_FIELDS, SORT_DIRECTIONS` import:

```ts
import type {
  CATALOG_VIEWS,
  PRODUCT_SORT_FIELDS,
  SORT_DIRECTIONS,
} from '../lib/constants';
```

Then add the type next to `ProductSortField`:

```ts
export type CatalogView =
  (typeof CATALOG_VIEWS)[keyof typeof CATALOG_VIEWS];
```

- [ ] **Step 3: Update entity barrel exports**

Open `src/entities/product/lib/index.ts` and ensure constants are re-exported (it already does `export * from './constants'`, so nothing to add).

Open `src/entities/product/index.ts` and add `CatalogView`, `CATALOG_VIEWS`, `DEFAULT_VIEW` re-exports:

```ts
// Inside the existing `export type { ... } from './api/types'` block, add:
//   CatalogView,

// Inside the existing `export { ... } from './lib'` block, add:
//   CATALOG_VIEWS,
//   DEFAULT_VIEW,
```

- [ ] **Step 4: Verify types compile**

Run: `pnpm tsc -p tsconfig.json --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/entities/product/lib/constants.ts src/entities/product/api/types.ts src/entities/product/index.ts
git commit -m "feat(product): add CATALOG_VIEWS constant and CatalogView/FilterOptions types"
```

---

### Task 5: Implement `getFilterOptions` (TDD)

**Files:**
- Create: `src/entities/product/api/filter-options.ts`
- Create: `src/entities/product/api/filter-options.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/entities/product/api/filter-options.test.ts`:

```ts
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { getFilterOptions } from './filter-options';

const rpcMock = vi.fn();

vi.mock('@shared/api/supabase-client', () => ({
  supabase: {
    rpc: (...args: unknown[]) => rpcMock(...args),
  },
}));

describe('getFilterOptions', () => {
  beforeEach(() => {
    rpcMock.mockReset();
  });

  it('maps RPC payload to FilterOptions and supplies defaults for nullable fields', async () => {
    rpcMock.mockReturnValue({
      single: () => Promise.resolve({
        data: {
          colors: ['black', 'white'],
          sizes: ['m', 'l'],
          price_min: 1000,
          price_max: 5000,
          has_size_filter: true,
        },
        error: null,
      }),
    });

    const result = await getFilterOptions(['cat-1']);

    expect(rpcMock).toHaveBeenCalledWith('get_catalog_filter_options', {
      p_category_ids: ['cat-1'],
    });
    expect(result).toEqual({
      colors: ['black', 'white'],
      sizes: ['m', 'l'],
      priceMin: 1000,
      priceMax: 5000,
      hasSizeFilter: true,
    });
  });

  it('returns empty arrays and zero range when RPC returns nulls', async () => {
    rpcMock.mockReturnValue({
      single: () => Promise.resolve({
        data: {
          colors: null,
          sizes: null,
          price_min: null,
          price_max: null,
          has_size_filter: false,
        },
        error: null,
      }),
    });

    const result = await getFilterOptions(['cat-1']);

    expect(result).toEqual({
      colors: [],
      sizes: [],
      priceMin: 0,
      priceMax: 0,
      hasSizeFilter: false,
    });
  });

  it('throws when RPC returns an error', async () => {
    rpcMock.mockReturnValue({
      single: () => Promise.resolve({
        data: null,
        error: { message: 'rpc failed' },
      }),
    });

    await expect(getFilterOptions(['cat-1'])).rejects.toMatchObject({
      message: 'rpc failed',
    });
  });
});
```

- [ ] **Step 2: Run the test, expect failure**

Run: `pnpm vitest run src/entities/product/api/filter-options.test.ts --config vitest.unit.config.ts`
Expected: tests fail because `filter-options.ts` does not exist.

- [ ] **Step 3: Implement `getFilterOptions`**

Create `src/entities/product/api/filter-options.ts`:

```ts
import { supabase } from '@shared/api/supabase-client';

import type { FilterOptions } from './types';

export const getFilterOptions = async (
  categoryIds: string[]
): Promise<FilterOptions> => {
  const { data, error } = await supabase
    .rpc('get_catalog_filter_options', { p_category_ids: categoryIds })
    .single();

  if (error) throw error;

  return {
    colors: data?.colors ?? [],
    sizes: data?.sizes ?? [],
    priceMin: data?.price_min ?? 0,
    priceMax: data?.price_max ?? 0,
    hasSizeFilter: data?.has_size_filter ?? false,
  };
};
```

- [ ] **Step 4: Re-run tests**

Run: `pnpm vitest run src/entities/product/api/filter-options.test.ts --config vitest.unit.config.ts`
Expected: all 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/entities/product/api/filter-options.ts src/entities/product/api/filter-options.test.ts
git commit -m "feat(product): add getFilterOptions API"
```

---

### Task 6: Extend `getCatalogProducts` with attribute filters and array category lookup

**Files:**
- Modify: `src/entities/product/api/index.ts`

- [ ] **Step 1: Replace category filter and add attribute filters**

Open `src/entities/product/api/index.ts`. Replace the body of `getCatalogProducts` with:

```ts
import { supabase } from '@shared/api/supabase-client';

import type { CatalogParams, CatalogProductsViewResponse } from './types';

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_FIELD,
  SORT_DIRECTIONS,
} from '../lib';

export const getCatalogProducts = async (
  params: CatalogParams
): Promise<CatalogProductsViewResponse> => {
  const {
    categoryIds,
    search,
    priceMin,
    priceMax,
    colors,
    sizes,
    page = DEFAULT_PAGE,
    pageSize = DEFAULT_PAGE_SIZE,
    sortField = DEFAULT_SORT_FIELD,
    sortDirection = DEFAULT_SORT_DIRECTION,
  } = params;

  let query = supabase
    .from('products_search')
    .select('*', { count: 'exact' })
    .overlaps('category_ids', categoryIds);

  if (search) {
    const escapedSearch = search.replaceAll(/[,%()\\]/g, String.raw`\$&`);
    query = query.or(
      `name.ilike.%${escapedSearch}%,description.ilike.%${escapedSearch}%`
    );
  }

  if (priceMin !== undefined) {
    query = query.gte('price', priceMin);
  }

  if (priceMax !== undefined) {
    query = query.lte('price', priceMax);
  }

  if (colors && colors.length > 0) {
    query = query.overlaps('colors', colors);
  }

  if (sizes && sizes.length > 0) {
    query = query.overlaps('sizes', sizes);
  }

  query = query.order(sortField, {
    ascending: sortDirection === SORT_DIRECTIONS.ASC,
  });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: data ?? [],
    count: count ?? 0,
  };
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `pnpm tsc -p tsconfig.json --noEmit`
Expected: no errors. (`overlaps('category_ids', ...)` is valid because `category_ids` is now `string[] | null` after Task 2's regen.)

- [ ] **Step 3: Run existing tests**

Run: `pnpm vitest run --config vitest.unit.config.ts`
Expected: all existing tests pass.

- [ ] **Step 4: Manual smoke test**

Run: `pnpm dev` and open `/category/clothes` in the browser.
Expected: catalog renders the same products as before (no visible change yet — filters added are opt-in via params).

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/entities/product/api/index.ts
git commit -m "feat(product): support color/size filters and array category match"
```

---

### Task 7: Add `productQueries` factories with `placeholderData`

**Files:**
- Create: `src/entities/product/api/queries.ts`
- Create: `src/entities/product/api/queries.test.ts`

- [ ] **Step 1: Write a tiny test for query key shape**

Create `src/entities/product/api/queries.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import { productQueries } from './queries';

describe('productQueries', () => {
  it('produces a deterministic catalog query key including all params', () => {
    const opts = productQueries.catalog({
      categoryIds: ['cat-1'],
      colors: ['black'],
      page: 2,
    });

    expect(opts.queryKey[0]).toBe('products');
    expect(opts.queryKey[1]).toBe('catalog');
    expect(opts.queryKey[2]).toMatchObject({
      categoryIds: ['cat-1'],
      colors: ['black'],
      page: 2,
    });
  });

  it('produces a deterministic filter-options query key', () => {
    const opts = productQueries.filterOptions(['cat-1', 'cat-2']);

    expect(opts.queryKey).toEqual([
      'products',
      'filter-options',
      ['cat-1', 'cat-2'],
    ]);
  });
});
```

- [ ] **Step 2: Run the test, expect failure**

Run: `pnpm vitest run src/entities/product/api/queries.test.ts --config vitest.unit.config.ts`
Expected: fails because `queries.ts` does not exist.

- [ ] **Step 3: Create the queries module**

Create `src/entities/product/api/queries.ts`:

```ts
import { queryOptions } from '@tanstack/react-query';

import { getCatalogProducts } from './index';
import { getFilterOptions } from './filter-options';
import type { CatalogParams } from './types';

export const productQueries = {
  catalog: (params: CatalogParams) =>
    queryOptions({
      queryKey: ['products', 'catalog', params] as const,
      queryFn: () => getCatalogProducts(params),
      staleTime: 1000 * 60 * 5,
      placeholderData: (previous) => previous,
    }),
  filterOptions: (categoryIds: string[]) =>
    queryOptions({
      queryKey: ['products', 'filter-options', categoryIds] as const,
      queryFn: () => getFilterOptions(categoryIds),
      staleTime: 1000 * 60 * 60,
    }),
} as const;
```

- [ ] **Step 4: Re-run tests**

Run: `pnpm vitest run src/entities/product/api/queries.test.ts --config vitest.unit.config.ts`
Expected: both tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/entities/product/api/queries.ts src/entities/product/api/queries.test.ts
git commit -m "feat(product): add productQueries factories for catalog and filter options"
```

---

### Task 8: Refactor `useProducts` and add `useFilterOptions`

**Files:**
- Modify: `src/entities/product/api/hooks.ts`
- Modify: `src/entities/product/index.ts`

- [ ] **Step 1: Replace hooks file**

Open `src/entities/product/api/hooks.ts` and replace its content with:

```ts
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { createPaginationMeta, mapFromViewToCatalogProducts } from './mapper';
import { productQueries } from './queries';
import type {
  CatalogParams,
  CatalogProductsViewResponse,
  FilterOptions,
  PaginatedCatalogProducts,
} from './types';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../lib';

export const productKeys = {
  all: ['products'] as const,
  catalog: (params: CatalogParams) =>
    productQueries.catalog(params).queryKey,
  filterOptions: (categoryIds: string[]) =>
    productQueries.filterOptions(categoryIds).queryKey,
} as const;

const selectPaginatedProducts = (
  response: CatalogProductsViewResponse,
  page: number,
  pageSize: number
): PaginatedCatalogProducts => {
  const data = mapFromViewToCatalogProducts(response.data);
  const meta = createPaginationMeta(response.count, page, pageSize);
  return { data, meta };
};

export const useProducts = (params: CatalogParams) => {
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;

  return useQuery({
    ...productQueries.catalog(params),
    select: (response) => selectPaginatedProducts(response, page, pageSize),
  });
};

export const useFilterOptions = (
  categoryIds: string[]
): { data: FilterOptions } => {
  const { data } = useSuspenseQuery(productQueries.filterOptions(categoryIds));
  return { data };
};
```

- [ ] **Step 2: Update entity barrel re-exports**

Open `src/entities/product/index.ts` and ensure it exports `useFilterOptions` and `FilterOptions`:

```ts
// Inside the line `export { productKeys, useProducts } from './api/hooks';`
// extend to:
export { productKeys, useProducts, useFilterOptions } from './api/hooks';

// Inside the type re-exports block, add `FilterOptions`:
export type {
  AppliedDiscount,
  CatalogParams,
  CatalogProduct,
  CatalogView,
  FilterOptions,
  PaginatedCatalogProducts,
  PaginationMeta,
  ProductSortField,
  SortDirection,
} from './api/types';
```

- [ ] **Step 3: Verify typecheck**

Run: `pnpm tsc -p tsconfig.json --noEmit`
Expected: no errors.

- [ ] **Step 4: Update consumer that depends on Suspense behavior**

Open `src/pages/catalog/ui/catalog-content/index.tsx`. The current code destructures `data: { data, meta }` directly from `useProducts`. Because `useQuery` (without suspense) returns a result that may be undefined while loading, adjust:

```tsx
import { ProductList, useCatalogSearch, useProducts } from '@entities/product';

import { CatalogHeader } from '../catalog-header';
import { CatalogPagination } from '../catalog-pagination';

interface CatalogContentProps {
  categoryIds: string[] | null;
}

export const CatalogContent = ({
  categoryIds,
}: CatalogContentProps): React.JSX.Element | null => {
  const { searchParams } = useCatalogSearch();

  const query = useProducts({
    categoryIds: categoryIds ?? [],
    ...searchParams,
  });

  if (!categoryIds || categoryIds.length === 0) {
    return null;
  }

  if (!query.data) {
    return null; // Loader has already prefetched on first load; subsequent
                 // refetches keep previous data via placeholderData.
  }

  const { data: products, meta } = query.data;

  return (
    <div className="flex-1">
      <CatalogHeader />
      <ProductList products={products} />
      <CatalogPagination meta={meta} />
    </div>
  );
};
```

(This is a temporary scaffolding; the full refactor of `<CatalogContent>` happens in Task 25.)

- [ ] **Step 5: Manual smoke test**

Run: `pnpm dev`, navigate to `/category/clothes`.
Expected: products render. Refresh works. No console errors. (We have not added the loader yet, so the first navigation may briefly show no content — acceptable until Task 16.)

Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add src/entities/product/api/hooks.ts src/entities/product/index.ts src/pages/catalog/ui/catalog-content/index.tsx
git commit -m "refactor(product): use useQuery with placeholderData; add useFilterOptions"
```

---

## Phase 3 — URL state

### Task 9: Extend Zod schema with `colors`, `sizes`, `view` (TDD)

**Files:**
- Modify: `src/entities/product/lib/catalog-search-schema.ts`
- Modify: `src/entities/product/lib/catalog-search-schema.test.ts`

- [ ] **Step 1: Add failing tests for new fields**

Open `src/entities/product/lib/catalog-search-schema.test.ts` and append:

```ts
describe('catalogSearchSchema — filter extensions', () => {
  it('accepts and preserves colors array', () => {
    const result = catalogSearchSchema.parse({
      colors: ['black', 'red'],
    });
    expect(result.colors).toEqual(['black', 'red']);
  });

  it('accepts and preserves sizes array', () => {
    const result = catalogSearchSchema.parse({
      sizes: ['m', 'l'],
    });
    expect(result.sizes).toEqual(['m', 'l']);
  });

  it('defaults view to grid-4', () => {
    const result = catalogSearchSchema.parse({});
    expect(result.view).toBe('grid-4');
  });

  it('accepts grid-3 as a valid view', () => {
    const result = catalogSearchSchema.parse({ view: 'grid-3' });
    expect(result.view).toBe('grid-3');
  });

  it('rejects unknown view values', () => {
    expect(() =>
      catalogSearchSchema.parse({ view: 'list' })
    ).toThrow();
  });
});
```

- [ ] **Step 2: Run tests, expect failure**

Run: `pnpm vitest run src/entities/product/lib/catalog-search-schema.test.ts --config vitest.unit.config.ts`
Expected: 5 new tests fail (schema does not yet support these fields).

- [ ] **Step 3: Update the schema**

Open `src/entities/product/lib/catalog-search-schema.ts` and replace the schema definition:

```ts
import { z } from 'zod';

import {
  CATALOG_VIEWS,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_FIELD,
  DEFAULT_VIEW,
  PRODUCT_SORT_FIELDS,
  SORT_DIRECTIONS,
} from './constants';

export const catalogSearchSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(12),
  search: z.string().optional(),
  priceMin: z.number().int().nonnegative().optional(),
  priceMax: z.number().int().nonnegative().optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  view: z
    .enum([CATALOG_VIEWS.GRID_4, CATALOG_VIEWS.GRID_3])
    .default(DEFAULT_VIEW),
  sortField: z
    .enum([
      PRODUCT_SORT_FIELDS.NAME,
      PRODUCT_SORT_FIELDS.PRICE,
      PRODUCT_SORT_FIELDS.CREATED_AT,
    ])
    .default(DEFAULT_SORT_FIELD),
  sortDirection: z
    .enum([SORT_DIRECTIONS.ASC, SORT_DIRECTIONS.DESC])
    .default(DEFAULT_SORT_DIRECTION),
});

export type CatalogSearch = z.infer<typeof catalogSearchSchema>;
```

- [ ] **Step 4: Re-run tests**

Run: `pnpm vitest run src/entities/product/lib/catalog-search-schema.test.ts --config vitest.unit.config.ts`
Expected: all tests pass (existing 14 + new 5 = 19).

- [ ] **Step 5: Commit**

```bash
git add src/entities/product/lib/catalog-search-schema.ts src/entities/product/lib/catalog-search-schema.test.ts
git commit -m "feat(product): extend catalogSearchSchema with colors/sizes/view"
```

---

### Task 10: Extend `useCatalogSearch` with new setters

**Files:**
- Modify: `src/entities/product/model/use-catalog-search.ts`

- [ ] **Step 1: Replace the hook with the extended version**

Open `src/entities/product/model/use-catalog-search.ts` and replace its content with:

```ts
import { useNavigate, useSearch } from '@tanstack/react-router';

import type { CatalogSearch } from '../lib/catalog-search-schema';

type FilterTag = { type: 'color' | 'size'; value: string };

const toggleInArray = (array: string[] | undefined, value: string): string[] => {
  const current = array ?? [];
  return current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
};

export const useCatalogSearch = () => {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as CatalogSearch;

  const updateSearch = (
    updates: Partial<CatalogSearch>,
    options?: { resetScroll?: boolean; replace?: boolean }
  ): void => {
    navigate({
      to: '.',
      search: (prev: CatalogSearch) => ({ ...prev, ...updates }),
      resetScroll: options?.resetScroll ?? true,
      replace: options?.replace ?? false,
    });
  };

  const setPage = (page: number): void => {
    updateSearch({ page });
  };

  const setSearchQuery = (search: string): void => {
    updateSearch({ search, page: 1 });
  };

  const setSorting = (
    sortField: CatalogSearch['sortField'],
    sortDirection?: CatalogSearch['sortDirection']
  ): void => {
    updateSearch({
      sortField,
      ...(sortDirection && { sortDirection }),
      page: 1,
    });
  };

  const setPriceRange = (priceMin?: number, priceMax?: number): void => {
    updateSearch({ priceMin, priceMax, page: 1 });
  };

  const toggleColor = (color: string): void => {
    updateSearch({
      colors: toggleInArray(searchParams.colors, color),
      page: 1,
    });
  };

  const toggleSize = (size: string): void => {
    updateSearch({
      sizes: toggleInArray(searchParams.sizes, size),
      page: 1,
    });
  };

  const setColors = (colors: string[]): void => {
    updateSearch({ colors, page: 1 });
  };

  const setSizes = (sizes: string[]): void => {
    updateSearch({ sizes, page: 1 });
  };

  const setView = (view: CatalogSearch['view']): void => {
    updateSearch({ view });
  };

  const removeFilter = ({ type, value }: FilterTag): void => {
    if (type === 'color') {
      updateSearch({
        colors: (searchParams.colors ?? []).filter((c) => c !== value),
        page: 1,
      });
    } else {
      updateSearch({
        sizes: (searchParams.sizes ?? []).filter((s) => s !== value),
        page: 1,
      });
    }
  };

  const resetFilters = (): void => {
    updateSearch({
      colors: undefined,
      sizes: undefined,
      priceMin: undefined,
      priceMax: undefined,
      search: undefined,
      page: 1,
    });
  };

  return {
    searchParams,
    updateSearch,
    setPage,
    setSearchQuery,
    setSorting,
    setPriceRange,
    toggleColor,
    toggleSize,
    setColors,
    setSizes,
    setView,
    removeFilter,
    resetFilters,
  };
};
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm tsc -p tsconfig.json --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify nothing else breaks**

Run: `pnpm vitest run --config vitest.unit.config.ts`
Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/entities/product/model/use-catalog-search.ts
git commit -m "feat(product): add filter setters (toggleColor/Size, setView, removeFilter, resetFilters)"
```

---

### Task 11: Update `stripSearchParams` defaults to include `view`

**Files:**
- Modify: `src/app/routing/routes.ts`

- [ ] **Step 1: Update the route configuration**

Open `src/app/routing/routes.ts`. Find the two `createRoute` blocks for `catalogRoute` and `categoryRoute` (both have `validateSearch: catalogSearchSchema`). In each, update the import block at the top:

```ts
import {
  catalogSearchSchema,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_VIEW,
  PRODUCT_SORT_FIELDS,
  SORT_DIRECTIONS,
} from '@entities/product';
```

Then in each `stripSearchParams({ ... })` call, add `view: DEFAULT_VIEW,`:

```ts
search: {
  middlewares: [
    stripSearchParams({
      page: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
      sortField: PRODUCT_SORT_FIELDS.CREATED_AT,
      sortDirection: SORT_DIRECTIONS.DESC,
      view: DEFAULT_VIEW,
    }),
  ],
},
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm tsc -p tsconfig.json --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual smoke test**

Run: `pnpm dev`, open `/category/clothes`. Expected: URL stays clean (no `view=grid-4` in URL when default). Then run JavaScript: change view to grid-3 (we'll add UI later, for now: open DevTools and append `?view=grid-3` manually). Expected: page handles it.

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/app/routing/routes.ts
git commit -m "feat(routing): strip default view param from URL"
```

---

## Phase 4 — Router loader

### Task 12: Add `categoriesTreeQueryOptions` factory in shared/api

**Files:**
- Create: `src/shared/api/categories/queries.ts`
- Modify: `src/shared/api/index.ts`

- [ ] **Step 1: Create the queries factory**

Create `src/shared/api/categories/queries.ts`:

```ts
import { queryOptions } from '@tanstack/react-query';

import { getCategoriesTree } from './';

import { queryKey } from '../constants';

export const categoriesTreeQueryOptions = () =>
  queryOptions({
    queryKey: queryKey.categoriesTree,
    queryFn: getCategoriesTree,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
  });
```

- [ ] **Step 2: Re-export from `shared/api`**

Open `src/shared/api/index.ts` and add:

```ts
export { categoriesTreeQueryOptions } from './categories/queries';
```

- [ ] **Step 3: Update `useCategoriesTree` to use the factory (optional, for consistency)**

Open `src/shared/api/categories/hooks.ts`. Replace `useCategoriesTree` with:

```ts
import { useSuspenseQuery } from '@tanstack/react-query';

import { categoriesTreeQueryOptions } from './queries';
import { mapCategoriesTree } from './mapper';
import type { CategoryTree, CategoryTreeDTO } from './types';

export const useCategoriesTree = (): { data: CategoryTree[] } => {
  const { data } = useSuspenseQuery<CategoryTreeDTO[], Error, CategoryTree[]>({
    ...categoriesTreeQueryOptions(),
    select: mapCategoriesTree,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  return { data };
};
```

- [ ] **Step 4: Verify typecheck and tests**

Run: `pnpm tsc -p tsconfig.json --noEmit && pnpm vitest run --config vitest.unit.config.ts`
Expected: no errors, all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/shared/api/categories/queries.ts src/shared/api/categories/hooks.ts src/shared/api/index.ts
git commit -m "feat(shared/api): add categoriesTreeQueryOptions factory"
```

---

### Task 13: Add `context: { queryClient }` to the router

**Files:**
- Modify: `src/app/routing/index.tsx`

- [ ] **Step 1: Inspect current router setup**

Open `src/app/routing/index.tsx`. Locate the `createRouter` call and the place where `QueryClient` is constructed (likely in `src/app/index.tsx` or similar).

- [ ] **Step 2: Pass queryClient as router context**

Find or create the router with `context`:

```ts
// At the top of src/app/routing/index.tsx, ensure these imports:
import type { QueryClient } from '@tanstack/react-query';

// In the router-creation function, accept queryClient and pass into createRouter:
export const createAppRouter = (queryClient: QueryClient) =>
  createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
  });

// Add this declaration so loaders see the type:
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
```

(Adjust based on the file's existing structure. If the router is constructed inline elsewhere, refactor that call site to pass the queryClient.)

- [ ] **Step 3: Update the consumer in `app/index.tsx` (or wherever the router is rendered)**

Find where `<RouterProvider router={...} />` is rendered. Pass the `QueryClient` instance into `createAppRouter`. If `QueryClient` is created in the same component, this is a one-line refactor:

```tsx
const queryClient = new QueryClient({ /* existing config */ });
const router = useMemo(() => createAppRouter(queryClient), [queryClient]);
```

- [ ] **Step 4: Verify typecheck**

Run: `pnpm tsc -p tsconfig.json --noEmit`
Expected: no errors.

- [ ] **Step 5: Manual smoke test**

Run: `pnpm dev`, navigate around the app.
Expected: no regressions; everything renders as before.

Stop dev server.

- [ ] **Step 6: Commit**

```bash
git add src/app/routing/index.tsx src/app/index.tsx
git commit -m "feat(routing): expose queryClient via router context"
```

---

### Task 14: Add `loader` to category route

**Files:**
- Modify: `src/app/routing/routes.ts`

- [ ] **Step 1: Add loader to `categoryRoute`**

Open `src/app/routing/routes.ts`. Add imports at the top of the file:

```ts
import { categoriesTreeQueryOptions } from '@shared/api';
import { productQueries } from '@entities/product/api/queries';
```

Find `categoryRoute` and add `loaderDeps` + `loader`:

```ts
export const categoryRoute = (parentRoute: FlexibleRouteType) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: ROUTES.CATEGORY,
    component: Catalog,
    validateSearch: catalogSearchSchema,
    loaderDeps: ({ params }) => ({ slug: params._splat }),
    loader: async ({ context }) => {
      // Tree is needed both for breadcrumbs and to derive categoryIds.
      // Filter options depend on the resolved category, so prefetch tree first.
      await context.queryClient.ensureQueryData(categoriesTreeQueryOptions());
    },
    search: {
      middlewares: [
        stripSearchParams({
          page: DEFAULT_PAGE,
          pageSize: DEFAULT_PAGE_SIZE,
          sortField: PRODUCT_SORT_FIELDS.CREATED_AT,
          sortDirection: SORT_DIRECTIONS.DESC,
          view: DEFAULT_VIEW,
        }),
      ],
    },
  });
```

(Filter options are prefetched inside the catalog page once `categoryIds` are derived from the tree — see Task 23.)

Apply the same `loader` to `catalogRoute` (the path without `_splat`).

- [ ] **Step 2: Verify typecheck**

Run: `pnpm tsc -p tsconfig.json --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual smoke test**

Run: `pnpm dev`, navigate `/category/clothes`.
Expected: page renders with no errors, slightly faster initial load on subsequent navigations.

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/app/routing/routes.ts
git commit -m "feat(routing): preload categories tree via category route loader"
```

---

### Task 15: Make tree links preserve `view` and reset filters on navigation

**Files:**
- Modify: `src/shared/ui/categories-tree/index.tsx`

- [ ] **Step 1: Update `<Link>` to clear filters but preserve view**

Open `src/shared/ui/categories-tree/index.tsx`. Find the `<Link>` for category navigation (around line 53). Add the `search` prop:

```tsx
<Link
  to={ROUTES.CATEGORY}
  params={{ _splat: pathToUse }}
  preload={variant === 'mobile' ? false : 'intent'}
  search={(prev: { view?: 'grid-4' | 'grid-3' }) =>
    prev.view ? { view: prev.view } : {}
  }
  className={cn(linkVariants({ variant }))}
  activeProps={{ 'data-active': true, 'aria-current': 'page' }}
>
  {name}
</Link>
```

This clears `colors`, `sizes`, `priceMin`, `priceMax`, `search`, `page`, `sortField`, `sortDirection` on category change while preserving `view` (which is a UI preference).

- [ ] **Step 2: Verify typecheck**

Run: `pnpm tsc -p tsconfig.json --noEmit`
Expected: no errors. (`prev` is loosely typed because the `Link` doesn't know we're at a catalog route here. This is acceptable since the URL params are validated by `catalogSearchSchema` regardless.)

- [ ] **Step 3: Manual smoke test**

Run: `pnpm dev`. Open `/category/clothes?priceMin=1000&view=grid-3`. Click another category.
Expected: URL becomes `/category/<other>?view=grid-3` (filters dropped, view preserved).

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/shared/ui/categories-tree/index.tsx
git commit -m "feat(categories-tree): reset filters on category navigation, preserve view"
```

---

## Phase 5 — Design tokens & strings

### Task 16: Add `--primary-soft` and `--primary-soft-border` tokens

**Files:**
- Modify: `src/app/styles/index.css`

- [ ] **Step 1: Add the two CSS variables**

Open `src/app/styles/index.css`.

Inside `:root { ... }`, append:

```css
  --primary-soft: #fff3e8;
  --primary-soft-border: #ffd0a0;
```

Inside `@theme inline { ... }`, append (right after the existing primary entries):

```css
  --color-primary-soft: var(--primary-soft);
  --color-primary-soft-border: var(--primary-soft-border);
```

- [ ] **Step 2: Verify Tailwind picks up the new utilities**

Run: `pnpm dev`. In any component (e.g., a temporary `<div className="bg-primary-soft border border-primary-soft-border">test</div>`) verify the colors render. Remove the test div.

Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add src/app/styles/index.css
git commit -m "feat(styles): add --primary-soft and --primary-soft-border tokens"
```

---

### Task 17: Create `CATALOG_TEXT` strings module

**Files:**
- Create: `src/pages/catalog/lib/catalog-text.ts`
- Create: `src/pages/catalog/lib/index.ts`

- [ ] **Step 1: Create the strings module**

Create `src/pages/catalog/lib/catalog-text.ts`:

```ts
export const CATALOG_TEXT = {
  filters: {
    title: 'Filters',
    reset: 'Reset all',
    apply: 'Apply price',
    activeRegionLabel: 'Active filters',
    removeFilter: (value: string) => `Remove filter: ${value}`,
  },
  categories: {
    title: 'Categories',
  },
  size: {
    title: 'Size',
    legend: 'Size',
    chipAriaLabel: (size: string) => `Size: ${size}`,
  },
  color: {
    title: 'Color',
    legend: 'Color',
    swatchAriaLabel: (color: string) => `Color: ${color}`,
  },
  price: {
    title: 'Price',
    minLabel: 'Min',
    maxLabel: 'Max',
    rangeAriaLabel: 'Price range',
  },
  header: {
    searchPlaceholder: 'Search the catalog...',
    sortDefault: 'Default',
    sortNewest: 'Newest first',
    sortPriceAsc: 'Price: low to high',
    sortPriceDesc: 'Price: high to low',
    sortNameAsc: 'Name: A → Z',
    countLabel: (count: number) =>
      count === 1 ? '1 product' : `${count} products`,
  },
  view: {
    groupLabel: 'Grid view',
    grid4Label: 'Grid: 4 per row',
    grid3Label: 'Grid: 3 per row',
  },
  empty: {
    title: 'No products found',
    description:
      'No products match your filters. Try changing them or clearing the search query.',
    cta: 'Reset all filters',
  },
} as const;
```

- [ ] **Step 2: Create the lib barrel**

Create `src/pages/catalog/lib/index.ts`:

```ts
export { CATALOG_TEXT } from './catalog-text';
```

- [ ] **Step 3: Verify typecheck**

Run: `pnpm tsc -p tsconfig.json --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/catalog/lib/
git commit -m "feat(catalog): add CATALOG_TEXT strings module (pre-i18n)"
```

---

## Phase 6 — UI primitives

### Task 18: Create `<FilterSection>` accordion primitive

**Files:**
- Create: `src/pages/catalog/ui/catalog-filters/filter-section.tsx`
- Create: `src/pages/catalog/ui/catalog-filters/filter-section.stories.tsx`

- [ ] **Step 1: Create the component**

Create `src/pages/catalog/ui/catalog-filters/filter-section.tsx`:

```tsx
import { ChevronRight } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';

import { cn } from '@shared/lib/utils';

interface FilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

export const FilterSection = ({
  title,
  defaultOpen = true,
  children,
  className,
}: FilterSectionProps): React.JSX.Element => {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();

  return (
    <div className={cn('border-t border-border', className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={bodyId}
        className="flex w-full items-center justify-between py-3 text-left text-[13px] font-bold tracking-wide uppercase text-foreground"
      >
        <span>{title}</span>
        <ChevronRight
          className={cn(
            'h-3.5 w-3.5 text-muted-foreground transition-transform',
            open && 'rotate-90 text-primary'
          )}
          aria-hidden
        />
      </button>
      {open && (
        <div id={bodyId} className="pb-3.5">
          {children}
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Create Storybook story**

Create `src/pages/catalog/ui/catalog-filters/filter-section.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';

import { FilterSection } from './filter-section';

const meta: Meta<typeof FilterSection> = {
  title: 'Catalog/FilterSection',
  component: FilterSection,
};

export default meta;
type Story = StoryObj<typeof FilterSection>;

export const Open: Story = {
  args: {
    title: 'Color',
    defaultOpen: true,
    children: <p>Filter body content</p>,
  },
};

export const Closed: Story = {
  args: {
    title: 'Price',
    defaultOpen: false,
    children: <p>Hidden until expanded</p>,
  },
};
```

- [ ] **Step 3: Verify Storybook builds**

Run: `pnpm storybook` and visually confirm the story renders.
Expected: clicking the title toggles the body, chevron rotates, `aria-expanded` flips. Stop the server.

- [ ] **Step 4: Run Storybook tests**

Run: `pnpm test:storybook`
Expected: all stories pass.

- [ ] **Step 5: Commit**

```bash
git add src/pages/catalog/ui/catalog-filters/filter-section.tsx src/pages/catalog/ui/catalog-filters/filter-section.stories.tsx
git commit -m "feat(catalog): add FilterSection accordion primitive"
```

---

### Task 19: Create `<GridViewToggle>`

**Files:**
- Create: `src/pages/catalog/ui/catalog-header/grid-view-toggle.tsx`
- Create: `src/pages/catalog/ui/catalog-header/grid-view-toggle.stories.tsx`

- [ ] **Step 1: Create the toggle component**

Create `src/pages/catalog/ui/catalog-header/grid-view-toggle.tsx`:

```tsx
import { LayoutGrid, Grid3X3 } from 'lucide-react';

import { useCatalogSearch, CATALOG_VIEWS, type CatalogView } from '@entities/product';

import { cn } from '@shared/lib/utils';

import { CATALOG_TEXT } from '@pages/catalog/lib';

const VIEW_BUTTONS: Array<{
  value: CatalogView;
  Icon: typeof LayoutGrid;
  label: string;
}> = [
  {
    value: CATALOG_VIEWS.GRID_4,
    Icon: LayoutGrid,
    label: CATALOG_TEXT.view.grid4Label,
  },
  {
    value: CATALOG_VIEWS.GRID_3,
    Icon: Grid3X3,
    label: CATALOG_TEXT.view.grid3Label,
  },
];

export const GridViewToggle = (): React.JSX.Element => {
  const { searchParams, setView } = useCatalogSearch();
  const current = searchParams.view ?? CATALOG_VIEWS.GRID_4;

  return (
    <div
      role="group"
      aria-label={CATALOG_TEXT.view.groupLabel}
      className="flex items-center gap-0.5 rounded-sm bg-muted p-0.5"
    >
      {VIEW_BUTTONS.map(({ value, Icon, label }) => {
        const isActive = current === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setView(value)}
            aria-pressed={isActive}
            aria-label={label}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground transition-colors',
              'focus-visible:outline-2 focus-visible:outline-primary',
              isActive && 'bg-background text-foreground shadow-sm'
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </button>
        );
      })}
    </div>
  );
};
```

- [ ] **Step 2: Create Storybook story with router decorator**

Create `src/pages/catalog/ui/catalog-header/grid-view-toggle.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';

import { GridViewToggle } from './grid-view-toggle';

const meta: Meta<typeof GridViewToggle> = {
  title: 'Catalog/GridViewToggle',
  component: GridViewToggle,
  parameters: {
    docs: {
      description: {
        component:
          'Reads/writes the `view` URL search param via useCatalogSearch. Stories require a router-mock decorator if added in the future.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GridViewToggle>;

export const Default: Story = {};
```

(If the project already has a router decorator pattern in stories, reuse it. Otherwise we accept that the toggle won't be interactive in Storybook isolation; this is a Storybook-tooling task that's out of scope.)

- [ ] **Step 3: Verify Storybook builds**

Run: `pnpm storybook` → confirm story renders. Stop server.

- [ ] **Step 4: Commit**

```bash
git add src/pages/catalog/ui/catalog-header/grid-view-toggle.tsx src/pages/catalog/ui/catalog-header/grid-view-toggle.stories.tsx
git commit -m "feat(catalog): add GridViewToggle component"
```

---

## Phase 7 — Filter components

### Task 20: Implement `<CatalogColorFilter>`

**Files:**
- Modify: `src/pages/catalog/ui/catalog-color-filter/index.tsx` (currently empty)
- Create: `src/pages/catalog/ui/catalog-color-filter/index.stories.tsx`

- [ ] **Step 1: Create a color → hex map module**

Create `src/pages/catalog/lib/catalog-colors.ts`:

```ts
export const COLOR_HEX: Record<string, string> = {
  white: '#fafafa',
  black: '#1a1a1a',
  orange: '#f2760f',
  blue: '#3e17ff',
  green: '#008a40',
  purple: '#b62dd3',
  red: '#dc2626',
  gray: '#9ca3af',
  beige: '#d2bfa9',
  navy: '#1e3a5f',
  brown: '#8b5a2b',
  yellow: '#facc15',
  lightblue: '#7cc7ff',
};

const LIGHT_COLORS = new Set(['white', 'beige', 'yellow', 'lightblue']);
export const isLightColor = (color: string): boolean => LIGHT_COLORS.has(color);
```

Update `src/pages/catalog/lib/index.ts` to re-export them:

```ts
export { CATALOG_TEXT } from './catalog-text';
export { COLOR_HEX, isLightColor } from './catalog-colors';
```

- [ ] **Step 2: Create the component**

Create `src/pages/catalog/ui/catalog-color-filter/index.tsx`:

```tsx
import { Check } from 'lucide-react';
import { useMemo } from 'react';

import { useCatalogSearch } from '@entities/product';

import { cn } from '@shared/lib/utils';

import { CATALOG_TEXT, COLOR_HEX, isLightColor } from '@pages/catalog/lib';

interface CatalogColorFilterProps {
  available: string[];
}

export const CatalogColorFilter = ({
  available,
}: CatalogColorFilterProps): React.JSX.Element | null => {
  const { searchParams, toggleColor } = useCatalogSearch();
  const selected = useMemo(
    () => new Set(searchParams.colors ?? []),
    [searchParams.colors]
  );

  if (available.length === 0) return null;

  return (
    <fieldset>
      <legend className="sr-only">{CATALOG_TEXT.color.legend}</legend>
      <div className="flex flex-wrap gap-2">
        {available.map((color) => {
          const isActive = selected.has(color);
          const hex = COLOR_HEX[color] ?? '#cccccc';
          const light = isLightColor(color);
          return (
            <button
              key={color}
              type="button"
              role="checkbox"
              aria-checked={isActive}
              aria-label={CATALOG_TEXT.color.swatchAriaLabel(color)}
              onClick={() => toggleColor(color)}
              className={cn(
                'relative h-[26px] w-[26px] shrink-0 rounded-full transition-transform',
                'hover:scale-110',
                'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
                light && 'border border-[#ddd]',
                isActive &&
                  'after:absolute after:-inset-[3px] after:rounded-full after:border-2 after:border-primary',
                isActive && light && 'after:border-muted-foreground'
              )}
              style={{ backgroundColor: hex }}
            >
              {isActive && (
                <Check
                  className={cn(
                    'absolute inset-0 m-auto h-2.5 w-2.5',
                    light ? 'text-foreground' : 'text-white'
                  )}
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
};
```

- [ ] **Step 3: Create Storybook story**

Create `src/pages/catalog/ui/catalog-color-filter/index.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';

import { CatalogColorFilter } from './';

const meta: Meta<typeof CatalogColorFilter> = {
  title: 'Catalog/CatalogColorFilter',
  component: CatalogColorFilter,
};

export default meta;
type Story = StoryObj<typeof CatalogColorFilter>;

export const FullPalette: Story = {
  args: {
    available: [
      'white', 'black', 'orange', 'blue', 'green',
      'purple', 'red', 'gray', 'beige', 'navy',
    ],
  },
};

export const TwoColors: Story = {
  args: { available: ['black', 'white'] },
};

export const Empty: Story = {
  args: { available: [] },
};
```

- [ ] **Step 4: Verify Storybook tests pass**

Run: `pnpm test:storybook`
Expected: all stories pass.

- [ ] **Step 5: Commit**

```bash
git add src/pages/catalog/lib/ src/pages/catalog/ui/catalog-color-filter/
git commit -m "feat(catalog): add CatalogColorFilter with color hex map"
```

---

### Task 21: Implement `<CatalogSizeFilter>`

**Files:**
- Modify: `src/pages/catalog/ui/catalog-size-filter/index.tsx`
- Create: `src/pages/catalog/ui/catalog-size-filter/index.stories.tsx`

- [ ] **Step 1: Create the component**

Create `src/pages/catalog/ui/catalog-size-filter/index.tsx`:

```tsx
import { useMemo } from 'react';

import { useCatalogSearch } from '@entities/product';

import { cn } from '@shared/lib/utils';

import { CATALOG_TEXT } from '@pages/catalog/lib';

interface CatalogSizeFilterProps {
  available: string[];
}

export const CatalogSizeFilter = ({
  available,
}: CatalogSizeFilterProps): React.JSX.Element | null => {
  const { searchParams, toggleSize } = useCatalogSearch();
  const selected = useMemo(
    () => new Set(searchParams.sizes ?? []),
    [searchParams.sizes]
  );

  if (available.length === 0) return null;

  return (
    <fieldset>
      <legend className="sr-only">{CATALOG_TEXT.size.legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {available.map((size) => {
          const isActive = selected.has(size);
          return (
            <button
              key={size}
              type="button"
              aria-pressed={isActive}
              aria-label={CATALOG_TEXT.size.chipAriaLabel(size)}
              onClick={() => toggleSize(size)}
              className={cn(
                'flex h-[34px] min-w-[38px] items-center justify-center rounded-sm border-[1.5px] px-2.5 text-xs font-medium transition-colors',
                'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
                isActive
                  ? 'border-primary bg-primary text-white font-bold'
                  : 'border-border bg-background text-foreground hover:border-primary hover:text-primary'
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
};
```

- [ ] **Step 2: Create Storybook story**

Create `src/pages/catalog/ui/catalog-size-filter/index.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';

import { CatalogSizeFilter } from './';

const meta: Meta<typeof CatalogSizeFilter> = {
  title: 'Catalog/CatalogSizeFilter',
  component: CatalogSizeFilter,
};

export default meta;
type Story = StoryObj<typeof CatalogSizeFilter>;

export const ClothesSizes: Story = {
  args: {
    available: ['xs', 's', 'm', 'l', 'xl', 'xxl', 'one-size'],
  },
};

export const Empty: Story = {
  args: { available: [] },
};
```

- [ ] **Step 3: Run Storybook tests**

Run: `pnpm test:storybook`
Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add src/pages/catalog/ui/catalog-size-filter/
git commit -m "feat(catalog): add CatalogSizeFilter chip component"
```

---

### Task 22: Implement `<CatalogPriceFilter>` with Apply button

**Files:**
- Modify: `src/pages/catalog/ui/catalog-price-filter/index.tsx`
- Create: `src/pages/catalog/ui/catalog-price-filter/index.stories.tsx`

The price slider is the trickiest filter. We use Radix `<Slider>` (already in deps) for keyboard + ARIA support, plus two number inputs that mirror the slider, plus an Apply button that commits to URL.

- [ ] **Step 1: Confirm `@radix-ui/react-slider` is installed**

Run: `pnpm list @radix-ui/react-slider`
Expected: shown as installed. If not, run `pnpm add @radix-ui/react-slider` and commit `package.json`/`pnpm-lock.yaml` separately.

- [ ] **Step 2: Create the component**

Create `src/pages/catalog/ui/catalog-price-filter/index.tsx`:

```tsx
import * as Slider from '@radix-ui/react-slider';
import { useEffect, useState } from 'react';

import { useCatalogSearch } from '@entities/product';

import { cn } from '@shared/lib/utils';

import { CATALOG_TEXT } from '@pages/catalog/lib';

interface CatalogPriceFilterProps {
  /** Min price in cents from filter options. */
  bounds: { min: number; max: number };
}

const toEur = (cents: number): number => Math.round(cents / 100);
const toCents = (eur: number): number => Math.round(eur * 100);

export const CatalogPriceFilter = ({
  bounds,
}: CatalogPriceFilterProps): React.JSX.Element | null => {
  const { searchParams, setPriceRange } = useCatalogSearch();

  const initialMin = searchParams.priceMin ?? bounds.min;
  const initialMax = searchParams.priceMax ?? bounds.max;

  const [draft, setDraft] = useState<[number, number]>([
    toEur(initialMin),
    toEur(initialMax),
  ]);

  useEffect(() => {
    setDraft([
      toEur(searchParams.priceMin ?? bounds.min),
      toEur(searchParams.priceMax ?? bounds.max),
    ]);
  }, [searchParams.priceMin, searchParams.priceMax, bounds.min, bounds.max]);

  if (bounds.max <= bounds.min) return null;

  const minEur = toEur(bounds.min);
  const maxEur = toEur(bounds.max);

  const handleApply = (): void => {
    const [draftMin, draftMax] = draft;
    setPriceRange(toCents(draftMin), toCents(draftMax));
  };

  return (
    <div>
      <div className="mb-3 flex justify-between text-xs text-muted-foreground">
        <span>
          {CATALOG_TEXT.price.minLabel} <strong className="text-foreground">€{draft[0]}</strong>
        </span>
        <span>
          {CATALOG_TEXT.price.maxLabel} <strong className="text-foreground">€{draft[1]}</strong>
        </span>
      </div>
      <Slider.Root
        className="relative mx-1.5 flex h-1 touch-none items-center"
        min={minEur}
        max={maxEur}
        step={1}
        value={draft}
        onValueChange={(value) => setDraft([value[0], value[1]] as [number, number])}
        aria-label={CATALOG_TEXT.price.rangeAriaLabel}
        minStepsBetweenThumbs={1}
      >
        <Slider.Track className="relative h-1 grow rounded-sm bg-border">
          <Slider.Range className="absolute h-full rounded-sm bg-primary" />
        </Slider.Track>
        <Slider.Thumb
          className={cn(
            'block h-3.5 w-3.5 rounded-full border-2 border-primary bg-background shadow-sm',
            'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2'
          )}
        />
        <Slider.Thumb
          className={cn(
            'block h-3.5 w-3.5 rounded-full border-2 border-primary bg-background shadow-sm',
            'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2'
          )}
        />
      </Slider.Root>
      <div className="mt-3.5 flex gap-2">
        <input
          type="number"
          min={minEur}
          max={draft[1]}
          value={draft[0]}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (!Number.isNaN(next)) {
              setDraft([Math.min(next, draft[1]), draft[1]]);
            }
          }}
          aria-label={CATALOG_TEXT.price.minLabel}
          className="h-8 w-full rounded-sm border-[1.5px] border-border bg-background px-2 text-sm focus-visible:border-primary focus-visible:outline-none"
        />
        <input
          type="number"
          min={draft[0]}
          max={maxEur}
          value={draft[1]}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (!Number.isNaN(next)) {
              setDraft([draft[0], Math.max(next, draft[0])]);
            }
          }}
          aria-label={CATALOG_TEXT.price.maxLabel}
          className="h-8 w-full rounded-sm border-[1.5px] border-border bg-background px-2 text-sm focus-visible:border-primary focus-visible:outline-none"
        />
      </div>
      <button
        type="button"
        onClick={handleApply}
        className="mt-4 h-10 w-full rounded-sm bg-primary text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
      >
        {CATALOG_TEXT.filters.apply}
      </button>
    </div>
  );
};
```

- [ ] **Step 3: Create Storybook story**

Create `src/pages/catalog/ui/catalog-price-filter/index.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';

import { CatalogPriceFilter } from './';

const meta: Meta<typeof CatalogPriceFilter> = {
  title: 'Catalog/CatalogPriceFilter',
  component: CatalogPriceFilter,
};

export default meta;
type Story = StoryObj<typeof CatalogPriceFilter>;

export const ClothesRange: Story = {
  args: { bounds: { min: 1000, max: 6000 } },
};

export const Wide: Story = {
  args: { bounds: { min: 110, max: 15000 } },
};
```

- [ ] **Step 4: Run Storybook tests**

Run: `pnpm test:storybook`
Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add src/pages/catalog/ui/catalog-price-filter/
git commit -m "feat(catalog): add CatalogPriceFilter (Radix slider + inputs + Apply)"
```

---

### Task 23: Implement `<CatalogActiveFilters>`

**Files:**
- Create: `src/pages/catalog/ui/catalog-active-filters/index.tsx`
- Create: `src/pages/catalog/ui/catalog-active-filters/index.stories.tsx`

- [ ] **Step 1: Create the component**

Create `src/pages/catalog/ui/catalog-active-filters/index.tsx`:

```tsx
import { X } from 'lucide-react';

import { useCatalogSearch } from '@entities/product';

import { CATALOG_TEXT } from '@pages/catalog/lib';

type ActiveTag = {
  type: 'color' | 'size';
  value: string;
};

const buildTags = (
  colors: string[] | undefined,
  sizes: string[] | undefined
): ActiveTag[] => [
  ...(colors ?? []).map((value) => ({ type: 'color' as const, value })),
  ...(sizes ?? []).map((value) => ({ type: 'size' as const, value })),
];

export const CatalogActiveFilters = (): React.JSX.Element | null => {
  const { searchParams, removeFilter } = useCatalogSearch();
  const tags = buildTags(searchParams.colors, searchParams.sizes);

  if (tags.length === 0) return null;

  return (
    <div
      role="region"
      aria-label={CATALOG_TEXT.filters.activeRegionLabel}
      className="mb-3 flex flex-wrap gap-1.5"
    >
      {tags.map((tag) => (
        <button
          key={`${tag.type}:${tag.value}`}
          type="button"
          onClick={() => removeFilter(tag)}
          aria-label={CATALOG_TEXT.filters.removeFilter(tag.value)}
          className="flex h-6 items-center gap-1.5 rounded-full border border-primary-soft-border bg-primary-soft px-2 text-[11px] font-semibold text-primary transition-colors hover:bg-[#ffe6cc] focus-visible:outline-2 focus-visible:outline-primary"
        >
          <span>{tag.value}</span>
          <X className="h-2.5 w-2.5" aria-hidden />
        </button>
      ))}
    </div>
  );
};
```

- [ ] **Step 2: Create Storybook story**

Create `src/pages/catalog/ui/catalog-active-filters/index.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';

import { CatalogActiveFilters } from './';

const meta: Meta<typeof CatalogActiveFilters> = {
  title: 'Catalog/CatalogActiveFilters',
  component: CatalogActiveFilters,
  parameters: {
    docs: {
      description: {
        component:
          'Reads colors/sizes from URL via useCatalogSearch. Stories show the empty case when there is no router context.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CatalogActiveFilters>;

export const NoActiveFilters: Story = {};
```

- [ ] **Step 3: Run Storybook tests**

Run: `pnpm test:storybook`
Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add src/pages/catalog/ui/catalog-active-filters/
git commit -m "feat(catalog): add CatalogActiveFilters chips"
```

---

### Task 24: Implement `<CatalogEmptyState>`

**Files:**
- Create: `src/pages/catalog/ui/catalog-empty-state/index.tsx`
- Create: `src/pages/catalog/ui/catalog-empty-state/index.stories.tsx`

- [ ] **Step 1: Create the component**

Create `src/pages/catalog/ui/catalog-empty-state/index.tsx`:

```tsx
import { SearchX } from 'lucide-react';

import { useCatalogSearch } from '@entities/product';

import { CATALOG_TEXT } from '@pages/catalog/lib';

export const CatalogEmptyState = (): React.JSX.Element => {
  const { resetFilters } = useCatalogSearch();

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-1 flex-col items-center justify-center gap-4 px-10 py-20 text-center"
    >
      <SearchX className="h-16 w-16 text-border" aria-hidden />
      <p className="text-xl font-bold text-foreground">{CATALOG_TEXT.empty.title}</p>
      <p className="max-w-[280px] text-sm leading-relaxed text-muted-foreground">
        {CATALOG_TEXT.empty.description}
      </p>
      <button
        type="button"
        onClick={resetFilters}
        className="mt-2 h-10 rounded-sm bg-primary px-6 text-sm font-bold text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
      >
        {CATALOG_TEXT.empty.cta}
      </button>
    </div>
  );
};
```

- [ ] **Step 2: Create Storybook story**

Create `src/pages/catalog/ui/catalog-empty-state/index.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';

import { CatalogEmptyState } from './';

const meta: Meta<typeof CatalogEmptyState> = {
  title: 'Catalog/CatalogEmptyState',
  component: CatalogEmptyState,
};

export default meta;
type Story = StoryObj<typeof CatalogEmptyState>;

export const Default: Story = {};
```

- [ ] **Step 3: Run Storybook tests**

Run: `pnpm test:storybook`
Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add src/pages/catalog/ui/catalog-empty-state/
git commit -m "feat(catalog): add CatalogEmptyState"
```

---

## Phase 8 — Composition

### Task 25: Implement `<CatalogFilters>` orchestrator

**Files:**
- Create: `src/pages/catalog/ui/catalog-filters/index.tsx`

- [ ] **Step 1: Create the orchestrator**

Create `src/pages/catalog/ui/catalog-filters/index.tsx`:

```tsx
import { useFilterOptions, useCatalogSearch } from '@entities/product';

import { CatalogActiveFilters } from '../catalog-active-filters';
import { CatalogColorFilter } from '../catalog-color-filter';
import { CatalogPriceFilter } from '../catalog-price-filter';
import { CatalogSizeFilter } from '../catalog-size-filter';

import { FilterSection } from './filter-section';

import { CATALOG_TEXT } from '@pages/catalog/lib';

interface CatalogFiltersProps {
  categoryIds: string[];
}

export const CatalogFilters = ({
  categoryIds,
}: CatalogFiltersProps): React.JSX.Element => {
  const { resetFilters } = useCatalogSearch();
  const {
    data: { colors, sizes, priceMin, priceMax, hasSizeFilter },
  } = useFilterOptions(categoryIds);

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-foreground">
          {CATALOG_TEXT.filters.title}
        </span>
        <button
          type="button"
          onClick={resetFilters}
          className="text-xs font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        >
          {CATALOG_TEXT.filters.reset}
        </button>
      </div>

      <CatalogActiveFilters />

      {hasSizeFilter && (
        <FilterSection title={CATALOG_TEXT.size.title}>
          <CatalogSizeFilter available={sizes} />
        </FilterSection>
      )}

      <FilterSection title={CATALOG_TEXT.color.title}>
        <CatalogColorFilter available={colors} />
      </FilterSection>

      <FilterSection title={CATALOG_TEXT.price.title}>
        <CatalogPriceFilter bounds={{ min: priceMin, max: priceMax }} />
      </FilterSection>
    </div>
  );
};
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm tsc -p tsconfig.json --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/catalog/ui/catalog-filters/index.tsx
git commit -m "feat(catalog): add CatalogFilters sidebar orchestrator"
```

---

### Task 26: Wire `<CatalogFilters>` into the sidebar

**Files:**
- Modify: `src/pages/catalog/ui/sidebar/index.tsx`

- [ ] **Step 1: Update the sidebar**

Open `src/pages/catalog/ui/sidebar/index.tsx` and replace its content with:

```tsx
import { CategoriesTree } from '@shared/ui/categories-tree';

import type { CategoryTree } from '@/shared/api';

import { CatalogFilters } from '../catalog-filters';

interface SideBarProps {
  categoryTree: CategoryTree[];
  categoryIds: string[];
}

export const SideBar = ({
  categoryTree,
  categoryIds,
}: SideBarProps): React.JSX.Element => {
  return (
    <aside className="sticky top-5 flex w-[268px] shrink-0 flex-col gap-4">
      <CategoriesTree categoryTree={categoryTree} variant="sidebar" />
      {categoryIds.length > 0 && <CatalogFilters categoryIds={categoryIds} />}
    </aside>
  );
};
```

- [ ] **Step 2: Update consumer (catalog page)**

Open `src/pages/catalog/index.tsx`. Pass `categoryIds`:

```tsx
import { useParams } from '@tanstack/react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useCategoryData } from '@shared/api';
import { Breadcrumbs } from '@shared/ui/breadcrumbs';

import { ErrorFallback } from './error';
import { CatalogContent } from './ui/catalog-content';
import { SideBar } from './ui/sidebar';

export const Catalog = (): React.JSX.Element => {
  const { _splat } = useParams({ strict: false });
  const { breadcrumbs, categoryIds, tree } = useCategoryData(_splat);

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="flex gap-6">
          <Suspense fallback={<p>Loading filters...</p>}>
            <SideBar categoryTree={tree} categoryIds={categoryIds ?? []} />
          </Suspense>
          <Suspense fallback={<p>Loading products...</p>}>
            <CatalogContent categoryIds={categoryIds} />
          </Suspense>
        </div>
      </ErrorBoundary>
    </div>
  );
};
```

(The two Suspense boundaries are split: one for the filter options + tree, one for products. They fail independently and don't blank the whole page.)

- [ ] **Step 3: Manual smoke test**

Run: `pnpm dev`. Navigate to `/category/clothes`.
Expected: sidebar renders with Categories tree + Filter sections (Color + Size + Price). Click a color → URL updates with `?colors=...`. Grid refetches.

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/pages/catalog/index.tsx src/pages/catalog/ui/sidebar/index.tsx
git commit -m "feat(catalog): integrate CatalogFilters into sidebar"
```

---

### Task 27: Update `<CatalogHeader>` with grid-view toggle and total count

**Files:**
- Modify: `src/pages/catalog/ui/catalog-header/index.tsx`

- [ ] **Step 1: Replace catalog header**

Open `src/pages/catalog/ui/catalog-header/index.tsx` and replace its content with:

```tsx
import { useCatalogSearch } from '@entities/product';

import { CATALOG_TEXT } from '@pages/catalog/lib';

import { GridViewToggle } from './grid-view-toggle';

interface CatalogHeaderProps {
  totalCount: number;
}

export const CatalogHeader = ({
  totalCount,
}: CatalogHeaderProps): React.JSX.Element => {
  // Search input + sort dropdown are out of scope for this feature; keep placeholders.
  return (
    <div className="mb-4 flex items-center gap-2">
      <div className="flex-1" />
      <GridViewToggle />
      <span className="whitespace-nowrap text-sm text-muted-foreground">
        {CATALOG_TEXT.header.countLabel(totalCount)}
      </span>
    </div>
  );
};
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm tsc -p tsconfig.json --noEmit`
Expected: error in `<CatalogContent>` because `<CatalogHeader />` is now called without `totalCount`. Task 28 fixes that.

- [ ] **Step 3: Commit**

Hold the commit until Task 28 lands. Skip step 3.

---

### Task 28: Update `<CatalogContent>` for empty state, view, and `aria-busy`

**Files:**
- Modify: `src/pages/catalog/ui/catalog-content/index.tsx`
- Modify: `src/entities/product/ui/product-list.tsx`

- [ ] **Step 1: Make `<ProductList>` accept a view prop**

Replace the entire content of `src/entities/product/ui/product-list.tsx` with:

```tsx
import { cn } from '@shared/lib/utils';

import { ProductCard } from './product-card';

import type { CatalogProduct } from '../api/types';
import { CATALOG_VIEWS, type CatalogView } from '../lib';

interface ProductListProps {
  products: CatalogProduct[];
  view?: CatalogView;
}

export const ProductList = ({
  products,
  view = CATALOG_VIEWS.GRID_4,
}: ProductListProps): React.JSX.Element => {
  return (
    <div
      className={cn(
        'grid gap-8',
        view === CATALOG_VIEWS.GRID_3
          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
          : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  );
};
```

The default stays at `grid-4` so existing call sites (any home/landing carousel that imports `ProductList`) keep their current 4-column layout.

- [ ] **Step 2: Replace `<CatalogContent>`**

Open `src/pages/catalog/ui/catalog-content/index.tsx` and replace its content with:

```tsx
import { ProductList, useCatalogSearch, useProducts } from '@entities/product';

import { cn } from '@shared/lib/utils';

import { CatalogEmptyState } from '../catalog-empty-state';
import { CatalogHeader } from '../catalog-header';
import { CatalogPagination } from '../catalog-pagination';

interface CatalogContentProps {
  categoryIds: string[] | null;
}

export const CatalogContent = ({
  categoryIds,
}: CatalogContentProps): React.JSX.Element | null => {
  const { searchParams } = useCatalogSearch();

  const query = useProducts({
    categoryIds: categoryIds ?? [],
    ...searchParams,
  });

  if (!categoryIds || categoryIds.length === 0) {
    return null;
  }

  if (!query.data) {
    return null;
  }

  const { data: products, meta } = query.data;
  const isFetching = query.isFetching;
  const isEmpty = meta.totalCount === 0;

  return (
    <div className="flex flex-1 flex-col" aria-busy={isFetching}>
      <CatalogHeader totalCount={meta.totalCount} />

      {isEmpty ? (
        <CatalogEmptyState />
      ) : (
        <>
          <div
            className={cn(
              'transition-opacity',
              isFetching && 'opacity-60 pointer-events-none'
            )}
          >
            <ProductList products={products} view={searchParams.view} />
          </div>
          <CatalogPagination meta={meta} />
        </>
      )}
    </div>
  );
};
```

- [ ] **Step 3: Verify typecheck**

Run: `pnpm tsc -p tsconfig.json --noEmit`
Expected: no errors.

- [ ] **Step 4: Manual smoke test**

Run: `pnpm dev`. Open `/category/clothes`. Try:
1. Click a color → grid updates, brief opacity dim during refetch.
2. Apply a price range that yields zero results → empty state appears.
3. Click "Reset all filters" in empty state → filters clear, grid returns.
4. Toggle grid-view 4 ↔ 3 → URL updates, grid columns change.
5. Click a different category in the tree → filters reset, grid reloads, view preserved.

Expected: all flows work without console errors.

Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add src/pages/catalog/ui/catalog-content/index.tsx src/pages/catalog/ui/catalog-header/index.tsx src/entities/product/ui/product-list.tsx
git commit -m "feat(catalog): wire empty state, grid view, and aria-busy into content"
```

---

## Phase 9 — Polish, docs, QA

### Task 29: Update `<CategoriesTree>` to display tree as a "Categories" filter section

This is optional polish. The spec keeps the tree as a separate block above filters. If the design needs it visually paired with filters in the same accordion-styled column, we can wrap it in a `<FilterSection>` without making it collapsible. Skip if the current visual matches expectations.

- [ ] **Step 1: Decide based on visual review**

After Task 26, view the catalog and decide if the tree needs to be wrapped in a `<FilterSection title={CATALOG_TEXT.categories.title}>`.

- [ ] **Step 2 (if needed): Wrap in `<FilterSection>` in the sidebar**

```tsx
<FilterSection title={CATALOG_TEXT.categories.title} defaultOpen>
  <CategoriesTree categoryTree={categoryTree} variant="sidebar" />
</FilterSection>
```

- [ ] **Step 3 (if step 2 applied): Commit**

```bash
git add src/pages/catalog/ui/sidebar/index.tsx
git commit -m "style(catalog): wrap categories tree in FilterSection"
```

---

### Task 30: Add `docs/FILTERS.md`

**Files:**
- Create: `docs/FILTERS.md`

- [ ] **Step 1: Create the doc**

Create `docs/FILTERS.md`:

```markdown
# Product Filters

Context-aware filtering of the product catalog by **price**, **color**, and **size**.

## URL contract

| Param        | Type            | Example                  | Notes |
|--------------|-----------------|--------------------------|-------|
| `colors`     | string[]        | `?colors=black&colors=red` | Multi-select; instant apply on click |
| `sizes`      | string[]        | `?sizes=m&sizes=l`        | Visible only for categories with size attributes |
| `priceMin`   | int (cents)     | `?priceMin=1000`          | Committed via Apply button |
| `priceMax`   | int (cents)     | `?priceMax=5000`          | Committed via Apply button |
| `view`       | grid-4 / grid-3 | `?view=grid-3`            | Persists across category changes |

Filters are reset when the category changes (the `<Link>` in `CategoriesTree` navigates with `search: { view: prev.view }`).

## Architecture

- `products_search` view (PostgreSQL) exposes `colors text[]`, `sizes text[]`, `category_ids uuid[]`.
- RPC `get_catalog_filter_options(p_category_ids uuid[])` returns available colors/sizes/price-range/`hasSizeFilter` for the current category.
- React Query `productQueries` factory provides `catalog` (5 min stale) and `filterOptions` (1 hour stale).
- Router loader prefetches the categories tree; filter options are fetched in the page via `useFilterOptions`.

## Adding a new filter

1. Add the column to `products_search` (array aggregate from `product_variant_attributes`).
2. Add the field to `get_catalog_filter_options` return shape.
3. Extend `FilterOptions` interface and `getFilterOptions` mapper.
4. Extend `catalogSearchSchema` and `useCatalogSearch` setters.
5. Add a UI component in `pages/catalog/ui/catalog-<name>-filter/`.
6. Wire it into `<CatalogFilters>`.

## Out of scope (separate tasks)

- Search autosuggest dropdown.
- Stock toggle (data quality issue: most rows have `stock = 0`).
- Faceted counts.
- Brand filter.
- Mobile drawer pattern.
```

- [ ] **Step 2: Commit**

```bash
git add docs/FILTERS.md
git commit -m "docs: add FILTERS.md describing the filter feature"
```

---

### Task 31: Update `docs/SEARCH.md`

**Files:**
- Modify: `docs/SEARCH.md`

- [ ] **Step 1: Add a banner pointing to FILTERS.md**

Open `docs/SEARCH.md` and add at the top, right after the title:

```markdown
> **Filter behaviour** (color/size/price/view) is documented separately in [`docs/FILTERS.md`](./FILTERS.md). This document covers search, sort, pagination, and the underlying view architecture.
```

- [ ] **Step 2: Update the "Future: Variant attribute filters" section**

Find the "Future: Variant attribute filters" section. Replace it with:

```markdown
### Variant attribute filters

Implemented in 2026-05. See [`docs/FILTERS.md`](./FILTERS.md) for the user-facing contract and `supabase/migrations/20260501_extend_products_search_for_filters.sql` for the database changes.
```

- [ ] **Step 3: Commit**

```bash
git add docs/SEARCH.md
git commit -m "docs: cross-link SEARCH.md to FILTERS.md"
```

---

### Task 32: Update `.claude/CONTEXT.md`

**Files:**
- Modify: `.claude/CONTEXT.md`

- [ ] **Step 1: Add an entry per the GG protocol**

Open `.claude/CONTEXT.md` and append:

```markdown
### 2026-05-01 — Product Filters (price + color + size)

- **Changes**:
  - DB: extended `products_search` view with `category_ids[]`, `colors[]`, `sizes[]`; added RPC `get_catalog_filter_options`; new indexes on `product_variant_attributes` and `attribute_definitions`.
  - Entity (`entities/product`): new `getFilterOptions` API; `productQueries` factory; `useProducts` switched to `useQuery` + `placeholderData`; `useFilterOptions` (suspense) added.
  - URL state: `catalogSearchSchema` extended with `colors`/`sizes`/`view`; `useCatalogSearch` got `toggleColor`/`toggleSize`/`setView`/`removeFilter`/`resetFilters`.
  - Router: `context: { queryClient }`; category route loader preloads the categories tree.
  - UI: 7 new components in `pages/catalog/ui/`; design tokens `--primary-soft` / `--primary-soft-border`; strings module `pages/catalog/lib/catalog-text.ts`.

- **Decisions**:
  - Kept the portable VIEW + RPC approach (rejecting alternatives: client-only subqueries, materialised views, merge into a single RPC).
  - Filter options cached for 1 hour; products cached for 5 minutes with `placeholderData` for smooth filter transitions.
  - Pre-i18n strings module (`CATALOG_TEXT`) — postpones the i18n library decision until SSR migration.
  - Categories tree links use `search: { view: prev.view }` to reset filters on category change while keeping the user's grid-view preference.

- **Tech Debt/Next**:
  - Search autosuggest dropdown (separate ticket).
  - Stock filter (blocked by seed data: `stock = 0` for most rows).
  - Faceted counts.
  - Inline English strings in `shared/ui` (Pagination, etc.) → migrate into a shared text module before the eventual `react-i18next` adoption.
  - Storybook a11y addon, skip-link, color-contrast audit (P1 backlog from spec Section 9.5).
  - SSR migration via TanStack Start (separate sprint, after cart/checkout MVP).
```

- [ ] **Step 2: Commit**

```bash
git add .claude/CONTEXT.md
git commit -m "docs(context): log product filters feature in project memory"
```

---

### Task 33: Final acceptance-criteria sweep

This is a manual checklist run, not code.

- [ ] **Step 1: Run all unit tests**

Run: `pnpm vitest run --config vitest.unit.config.ts`
Expected: all pass.

- [ ] **Step 2: Run Storybook tests**

Run: `pnpm test:storybook`
Expected: all stories pass.

- [ ] **Step 3: Run lint and typecheck**

Run: `pnpm lint && pnpm tsc -p tsconfig.json --noEmit`
Expected: no errors, no new warnings.

- [ ] **Step 4: Run the full build**

Run: `pnpm build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Manual a11y check (matches spec Section 9.5 acceptance)**

Run: `pnpm dev`. Open `/category/clothes`.
- Tab through the sidebar. Every filter control is reachable; focus ring visible.
- Use keyboard (Space/Enter) to toggle a color circle and a size chip. URL updates.
- Open VoiceOver / NVDA / Narrator. Focus a color circle. Expect "Color: black, checkbox, not checked" (or similar).
- Apply filters that produce zero results. Empty state region announces "No products found".
- Inspect DevTools → Accessibility tab → no critical issues on the catalog page.

Stop dev server.

- [ ] **Step 6: Manual feature-correctness check (matches spec Section 12)**

Run `pnpm dev` and verify each acceptance criterion in spec Section 12 by hand. Mark each item resolved.

- [ ] **Step 7: Commit any small fixes discovered during the sweep**

If steps 5–6 reveal small fixes, commit them per the conventional commits format. If everything passes, no commit needed.

---

## Final notes

- **Do not push to GitHub** unless the user explicitly requests it. All commits stay local on the `yes-100` branch.
- After all tasks land, the user can decide whether to open a PR or continue iterating.
- If any task uncovers a deviation from the spec (e.g., Supabase API behaviour differs from assumption), pause and update the spec first per the brainstorming skill — do not silently change the design.
