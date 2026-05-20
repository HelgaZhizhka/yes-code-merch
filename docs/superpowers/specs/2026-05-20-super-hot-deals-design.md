# Super Hot Deals — single-category derivation + dynamic Banner

**Date:** 2026-05-20
**Status:** Design — awaiting approval
**Branch:** YES-139

## Problem

Home page has a "Super hot deals this month" section. Current implementation (`getDiscountedProducts`) fetches the 18 most-recently-created products that have any `product_discounts` row, filters by `hasDiscount`, and slices to 6. This has three problems:

1. The selection is biased by `created_at` rather than discount activity (Variant A vs the desired Variant B — active discounts).
2. The 6 cards come from arbitrary categories. The user wants a single-category showcase to function as a focused promo block.
3. The Banner that previously sat at the top of the Header (`Discount on all T-Shirts this month!`) was hard-coded with a switch on category name and has since been removed entirely. It needs to come back, but driven by the same data — whatever category is "hot this month" is reflected in both the banner and the section.

## Goal

One source of truth — "the root category with the most active discounts right now" — drives both the Super Hot Deals section (up to 6 cards from that root) and the Header banner ("Discounts on {root} this month!"). If there are no active discounts, both render `null`.

## Out of scope

- Carousel library for the section's horizontal scroll (continues using Tailwind snap-scroll).
- Server-side computation via RPC (rejected in favor of client-side single query — simpler, no migration).
- HeroSlider / USPSection / HomeCatalog (YES-137).
- Discount badge and size selector on ProductCard (YES-138).
- Changes to `applyDiscountsToProduct` / `selectBestDiscount` logic.
- Per-leaf-category banners. Banner copy and section only operate at the root level (Clothes / Drinkware / Office / Bags).

## Decisions captured during brainstorm

| # | Decision |
|---|----------|
| Q1 | Winning category rule: root with the maximum count of products that have at least one active discount. |
| Q2 | If the winner has fewer than 6 eligible products, show what's available — do not fall through to the next root. |
| Q3 | Selection happens at root level only (Clothes / Drinkware / Office / Bags). Banner says "Discounts on Clothes this month!" etc. |
| Q4 | Computation runs client-side from a single query (no RPC, no two-query pattern). |
| Q5 | Empty state: hide both the section and the banner. No fallback copy, no placeholder. |
| Banner copy | `Discounts on {Category} this month!` — works grammatically for all four roots; no "all" article. |

## Architecture

Three layers, each with one responsibility:

```
┌──────────────────────────────────────────────────────────────┐
│ UI                                                            │
│  ├─ DiscountBanner (entities/catalog/ui)                      │
│  │    Smart: calls useTopDiscountedCategory, renders <Banner> │
│  │    or null                                                 │
│  ├─ Banner (shared/ui/banner)                                 │
│  │    Presentational shell: takes children + variant          │
│  └─ SuperHotDeals (pages/home/ui)                             │
│       Calls same hook, renders up to 6 CatalogCard, or null   │
├──────────────────────────────────────────────────────────────┤
│ Data hook                                                     │
│  useTopDiscountedCategory (entities/catalog/api/hooks)        │
│  - useSuspenseQuery(catalogQueries.discounted())              │
│  - useSuspenseQuery(categoryQueries.tree())                   │
│  - useMemo(() => pickTopDiscountedRoot(products, tree))       │
├──────────────────────────────────────────────────────────────┤
│ Pure compute                                                  │
│  pickTopDiscountedRoot (entities/catalog/lib)                 │
│  - Pure function, no React, no async                          │
│  - Unit-tested in isolation                                   │
├──────────────────────────────────────────────────────────────┤
│ API                                                           │
│  getDiscountedProducts (entities/catalog/api)                 │
│  - Fetches all products with non-null product_discounts       │
│  - Hard safety cap: 200 rows                                  │
│  - Returns CatalogProduct[] post-mapper, filtered by          │
│    hasDiscount (active discount check happens in mapper)      │
└──────────────────────────────────────────────────────────────┘
```

