# Product Filters — Design Spec

**Branch:** `yes-100`
**Author:** Olha + Claude (brainstorming session)
**Date:** 2026-05-01
**Status:** Draft → pending implementation
**Reference design:** `.claude/designs/yes-code/project/catalog-v1-final.html`
**Reference task (legacy):** RSS-ECOMM-3_03 (commercetools), adapted for Supabase backend
**SSR-readiness rules:** [`.claude/AI_SSR_READINESS.md`](../../.claude/AI_SSR_READINESS.md)

---

## 1. Goal

Implement robust product filtering for the catalog page that:

- Lets users refine the product list by **price**, **color**, and **size**.
- Adapts the visible filters to the current category context (Size only for Clothes).
- Updates URL state in real time (shareable links, back/forward navigation).
- Stays SSR-ready for the planned migration to TanStack Start.
- Does not regress existing search, sort, and pagination.

---

## 2. Scope

### In scope

- DB: extend `products_search` view; new RPC `get_catalog_filter_options`; supporting indexes.
- Entity layer: extend `getCatalogProducts`, add `getFilterOptions`, add `queryOptions` factories, refactor `useProducts` to non-suspense `useQuery`, keep `useFilterOptions` suspense.
- URL state: extend `catalogSearchSchema` (`colors[]`, `sizes[]`, `view`), extend `useCatalogSearch` setters.
- Router: add `loader` + `loaderDeps` on category route; add `context: { queryClient }`.
- UI: 7 catalog components (filters orchestrator, active-tags, color filter, size filter, price filter with Apply, grid-view toggle, empty state). Refactor existing `catalog-content`, `catalog-header`, `sidebar`.
- Design tokens: add 2 missing CSS variables (`--primary-soft`, `--primary-soft-border`) in `index.css`.
- Tests: unit tests for new schema/setters and price-range logic; Storybook stories for filter components.
- Docs: update `docs/SEARCH.md` to reflect filter behavior; add `docs/FILTERS.md`.

### Out of scope (separate tasks)

- Search autosuggest dropdown.
- Stock toggle (`is_in_stock` filter) — current seed has `stock = 0` for most rows, would always be empty.
- Faceted counts (e.g., "Black (12)").
- Mobile drawer pattern (responsive ≤ 768px) — desktop sidebar only.
- Brand filter — no `brand` attribute in seed yet.
- View-toggle persistence in localStorage.
- Migration to TanStack Start (SSR) — separate sprint after cart/checkout.

### Constraints

- **Package manager:** pnpm only.
- **Architecture:** FSD (Feature-Sliced Design) layer rules apply — see `.claude/AI_FSD.md`.
- **No new global state libs** — Zustand reserved for cart/auth, filters live in URL.
- **No API changes that break existing search/sort/pagination tests.**

---

## 3. Background & Audit Findings

The catalog already has search, sort, price filter, and pagination working through a `products_search` PostgreSQL view (see `.claude/CATALOG_SEARCH_VIEW.md`). The filter feature builds on top of this foundation. Audit found these issues that this spec also addresses:

1. **Duplicate rows from `LEFT JOIN product_categories`** — products in multiple categories appear N times in the view, breaking `count: 'exact'` for pagination.
2. **No attribute filtering capability** — view does not expose colors/sizes from `product_variant_attributes`.
3. **Master variant has color but no size** — size filtering must consider all variants, not just master.
4. **Filter UI folders are empty stubs** — `catalog-color-filter/`, `catalog-size-filter/`, `catalog-price-filter/`, `catalog-layout/`.
5. **`useSuspenseQuery` for products** — every filter change suspends the entire catalog content; bad UX during interaction.
6. **Multiple attribute names per concept** — `color-clothes`, `color-office`, `accessories-color`, `drinkware-color`. Need to unify under one logical "color" filter.

---

## 4. Architecture

### 4.1. Data flow

```
URL (?colors=black,red&sizes=m,l&priceMin=1000&priceMax=3000&view=grid-3)
  ↓ Zod (catalogSearchSchema)
TanStack Router → loader: ensureQueryData(categoryData, filterOptions)
  ↓
Catalog page
  ├── Sidebar (categoryTree + CatalogFilters)
  │     ↳ CatalogFilters reads filterOptions from React Query cache (sync)
  └── CatalogContent
        ├── CatalogHeader (search + sort + grid-view + count)
        ├── ProductList (driven by useProducts → useQuery, placeholderData)
        ├── CatalogPagination
        └── CatalogEmptyState (when totalCount === 0)
```