The Banner and the SuperHotDeals section both call `useTopDiscountedCategory()`. TanStack Query deduplicates by `queryKey` — one network request shared between them.

## Pure function

```ts
// src/entities/catalog/lib/pick-top-discounted-root.ts

interface PickResult {
  root: { id: string; name: string; slug: string };
  products: CatalogProduct[];
}

export const pickTopDiscountedRoot = (
  products: CatalogProduct[],
  tree: CategoryTree[],
  limit: number = DISCOUNTED_LIMIT
): PickResult | null
```

Algorithm:

1. Walk `tree` once to build `Map<categoryId, {rootId, rootName, rootSlug, rootOrderHint}>` covering every node (root and descendant). Each node maps to its own `rootId` etc.
2. For each product, derive its set of root ids: `product.categoryIds.map(id => map.get(id)?.rootId).filter(Boolean)` deduplicated into a `Set`.
3. Increment `count[rootId]` for each root id in that set. (One product in two roots counts in both.)
4. Sort root candidates by `count desc`, then by `rootOrderHint asc` as deterministic tie-breaker.
5. If the top candidate has count 0 → return `null`.
6. Filter `products` to those whose root-id set contains the winning root id.
7. `slice(0, limit)`. Return `{root, products}`.

Tie-breaker rationale: `orderHint` is the same value that drives display order in MobileMenu / Footer / Sidebar — using it keeps the "promoted" category consistent with the user-visible category order.

## Hook

```ts
// src/entities/catalog/api/hooks.ts

export const useTopDiscountedCategory = (): PickResult | null => {
  const { data: products } = useDiscountedProducts();
  const { data: tree } = useCategoriesTree();

  return useMemo(
    () => pickTopDiscountedRoot(products, tree),
    [products, tree]
  );
};
```