### 4.2. Why this architecture

- **`products_search` view extended** — keeps the portable-SQL strategy (see `.claude/CATALOG_SEARCH_VIEW.md`). Filter operations stay as PostgREST `overlaps` calls, no new RPC for the main product query.
- **One RPC for filter options** — single round-trip to fetch available colors/sizes/price-range/`hasSizeFilter` for the current category context. Cached for 1 hour in React Query.
- **Router loader for category-scoped data** — `categoryData` and `filterOptions` are tied to the category, not to filter values. Loader runs only when `slug` changes, not on each filter click. SSR-friendly via `queryClient.ensureQueryData`.
- **Filter changes use `useQuery` + `placeholderData`** — products refetch in background while keeping the previous grid visible. Sidebar (filterOptions) does not re-render.
- **URL-driven state** — every filter is in the URL via Zod schema; back/forward, refresh, and shareable links work for free. SSR-friendly.

---

## 5. Database Changes

New migration: `supabase/migrations/20260501_extend_products_search_for_filters.sql`

### 5.1. Replace `products_search` view

**Changes vs. current view:**

- ❌ Remove `LEFT JOIN product_categories` (was producing duplicates).
- ✅ Add `category_ids uuid[]` aggregate (subquery).
- ✅ Add `colors text[]` aggregate from `product_variant_attributes` (any attribute whose name matches `%color%`).
- ✅ Add `sizes text[]` aggregate from `product_variant_attributes` where `attribute_definitions.name = 'size-clothes'`.
- ✅ Drop the `category_id` column (replaced by `category_ids`).

**Example DDL:** see `.claude/designs/yes-code/project/` and Section 2.1 of brainstorming notes. Concrete SQL is finalized during implementation; review checklist:

- `WITH (security_invoker = true)` preserved.
- `GRANT SELECT ON products_search TO authenticated, anon` preserved.
- `INNER JOIN product_variants pv ON pv.product_id = p.id AND pv.is_master = true` preserved.
- `WHERE p.is_published = true` preserved.
- `product_discounts` JSONB aggregation preserved (no behavioral change).

### 5.2. New RPC `get_catalog_filter_options(p_category_ids uuid[])`

Returns a single row with:

| Column            | Type      | Description                                                        |
| ----------------- | --------- | ------------------------------------------------------------------ |
| `colors`          | `text[]`  | Distinct color values across all products in the given categories. |
| `sizes`           | `text[]`  | Distinct size values (only `size-clothes`).                        |
| `price_min`       | `int`     | Min `price` (cents) in the category.                               |
| `price_max`       | `int`     | Max `price` (cents) in the category.                               |
| `has_size_filter` | `boolean` | True if at least one product in the category has any size value.   |

**Properties:**

- `LANGUAGE sql STABLE SECURITY INVOKER`
- `SET search_path = public`
- Sources data from the extended `products_search` view (single source of truth).

### 5.3. Indexes

```sql
CREATE INDEX IF NOT EXISTS idx_pva_attr_value
  ON product_variant_attributes (attribute_definition_id, ((value #>> '{}')));
CREATE INDEX IF NOT EXISTS idx_attr_def_name
  ON attribute_definitions (name);
```

### 5.4. Type generation

After migration: `pnpm types:db:local` to regenerate `src/shared/api/database.types.ts`. The new view columns and RPC return type appear automatically.

---

## 6. API / Entity Layer

### 6.1. File map (`src/entities/product/`)

```
api/
├── index.ts              [edit]   getCatalogProducts: + colors, + sizes, overlaps('category_ids')
├── filter-options.ts     [new]    getFilterOptions(categoryIds)
├── queries.ts            [new]    queryOptions factories (productQueries.catalog, productQueries.filterOptions)
├── hooks.ts              [edit]   useProducts → useQuery + placeholderData; + useFilterOptions (useSuspenseQuery)
├── mapper.ts             [edit]   ignore new view columns it doesn't consume
└── types.ts              [edit]   + colors?/sizes? in CatalogParams; + FilterOptions
lib/
├── catalog-search-schema.ts  [edit]  + colors[], + sizes[], + view enum
└── constants.ts              [edit]  + DEFAULT_VIEW
model/
└── use-catalog-search.ts     [edit]  + setColors, + setSizes, + toggleColor, + toggleSize, + setView, + removeFilter, + resetFilters
index.ts                  [edit]   re-exports
```