Composes the two existing suspense hooks rather than re-declaring query options. `catalogQueries.discounted()` already has `queryKey: ['catalog','discounted']` and `staleTime: 5 min` in `entities/catalog/api/queries.ts` — no change needed there. `useDiscountedProducts` stays exported (it's the building block); `useTopDiscountedCategory` is the new public hook used by both `DiscountBanner` and `SuperHotDeals`.

## API layer

`getDiscountedProducts` is rewritten (signature unchanged: `() => Promise<CatalogProduct[]>`):

```ts
export const getDiscountedProducts = async (): Promise<CatalogProduct[]> => {
  const { data } = await supabase
    .from('products_search')
    .select('*')
    .not('product_discounts', 'is', null)
    .range(0, DISCOUNTED_FETCH_HARD_LIMIT - 1)
    .throwOnError();

  return mapFromViewToCatalogProducts(data ?? [])
    .filter((product) => product.hasDiscount);
};
```

Differences from current:
- Drops `.order('created_at', { ascending: false })` — order doesn't matter for the pick step.
- Drops the final `.slice(0, DISCOUNTED_LIMIT)` — slicing happens inside `pickTopDiscountedRoot` after the root is chosen.
- Replaces `DISCOUNTED_FETCH_LIMIT = 18` with `DISCOUNTED_FETCH_HARD_LIMIT = 200` — a safety ceiling. With realistic discount volume (< 100 active rows), this never trips.

`hasDiscount` already encodes "discount is active right now" because `applyDiscountsToProduct` calls `getActiveDiscounts` (filters by `is_active` + date window). No additional date logic in the API layer.

## Mapper change

`CatalogProduct` gains a field:

```ts
categoryIds: string[];
```

`mapFromViewToCatalogProducts` adds `categoryIds: raw.category_ids ?? []` to the returned object. No other consumers break — additive change.

## UI

### `<Banner>` (presentational, recreated)

`src/shared/ui/banner/index.tsx` — small shell. Takes `children: ReactNode` and `variant?: 'default' | 'mobile'`. Renders the discount icon + the children. No category-aware logic, no switch. (The previous `BannerText` sub-component with the hard-coded switch is gone.)

### `<DiscountBanner>` (smart)

`src/entities/catalog/ui/discount-banner.tsx`:

```tsx
export const DiscountBanner = (): React.JSX.Element | null => {
  const result = useTopDiscountedCategory();
  if (!result) return null;

  return (
    <Banner>
      Discounts on{' '}
      <Link to={ROUTES.CATEGORY} params={{ _splat: result.root.slug }} className="hover:underline">
        {result.root.name}
      </Link>{' '}
      this month!
    </Banner>
  );
};
```

### Header integration

`Header` cannot import from `entities/catalog` (FSD: shared → entities is forbidden). Solution: Header accepts an optional `banner?: ReactNode` prop. This is the same dependency-inversion pattern already in use for `mobileMenu={<MobileMenu />}` in `src/layouts/index.tsx`.

The current redesigned Header is a single `<header>` row with no banner slot. Add a top promo strip rendered above the existing `<header>` element, inside a fragment:

```tsx
// src/shared/ui/header/index.tsx
interface HeaderProps extends AuthProps {
  mobileMenu?: React.ReactNode;
  banner?: React.ReactNode;
  onLogout(): Promise<void>;
}

// inside the component:
return (
  <>
    {banner && (
      <Suspense fallback={null}>{banner}</Suspense>
    )}
    <header className="…existing classes…">
      {/* existing markup unchanged */}
    </header>
  </>
);
```

Layout injection:

```tsx
// src/layouts/index.tsx
<Header
  …existing props…
  mobileMenu={<MobileMenu />}
  banner={<DiscountBanner />}
/>
```

`DiscountBanner` internally returns `null` when there's no winner, so the promo strip silently disappears in the empty state.

### `<SuperHotDeals>` refactor

Current file fetches `useDiscountedProducts()` and renders all products. New version uses `useTopDiscountedCategory()` and renders `result.products` (already sliced to 6). Returns `null` if `result === null`. Section title and subtitle stay as they are. The horizontal-snap-scroll grid layout stays unchanged.

## Data flow

1. Layout mounts `<Header banner={<DiscountBanner/>} />`.
2. Header renders `banner` inside `<Suspense fallback={null}>` at the existing banner breakpoint.
3. `DiscountBanner` calls `useTopDiscountedCategory()` → suspends on the discounted-products query (categories tree is already in cache from MobileMenu).
4. Query resolves → `pickTopDiscountedRoot` runs via `useMemo` → `null` or `{root, products}`.
5. `DiscountBanner` renders `<Banner>…</Banner>` or `null`.
6. User navigates to `/` → `SuperHotDeals` calls the same hook → cache hit, no second request.
7. Section renders `result.products.map(<CatalogCard/>)` or `null`.

## Error / edge cases

| Case | Behavior |
|------|----------|
| Discounted-products query fails | Caught by existing Suspense ErrorBoundary at layout level. Banner and section both disappear. |
| Empty discount data | `pickTopDiscountedRoot` returns `null`. Banner and section render `null`. |
| Zod parse failure on `product_discounts` | Existing mapper behavior — product gets `hasDiscount: false`, drops out of the candidate pool. Silent. |
| Tree is empty | `pickTopDiscountedRoot` returns `null`. |
| Product has empty `category_ids` | Ignored — contributes to no root count, excluded from output. |
| Winning root has < 6 products | Returns what's available (3, 4, 5). No fallback to next root. |
| Two roots tied on count | Lower `orderHint` wins. Deterministic. |

## Tests

Unit tests in `src/entities/catalog/lib/pick-top-discounted-root.test.ts` (vitest):

- empty products → `null`
- empty tree → `null`
- single root with discounted products → returns that root + its products
- multiple roots, clear winner → returns the winner
- tie between two roots → lower `orderHint` wins
- product whose `categoryIds` map to two different roots → contributes count to both; appears in winner's product list if winner is one of them
- products available > limit → output sliced to `limit`
- product with empty `categoryIds` → ignored
- root id derivation works for both leaf and intermediate-depth categories

No new tests for the API layer (`getDiscountedProducts`) — the change is mechanical and exercised through the hook in integration. No new tests for UI components — covered by existing visual smoke flow.

## Files inventory

**Create:**
- `src/entities/catalog/lib/pick-top-discounted-root.ts`
- `src/entities/catalog/lib/pick-top-discounted-root.test.ts`
- `src/entities/catalog/ui/discount-banner.tsx`
- `src/shared/ui/banner/index.tsx` (re-created — different API from the deleted version)

**Modify:**
- `src/entities/catalog/model/types.ts` — add `categoryIds: string[]` to `CatalogProduct`
- `src/entities/catalog/lib/mapper.ts` — propagate `raw.category_ids`
- `src/entities/catalog/api/index.ts` — rewrite `getDiscountedProducts` body
- `src/entities/catalog/api/queries.ts` — no signature change for `catalogQueries.discounted()`; verify staleTime stays 5 min
- `src/entities/catalog/api/hooks.ts` — add `useTopDiscountedCategory` (composes existing `useDiscountedProducts` + `useCategoriesTree`)
- `src/entities/catalog/lib/constants.ts` — `DISCOUNTED_FETCH_LIMIT` (18) → `DISCOUNTED_FETCH_HARD_LIMIT` (200); keep `DISCOUNTED_LIMIT` (6)
- `src/entities/catalog/lib/index.ts` — export `pickTopDiscountedRoot`
- `src/entities/catalog/ui/index.ts` — export `DiscountBanner`
- `src/entities/catalog/index.ts` — re-export new public symbols
- `src/pages/home/ui/super-hot-deals.tsx` — switch to `useTopDiscountedCategory`
- `src/shared/ui/header/index.tsx` — add `banner?: React.ReactNode` to `HeaderProps`; wrap render in fragment with `<Suspense fallback={null}>{banner}</Suspense>` above the existing `<header>` element
- `src/layouts/index.tsx` — pass `banner={<DiscountBanner/>}` next to the existing `mobileMenu={<MobileMenu/>}`

**Delete:** none.

## Reuse

- `applyDiscountsToProduct`, `getActiveDiscounts`, `selectBestDiscount` — unchanged.
- `CategoryTree`, `useCategoriesTree` — unchanged.
- `CatalogCard`, `Price`, `PriceWithDiscount` — unchanged.
- TanStack Query for shared dedup.

## Verification

After implementation:

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test          # new pick-top-discounted-root tests included
./init.sh
```

E2E via `pnpm dev`:

1. Home page (`/`):
   - Section "Super hot deals this month" shows 1–6 cards, all from the same root category (verifiable by checking which category names appear on the cards, or via network panel — single request to `products_search`).
   - If DB has no active discounts → section is absent entirely, no skeleton, no header.
2. Header (≥1020px viewport):
   - Banner text reads "Discounts on {category} this month!" where `{category}` matches the section's root.
   - Click on `{category}` link → navigates to `/category/{slug}`.
   - Mobile viewport — banner mirrors the same data in the mobile variant slot.
3. Network panel:
   - Single `products_search` request with `product_discounts=not.is.null` on home page load.
   - On navigation to another page → Header still has banner data from cache, no new request.
4. Force-clear discounts in DB → reload home → banner and section both vanish without errors.

## Decisions left to verify in implementation (low-impact)

- Visual styling of the promo strip (`bg-primary text-primary-foreground` vs muted, padding, font size) — match the redesigned Header's color tokens; finalize during dev-server check.
- Whether the existing `useDiscountedProducts` export should be removed from `entities/catalog/index.ts` once `useTopDiscountedCategory` is the only public consumer — keep it for now (low cost, no harm) and prune in a follow-up if unused.