### 6.2. `getCatalogProducts` API contract

```ts
interface CatalogParams {
  categoryIds: string[];
  search?: string;
  priceMin?: number;
  priceMax?: number;
  colors?: string[]; // NEW
  sizes?: string[]; // NEW
  page?: number;
  pageSize?: number;
  sortField?: ProductSortField;
  sortDirection?: SortDirection;
}
```

**Filter chain:**

- `.overlaps('category_ids', categoryIds)` — replaces `.in('category_id', ...)`.
- `if (colors?.length) .overlaps('colors', colors)`.
- `if (sizes?.length) .overlaps('sizes', sizes)`.
- All other filters (search, priceMin/Max, sort, range) unchanged.

### 6.3. `getFilterOptions` API contract

```ts
interface FilterOptions {
  colors: string[];
  sizes: string[];
  priceMin: number;
  priceMax: number;
  hasSizeFilter: boolean;
}

const getFilterOptions = (categoryIds: string[]) => Promise<FilterOptions>;
```

Internally calls `supabase.rpc('get_catalog_filter_options', { p_category_ids: categoryIds }).single()`.

### 6.4. Query factories (SSR-ready)

```ts
// entities/product/api/queries.ts
export const productQueries = {
  catalog: (params: CatalogParams) =>
    queryOptions({
      queryKey: ['products', 'catalog', params],
      queryFn: () => getCatalogProducts(params),
      staleTime: 1000 * 60 * 5,
      placeholderData: (prev) => prev,
    }),
  filterOptions: (categoryIds: string[]) =>
    queryOptions({
      queryKey: ['products', 'filter-options', categoryIds],
      queryFn: () => getFilterOptions(categoryIds),
      staleTime: 1000 * 60 * 60,
    }),
};
```

### 6.5. Hooks

```ts
// useProducts: smooth transitions, no Suspense flash on filter changes
export const useProducts = (params: CatalogParams) =>
  useQuery({
    ...productQueries.catalog(params),
    select: (response) => selectPaginatedProducts(response, page, pageSize),
  });

// useFilterOptions: Suspense only on first load; cached afterwards
export const useFilterOptions = (categoryIds: string[]) =>
  useSuspenseQuery(productQueries.filterOptions(categoryIds));
```

---

## 7. URL State (Zod Schema)

```ts
export const catalogSearchSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(12),
  search: z.string().optional(),
  priceMin: z.number().int().nonnegative().optional(),
  priceMax: z.number().int().nonnegative().optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  view: z.enum(['grid-4', 'grid-3']).default('grid-4'),
  sortField: z.enum(['name', 'price', 'created_at']).default('created_at'),
  sortDirection: z.enum(['asc', 'desc']).default('desc'),
});
```

`stripSearchParams` middleware in `routes.ts` extends defaults to include `view: 'grid-4'`.

### 7.1. New setters in `useCatalogSearch`

| Setter                          | Behavior                                                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------- |
| `toggleColor(color)`            | Adds/removes from `colors[]`; resets `page` to 1                                                                               |
| `toggleSize(size)`              | Adds/removes from `sizes[]`; resets `page` to 1                                                                                |
| `setColors(colors[])`           | Replace; resets `page` to 1                                                                                                    |
| `setSizes(sizes[])`             | Replace; resets `page` to 1                                                                                                    |
| `setView(view)`                 | Update view; preserves `page`                                                                                                  |
| `removeFilter({ type, value })` | For active-tag X; type ∈ `'color'                                                                                              | 'size'`; resets `page` to 1 |
| `resetFilters()`                | Clears `colors`, `sizes`, `priceMin`, `priceMax`, `search`; preserves `view`, `sortField`, `sortDirection`; resets `page` to 1 |

### 7.2. Reset on category change

Clicking a category in `<CategoriesTree>` navigates with `search: { view: prev.view }` — preserves only `view`, resets everything else. Implemented in the tree's `<Link>` definition.

---

## 8. Router Loaders

In `app/routing/index.tsx`: pass `context: { queryClient }` when creating the router.

In `app/routing/routes.ts`, the category route gets:

```ts
loaderDeps: ({ params }) => ({ slug: params._splat }),
loader: async ({ context, deps }) => {
  const categoryData = await context.queryClient.ensureQueryData(
    categoryDataQueryOptions(deps.slug)
  );
  await context.queryClient.ensureQueryData(
    productQueries.filterOptions(categoryData.categoryIds)
  );
  return categoryData;
},
```

Notes:

- `categoryDataQueryOptions` factory is added to `@shared/api` (mirrors existing `useCategoryData` shape).
- Loader does NOT prefetch products — that's component-level for fast filter response.
- `<Link preload="intent">` is added to category tree links to prefetch on hover.

---

## 9. UI Components

### 9.1. File map (`src/pages/catalog/ui/`)

```
catalog-layout/                  [new]   shell wrapping sidebar + content (extracts container layout from index.tsx)
catalog-filters/                 [new]   sidebar orchestrator: header + active-tags + sections
  ├── index.tsx
  └── filter-section.tsx                 reusable accordion (FS) primitive
catalog-active-filters/          [new]   chips (color/size only) at sidebar top with X
catalog-color-filter/            [edit]  multi-select circles, instant
catalog-size-filter/             [edit]  multi-select chips, instant; renders only when filterOptions.hasSizeFilter
catalog-price-filter/            [edit]  dual slider + 2 inputs + Apply button (Apply scoped to price only)
catalog-content/                 [edit]  passes view to ProductList; renders empty-state when count===0
catalog-header/                  [edit]  search + sort + grid-view toggle + count
  ├── index.tsx
  └── grid-view-toggle.tsx               [new]
catalog-pagination/              [no change]
catalog-empty-state/             [new]   "Товары не найдены" + Reset filters button
sidebar/                         [edit]  uses <CatalogFilters>; categories tree stays as separate block ABOVE filters
```

### 9.2. Behavior decisions (final)

- **Filter sections:** accordion (collapsible), default open. Chevron rotates 90° when open.
- **Active tags strip:** in sidebar (top, above sections). Shows ONLY color and size chips. Category and price are not duplicated here (they're visible in the tree and slider).
- **Categories:** stay as a SEPARATE tree block (not as an accordion section). Located in sidebar above filters.
- **Stock toggle:** NOT implemented in MVP.
- **Apply button:** scoped to `<CatalogPriceFilter>` only — pressing it commits `priceMin/priceMax` to URL. Color and size apply instantly. There is NO global "Apply all filters" button.
- **Reset all:** button in `<CatalogFilters>` header → `resetFilters()`.
- **Grid-view toggle:** new control in `<CatalogHeader>`, switches between `grid-cols-4` (default) and `grid-cols-3`.
- **Empty state:** when `meta.totalCount === 0`, render `<CatalogEmptyState>` instead of grid + pagination.

### 9.3. Design tokens

Existing tokens cover everything except 2 soft-primary variants. Add to `src/app/styles/index.css`:

```css
:root {
  --primary-soft: #fff3e8;
  --primary-soft-border: #ffd0a0;
}
```

And in `@theme inline`:

```css
--color-primary-soft: var(--primary-soft);
--color-primary-soft-border: var(--primary-soft-border);
```

Result: `bg-primary-soft` and `border-primary-soft-border` available as Tailwind utilities. Used for active-tag chip background and active category-tree-item background.

**Dark mode:** out of scope — the project does not currently ship dark variants for primary tones. When dark theme is implemented in a future sprint, soft-primary dark variants are added in the same `.dark { ... }` block.

No font changes (Mukta already loaded via `src/app/styles/index.css`).

### 9.4. Storybook

Each new filter component gets a story file with: empty state, with values selected, hover, disabled (where applicable). For components depending on `useCatalogSearch`, use a router decorator (mock TanStack Router context).

### 9.5. Accessibility requirements

The project already has `eslint-plugin-jsx-a11y` (recommended) and uses Radix Primitives via shadcn/ui, which gives a solid baseline. The new filter components must meet WCAG 2.1 AA. Below is the per-component contract.

**Global rules for the filter UI**

- All interactive elements are native `<button>` or `<a>` — no `<div onClick>`.
- Focus-visible state is non-default; ensure `focus-visible:outline-2 focus-visible:outline-primary` (or equivalent token-based ring) on every interactive element.
- Touch targets ≥ 24×24 CSS px (color circles in the design are 26×26 — already compliant).
- Color is never the only differentiator (especially in `<CatalogColorFilter>`).
- Live regions for async content updates (grid, count) so screen readers announce changes.

**Per-component contract**

| Component | Required ARIA / semantics |
|---|---|
| `<FilterSection>` (accordion) | `<button aria-expanded={open} aria-controls={bodyId}>` as trigger. Body has `id={bodyId}`. Title is the button content (no extra aria-label needed). |
| `<CatalogColorFilter>` | Each circle is `<button role="checkbox" aria-checked={isActive} aria-label={`Цвет: ${colorName}`}>`. Plain visible label below circle OR tooltip with text — color alone is not sufficient. Group wrapped in `<fieldset><legend className="sr-only">Цвет</legend>...</fieldset>` (or use the section title as `aria-labelledby`). |
| `<CatalogSizeFilter>` | Each chip is `<button aria-pressed={isActive} aria-label={`Размер: ${size}`}>` (text label is already visible — `aria-label` mirrors it for clarity). Group `aria-labelledby` to the section heading. |
| `<CatalogPriceFilter>` | Use Radix `Slider` (already in deps) — it provides `aria-valuemin/max/now/text` automatically. Inputs labelled via `<label htmlFor>` (visible or sr-only). Apply button has descriptive text "Применить цену". |
| `<CatalogActiveFilters>` | Wrapper has `role="region" aria-label="Активные фильтры"`. Each X button: `aria-label={`Убрать фильтр: ${value}`}`. |
| `<CatalogEmptyState>` | Wrapper has `role="status" aria-live="polite"` so screen readers announce when results disappear. Reset button has descriptive text. |
| `<CatalogContent>` grid | `aria-busy={isFetching}` on the grid wrapper while a refetch runs (works with our `opacity-60` fade). |
| `<GridViewToggle>` | Two buttons with `aria-pressed={isActive}` and `aria-label={`Сетка ${count} в ряд`}`. Group `role="group" aria-label="Вид сетки"`. |
| `<CategoriesTree>` (existing) | Already correct (`<nav aria-label>`, `<ul>/<li>`, `aria-current="page"` on active link). No change. |
| Reset all button | Plain text "Сбросить все фильтры", no aria-label override. Disabled state when nothing to reset (`aria-disabled` not just `disabled` if you want it focusable for hint). |

**Out of scope for this spec (separate a11y backlog)**

- Storybook `@storybook/addon-a11y` integration.
- Global skip-to-content link in `Layout`.
- Color-contrast audit (Lighthouse / axe DevTools sweep).
- CI integration of `axe-playwright` (waits for e2e infrastructure).

**Acceptance check (added to Section 12)**

- All filter controls reachable via Tab; active state announced (`aria-pressed` / `aria-checked`).
- VoiceOver / NVDA reads color filter as "Цвет: чёрный, флажок, не отмечено" (or local equivalent), not just "button".
- Empty-state announcement fires when count goes to 0.
- No new `eslint-plugin-jsx-a11y` warnings introduced.

---

## 10. Loading, Empty, and Error States

| State               | Condition               | Behavior                                                                                                                          |
| ------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Initial hard-load   | Cold cache              | Loader prefetches categoryData + filterOptions; Suspense fallback shows skeleton sidebar + skeleton grid (8 cards)                |
| Category change     | Slug differs            | Loader runs again (loaderDeps); previous category's data stays in cache for back-navigation                                       |
| Filter change       | Same category           | `useProducts` refetches; grid stays visible with `opacity-60` while `isFetching === true`; no skeleton overlay. Sidebar unchanged |
| Empty result        | `meta.totalCount === 0` | Render `<CatalogEmptyState>` with message + "Reset all filters" button                                                            |
| Network error       | Query rejects           | Existing ErrorBoundary catches; user-facing message; Reset button in fallback                                                     |
| filterOptions error | RPC fails               | Sidebar renders categories + degraded notice "Filters temporarily unavailable"; products still load                               |

---

## 11. SSR Readiness

This feature is built to be SSR-ready (per `.claude/AI_SSR_READINESS.md`). Specifically:

- All queries go through `queryOptions` factories — usable in both router loader and component hooks.
- Router loader uses `ensureQueryData` — works with future `dehydrate`/`hydrate` cycle.
- All UI state (filters, view, sort, pagination, search) lives in URL — no Zustand or browser-only storage involved.
- No module-scope `window`/`document` access introduced.
- No `useEffect` URL synchronization — routing primitives only.

---

## 12. Acceptance Criteria

- [ ] Migration applied; `pnpm types:db:local` regenerates types successfully.
- [ ] Visiting `/category/clothes` shows Color, Size, Price filters in sidebar.
- [ ] Visiting `/category/bags` shows Color, Price (no Size).
- [ ] Visiting `/category/drinkware` or `/category/office` shows Color, Price (no Size).
- [ ] Clicking a color circle: URL updates with `?colors=black`, grid refetches without sidebar flash.
- [ ] Clicking a size chip: same — instant.
- [ ] Adjusting price slider does NOT trigger network calls; pressing "Apply" inside price filter commits `priceMin/priceMax` to URL and refetches.
- [ ] Active color/size chips appear in sidebar top with X; clicking X removes only that filter.
- [ ] "Reset all" button resets colors, sizes, price, search; preserves view + sort.
- [ ] Switching grid-view (4/3) updates URL `view=grid-3` and visually changes column count.
- [ ] Pagination count is correct (no duplicates from category JOIN).
- [ ] Refresh preserves all URL state.
- [ ] Empty state appears when no products match; "Reset all" button clears filters and grid reappears.
- [ ] Hover-prefetch on category tree links triggers a fetch visible in DevTools network tab.
- [ ] No console errors during normal interaction (filter clicks, pagination, navigation).
- [ ] Filter controls reachable via keyboard (Tab/Enter/Space); active state announced by screen reader (`aria-pressed` for chips, `aria-checked` for color circles). Full a11y contract per Section 9.5.
- [ ] Storybook stories for new filter components render and `pnpm test:storybook` passes.
- [ ] Existing tests pass; new unit tests for `catalogSearchSchema` (colors, sizes, view) and `useCatalogSearch` setters (`toggleColor`, `toggleSize`, `removeFilter`, `resetFilters`) added.

---

## 13. Implementation Sequencing (high-level)

1. **DB migration** — view + RPC + indexes; `types:db:local`.
2. **Entity layer** — `queries.ts`, extend `getCatalogProducts`, add `getFilterOptions`, refactor hooks.
3. **URL state** — extend Zod schema, extend `useCatalogSearch`, update `stripSearchParams` defaults.
4. **Router** — `context: { queryClient }`, `categoryDataQueryOptions`, `loader` on category route, `<Link preload="intent">` on tree.
5. **Design tokens** — add 2 CSS variables.
6. **UI primitives** — `<FilterSection>`, `<GridViewToggle>`.
7. **Filter components** — color, size, price (with Apply), active-tags, empty-state.
8. **Compose** — `<CatalogFilters>` orchestrator; integrate into sidebar; refactor `<CatalogHeader>` and `<CatalogContent>`.
9. **Storybook** — stories for each filter.
10. **Tests** — unit tests for schema and setters; smoke test for filter URL updates.
11. **Docs** — update `docs/SEARCH.md`, add `docs/FILTERS.md`.
12. **Manual QA** — acceptance criteria checklist; cross-category test runs.

The detailed step-by-step plan with subtasks is produced by the writing-plans skill after this spec is approved.

---

## 14. Open Questions

None at spec-write time. If any emerge during implementation, capture in `.claude/CONTEXT.md` per the project's GG protocol.

---

## 15. Related Documents

- [`.claude/CATALOG_SEARCH_VIEW.md`](../../.claude/CATALOG_SEARCH_VIEW.md) — how the existing view + search works.
- [`.claude/AI_SSR_READINESS.md`](../../.claude/AI_SSR_READINESS.md) — SSR-friendly DO/DON'T list.
- [`docs/PRODUCTS_DATABASE_ARCHITECTURE_RU.md`](../PRODUCTS_DATABASE_ARCHITECTURE_RU.md) — DB-side data model walk-through.
- [`docs/SEARCH.md`](../SEARCH.md) — current search/sort/pagination overview (will be updated as part of this feature).
- [`.claude/designs/yes-code/`](../../.claude/designs/yes-code/) — Claude Design handoff bundle (HTML reference).
