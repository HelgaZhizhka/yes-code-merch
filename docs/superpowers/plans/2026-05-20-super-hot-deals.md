# Super Hot Deals — Single-Category Derivation + Dynamic Banner

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the arbitrary top-18-by-date discount selection with a focused single-root-category showcase, and bring back the Header/MobileMenu banner driven by the same data.

**Architecture:** A pure function `pickTopDiscountedRoot` (lib layer, unit-tested) counts active-discount products per root category, picks the winner, and slices up to 6 products from it. A single `useSuspenseQuery` for discounted products + the already-cached categories tree feeds the hook `useTopDiscountedCategory`, which is consumed by `<SuperHotDeals>`, `<DiscountBanner>` in Header, and `<DiscountBanner variant="mobile">` in MobileMenu. FSD boundaries are respected by passing `<DiscountBanner/>` as a prop from `layouts/index.tsx` into Header and MobileMenu.

**Tech Stack:** TypeScript strict, React 18, TanStack Query `useSuspenseQuery`, Vitest, Tailwind, CVA, `@tanstack/react-router` `Link`, Supabase JS client.

---

## File Map

| Action | File                                                        | What changes                                                                                    |
| ------ | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Modify | `src/entities/catalog/model/types.ts`                       | Add `categoryIds: string[]` to `CatalogProduct`                                                 |
| Modify | `src/entities/catalog/lib/mapper.ts`                        | Propagate `raw.category_ids ?? []` into `categoryIds`                                           |
| Modify | `src/entities/catalog/lib/constants.ts`                     | Rename `DISCOUNTED_FETCH_LIMIT` → `DISCOUNTED_FETCH_HARD_LIMIT = 200`                           |
| Create | `src/entities/catalog/lib/pick-top-discounted-root.ts`      | Pure pick function + `PickResult` type                                                          |
| Create | `src/entities/catalog/lib/pick-top-discounted-root.test.ts` | Unit tests (9 cases)                                                                            |
| Modify | `src/entities/catalog/lib/index.ts`                         | Export `pickTopDiscountedRoot`, `PickResult`                                                    |
| Modify | `src/entities/catalog/api/index.ts`                         | Rewrite `getDiscountedProducts` (drop sort + slice, hard cap 200)                               |
| Modify | `src/entities/catalog/api/hooks.ts`                         | Add `useTopDiscountedCategory`                                                                  |
| Create | `src/shared/ui/banner/index.tsx`                            | Presentational `<Banner children variant?>` shell                                               |
| Create | `src/entities/catalog/ui/discount-banner.tsx`               | Smart `<DiscountBanner variant?>` using `useTopDiscountedCategory`                              |
| Modify | `src/entities/catalog/ui/index.ts`                          | Export `DiscountBanner`                                                                         |
| Modify | `src/entities/catalog/index.ts`                             | Re-export `useTopDiscountedCategory`, `DiscountBanner`, `PickResult`                            |
| Modify | `src/shared/ui/header/index.tsx`                            | Add `banner?: React.ReactNode` prop; render above `<header>` in Suspense                        |
| Modify | `src/shared/ui/mobile-menu/index.tsx`                       | Add `banner?: React.ReactNode` prop; render above contact widget in Suspense                    |
| Modify | `src/layouts/index.tsx`                                     | Inject `<DiscountBanner/>` into Header and `<DiscountBanner variant="mobile"/>` into MobileMenu |
| Modify | `src/pages/home/ui/super-hot-deals.tsx`                     | Switch from `useDiscountedProducts` to `useTopDiscountedCategory`                               |

---

## Task 1: Extend `CatalogProduct` type + mapper

**Files:**

- Modify: `src/entities/catalog/model/types.ts`
- Modify: `src/entities/catalog/lib/mapper.ts`

- [ ] **Step 1: Add `categoryIds` to `CatalogProduct`**

In `src/entities/catalog/model/types.ts`, add the field after `hasDiscount`:

```ts
export interface CatalogProduct {
  productId: string;
  name: string;
  slug: string;
  description: string | null;
  masterVariantId: string;
  sku: string;
  stock: number;
  originalPrice: number;
  finalPrice: number;
  currency: string;
  hasDiscount: boolean;
  discountAmount?: number;
  appliedDiscount?: AppliedDiscount;
  categoryIds: string[];
  images: ProductImages | null;
}
```

- [ ] **Step 2: Propagate `categoryIds` in mapper**

In `src/entities/catalog/lib/mapper.ts`, add `categoryIds` to the returned object (after `hasDiscount`):

```ts
return {
  productId: raw.id,
  name: raw.name,
  slug: raw.slug,
  description: raw.description,
  masterVariantId: raw.variant_id,
  sku: raw.sku,
  stock: raw.stock,
  originalPrice,
  finalPrice,
  currency: raw.currency,
  hasDiscount,
  discountAmount,
  appliedDiscount,
  categoryIds: raw.category_ids ?? [],
  images,
};
```

- [ ] **Step 3: Verify type-check passes**

```bash
pnpm tsc --noEmit
```

Expected: no errors. `category_ids` is `string[] | null` in `ProductSearchViewDTO` (from `database.types.ts`).

- [ ] **Step 4: Commit**

```bash
git add src/entities/catalog/model/types.ts src/entities/catalog/lib/mapper.ts
git commit -m "feat: add categoryIds to CatalogProduct type and mapper"
```

---

## Task 2: Update discount constants

**Files:**

- Modify: `src/entities/catalog/lib/constants.ts`

- [ ] **Step 1: Rename constant and increase hard cap**

Replace the entire file content:

```ts
export const CATALOG_SORT_FIELDS = {
  NAME: 'name',
  PRICE: 'price',
  CREATED_AT: 'created_at',
} as const;

export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 12;
export const DEFAULT_SORT_FIELD = CATALOG_SORT_FIELDS.CREATED_AT;
export const DEFAULT_SORT_DIRECTION = SORT_DIRECTIONS.DESC;

export const DISCOUNTED_LIMIT = 6;
export const DISCOUNTED_FETCH_HARD_LIMIT = 200;
```

- [ ] **Step 2: Update the API file's import (it currently references `DISCOUNTED_FETCH_LIMIT`)**

In `src/entities/catalog/api/index.ts`, the import from `'../lib/constants'` currently includes `DISCOUNTED_FETCH_LIMIT`. Update that import to `DISCOUNTED_FETCH_HARD_LIMIT` — we'll rewrite the function body fully in Task 5, so just verify the import won't cause a compile error now.

Run:

```bash
pnpm tsc --noEmit
```

Expected: error on `DISCOUNTED_FETCH_LIMIT` not found — that's expected and will be fixed in Task 5.

- [ ] **Step 3: Commit**

```bash
git add src/entities/catalog/lib/constants.ts
git commit -m "feat: rename DISCOUNTED_FETCH_LIMIT to DISCOUNTED_FETCH_HARD_LIMIT (200)"
```

---

## Task 3: TDD — `pickTopDiscountedRoot`

**Files:**

- Create: `src/entities/catalog/lib/pick-top-discounted-root.test.ts`
- Create: `src/entities/catalog/lib/pick-top-discounted-root.ts`

- [ ] **Step 1: Write the test file**

Create `src/entities/catalog/lib/pick-top-discounted-root.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import type { CategoryTree } from '@shared/api';

import type { CatalogProduct } from '../model/types';
import { pickTopDiscountedRoot } from './pick-top-discounted-root';

// --- helpers ---

const makeRoot = (
  id: string,
  name: string,
  slug: string,
  orderHint: string,
  children: CategoryTree[] = []
): CategoryTree => ({
  id,
  name,
  slug,
  parentId: null,
  orderHint,
  depth: 0,
  rootId: id,
  rootName: name,
  rootSlug: slug,
  children,
});

const makeChild = (id: string, parentRoot: CategoryTree): CategoryTree => ({
  id,
  name: `Child ${id}`,
  slug: `child-${id}`,
  parentId: parentRoot.id,
  orderHint: '001',
  depth: 1,
  rootId: parentRoot.rootId,
  rootName: parentRoot.rootName,
  rootSlug: parentRoot.rootSlug,
  children: [],
});

const makeProduct = (
  productId: string,
  categoryIds: string[]
): CatalogProduct => ({
  productId,
  name: 'Test Product',
  slug: productId,
  description: null,
  masterVariantId: 'v1',
  sku: productId,
  stock: 10,
  originalPrice: 100,
  finalPrice: 80,
  currency: 'USD',
  hasDiscount: true,
  categoryIds,
  images: null,
});

// --- roots fixture ---
const clothes = makeRoot('r-clothes', 'Clothes', 'clothes', '001');
const drinkware = makeRoot('r-drinkware', 'Drinkware', 'drinkware', '002');
const tshirts = makeChild('c-tshirts', clothes);
const mugs = makeChild('c-mugs', drinkware);

// --- tests ---

describe('pickTopDiscountedRoot', () => {
  it('returns null when products array is empty', () => {
    expect(pickTopDiscountedRoot([], [clothes, drinkware])).toBeNull();
  });

  it('returns null when tree is empty', () => {
    const p = makeProduct('p1', ['c-tshirts']);
    expect(pickTopDiscountedRoot([p], [])).toBeNull();
  });

  it('returns the only root when a single root has discounted products', () => {
    const p1 = makeProduct('p1', ['c-tshirts']);
    const p2 = makeProduct('p2', ['c-tshirts']);
    const tree = [{ ...clothes, children: [tshirts] }];

    const result = pickTopDiscountedRoot([p1, p2], tree);

    expect(result).not.toBeNull();
    expect(result?.root.id).toBe('r-clothes');
    expect(result?.root.name).toBe('Clothes');
    expect(result?.root.slug).toBe('clothes');
    expect(result?.products).toHaveLength(2);
  });

  it('returns the root with the most discounted products', () => {
    const tree = [
      { ...clothes, children: [tshirts] },
      { ...drinkware, children: [mugs] },
    ];
    const products = [
      makeProduct('p1', ['c-tshirts']),
      makeProduct('p2', ['c-tshirts']),
      makeProduct('p3', ['c-tshirts']),
      makeProduct('p4', ['c-mugs']),
    ];

    const result = pickTopDiscountedRoot(products, tree);

    expect(result?.root.id).toBe('r-clothes');
    expect(result?.products).toHaveLength(3);
  });

  it('breaks ties by orderHint ascending', () => {
    const tree = [
      { ...clothes, children: [tshirts] }, // orderHint '001'
      { ...drinkware, children: [mugs] }, // orderHint '002'
    ];
    const products = [
      makeProduct('p1', ['c-tshirts']),
      makeProduct('p2', ['c-mugs']),
    ];

    const result = pickTopDiscountedRoot(products, tree);

    expect(result?.root.id).toBe('r-clothes'); // '001' < '002'
  });

  it('counts a product in both roots when it belongs to both', () => {
    const tree = [
      { ...clothes, children: [tshirts] },
      { ...drinkware, children: [mugs] },
    ];
    // p1 belongs to both roots
    const p1 = makeProduct('p1', ['c-tshirts', 'c-mugs']);
    // p2 belongs only to clothes — makes clothes the winner
    const p2 = makeProduct('p2', ['c-tshirts']);

    const result = pickTopDiscountedRoot([p1, p2], tree);

    expect(result?.root.id).toBe('r-clothes'); // clothes: 2, drinkware: 1
    // p1 should appear in winner's products (it belongs to clothes too)
    expect(result?.products.map((p) => p.productId)).toContain('p1');
  });

  it('slices products to limit', () => {
    const tree = [{ ...clothes, children: [tshirts] }];
    const products = Array.from({ length: 10 }, (_, i) =>
      makeProduct(`p${i}`, ['c-tshirts'])
    );

    const result = pickTopDiscountedRoot(products, tree, 6);

    expect(result?.products).toHaveLength(6);
  });

  it('returns fewer than limit when not enough products available', () => {
    const tree = [{ ...clothes, children: [tshirts] }];
    const products = [
      makeProduct('p1', ['c-tshirts']),
      makeProduct('p2', ['c-tshirts']),
    ];

    const result = pickTopDiscountedRoot(products, tree, 6);

    expect(result?.products).toHaveLength(2);
  });

  it('ignores products with empty categoryIds', () => {
    const tree = [{ ...clothes, children: [tshirts] }];
    const products = [
      makeProduct('p1', []), // no categories
      makeProduct('p2', ['c-tshirts']),
    ];

    const result = pickTopDiscountedRoot(products, tree);

    expect(result?.root.id).toBe('r-clothes');
    expect(result?.products.map((p) => p.productId)).not.toContain('p1');
  });

  it('resolves leaf categoryId to correct root', () => {
    // product's categoryId is a leaf (c-tshirts), not the root directly
    const tree = [{ ...clothes, children: [tshirts] }];
    const p = makeProduct('p1', ['c-tshirts']);

    const result = pickTopDiscountedRoot([p], tree);

    expect(result?.root.id).toBe('r-clothes');
    expect(result?.root.slug).toBe('clothes');
  });
});
```

- [ ] **Step 2: Run tests — verify they fail (file doesn't exist yet)**

```bash
pnpm test -- pick-top-discounted-root --run
```

Expected: `Error: Failed to resolve import "./pick-top-discounted-root"` or similar import error.

- [ ] **Step 3: Create the implementation**

Create `src/entities/catalog/lib/pick-top-discounted-root.ts`:

```ts
import type { CategoryTree } from '@shared/api';

import type { CatalogProduct } from '../model/types';
import { DISCOUNTED_LIMIT } from './constants';

export interface PickResult {
  root: { id: string; name: string; slug: string };
  products: CatalogProduct[];
}

interface RootEntry {
  rootId: string;
  rootName: string;
  rootSlug: string;
  rootOrderHint: string;
}

const buildRootMap = (tree: CategoryTree[]): Map<string, RootEntry> => {
  const map = new Map<string, RootEntry>();

  const walk = (nodes: CategoryTree[], rootOrderHint: string): void => {
    for (const node of nodes) {
      map.set(node.id, {
        rootId: node.rootId,
        rootName: node.rootName,
        rootSlug: node.rootSlug,
        rootOrderHint,
      });
      walk(node.children, rootOrderHint);
    }
  };

  for (const root of tree) {
    walk([root], root.orderHint);
  }

  return map;
};

export const pickTopDiscountedRoot = (
  products: CatalogProduct[],
  tree: CategoryTree[],
  limit = DISCOUNTED_LIMIT
): PickResult | null => {
  if (products.length === 0 || tree.length === 0) return null;

  const rootMap = buildRootMap(tree);
  const countByRootId = new Map<string, number>();
  const metaByRootId = new Map<
    string,
    { name: string; slug: string; orderHint: string }
  >();

  for (const product of products) {
    const visitedRoots = new Set<string>();

    for (const categoryId of product.categoryIds) {
      const entry = rootMap.get(categoryId);
      if (!entry || visitedRoots.has(entry.rootId)) continue;

      visitedRoots.add(entry.rootId);
      countByRootId.set(
        entry.rootId,
        (countByRootId.get(entry.rootId) ?? 0) + 1
      );

      if (!metaByRootId.has(entry.rootId)) {
        metaByRootId.set(entry.rootId, {
          name: entry.rootName,
          slug: entry.rootSlug,
          orderHint: entry.rootOrderHint,
        });
      }
    }
  }

  if (countByRootId.size === 0) return null;

  const [winningRootId] = [...countByRootId.entries()].sort(
    ([aId, aCount], [bId, bCount]) => {
      if (bCount !== aCount) return bCount - aCount;
      const aHint = metaByRootId.get(aId)?.orderHint ?? '';
      const bHint = metaByRootId.get(bId)?.orderHint ?? '';
      return aHint.localeCompare(bHint);
    }
  )[0];

  const winner = metaByRootId.get(winningRootId);
  if (!winner) return null;

  const winningProducts = products
    .filter((p) =>
      p.categoryIds.some((id) => rootMap.get(id)?.rootId === winningRootId)
    )
    .slice(0, limit);

  return {
    root: { id: winningRootId, name: winner.name, slug: winner.slug },
    products: winningProducts,
  };
};
```

- [ ] **Step 4: Run tests — verify all 9 pass**

```bash
pnpm test -- pick-top-discounted-root --run
```

Expected output: `9 passed`.

- [ ] **Step 5: Full test suite still passes**

```bash
pnpm test --run
```

Expected: all existing tests + 9 new ones pass.

- [ ] **Step 6: Commit**

```bash
git add src/entities/catalog/lib/pick-top-discounted-root.ts src/entities/catalog/lib/pick-top-discounted-root.test.ts
git commit -m "feat: add pickTopDiscountedRoot pure function with unit tests"
```

---

## Task 4: Export from lib index

**Files:**

- Modify: `src/entities/catalog/lib/index.ts`

- [ ] **Step 1: Add export**

In `src/entities/catalog/lib/index.ts`, add at the end:

```ts
export {
  CATALOG_SORT_FIELDS,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_FIELD,
  SORT_DIRECTIONS,
} from './constants';
export {
  catalogSearchSchema,
  type CatalogSearch,
} from './catalog-search-schema';
export { createPaginationMeta, mapFromViewToCatalogProducts } from './mapper';
export { CATALOG_TEXT } from './catalog-text';
export {
  pickTopDiscountedRoot,
  type PickResult,
} from './pick-top-discounted-root';
```

- [ ] **Step 2: Type-check**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/entities/catalog/lib/index.ts
git commit -m "feat: export pickTopDiscountedRoot and PickResult from catalog lib"
```

---

## Task 5: Rewrite `getDiscountedProducts` API

**Files:**

- Modify: `src/entities/catalog/api/index.ts`

- [ ] **Step 1: Update the function**

In `src/entities/catalog/api/index.ts`, update the import from constants (line 7–11) and rewrite `getDiscountedProducts`:

Replace the import block:

```ts
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_FIELD,
  DISCOUNTED_FETCH_HARD_LIMIT,
  SORT_DIRECTIONS,
} from '../lib/constants';
```

Replace the `getDiscountedProducts` function (lines 81–93):

```ts
export const getDiscountedProducts = async (): Promise<CatalogProduct[]> => {
  const { data } = await supabase
    .from('products_search')
    .select('*')
    .not('product_discounts', 'is', null)
    .range(0, DISCOUNTED_FETCH_HARD_LIMIT - 1)
    .throwOnError();

  return mapFromViewToCatalogProducts(data ?? []).filter(
    (product) => product.hasDiscount
  );
};
```

Changes:

- Removed `.order('created_at', { ascending: false })` — order is irrelevant for the pick step.
- Removed final `.slice(0, DISCOUNTED_LIMIT)` — slicing happens inside `pickTopDiscountedRoot`.
- `DISCOUNTED_FETCH_LIMIT` (18) → `DISCOUNTED_FETCH_HARD_LIMIT` (200).

- [ ] **Step 2: Type-check**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/entities/catalog/api/index.ts
git commit -m "feat: rewrite getDiscountedProducts — active discounts, hard cap 200, no premature slice"
```

---

## Task 6: Add `useTopDiscountedCategory` hook

**Files:**

- Modify: `src/entities/catalog/api/hooks.ts`
- Modify: `src/entities/catalog/index.ts`

- [ ] **Step 1: Add the hook to `hooks.ts`**

In `src/entities/catalog/api/hooks.ts`, add imports at the top:

```ts
import { useMemo } from 'react';
import { useCategoriesTree } from '@shared/api';
import {
  pickTopDiscountedRoot,
  type PickResult,
} from '../lib/pick-top-discounted-root';
```

Add the hook after the existing `useDiscountedProducts`:

```ts
export const useTopDiscountedCategory = (): PickResult | null => {
  const { data: products } = useDiscountedProducts();
  const { data: tree } = useCategoriesTree();

  return useMemo(() => pickTopDiscountedRoot(products, tree), [products, tree]);
};
```

- [ ] **Step 2: Re-export from `entities/catalog/index.ts`**

In `src/entities/catalog/index.ts`, add to the hooks re-export line:

```ts
export {
  catalogKeys,
  useCatalogProducts,
  useDiscountedProducts,
  useFilterOptions,
  useTopDiscountedCategory,
} from './api/hooks';
```

And add `PickResult` to the type exports block:

```ts
export type {
  CatalogParams,
  CatalogProduct,
  CatalogProductsViewResponse,
  CatalogSortField,
  FilterOptions,
  FilterTag,
  PaginatedCatalogProducts,
  PaginationMeta,
  PickResult,
  SortDirection,
} from './model/types';
```

Wait — `PickResult` is defined in `lib/pick-top-discounted-root.ts`, not `model/types.ts`. Add a separate type export line:

```ts
export type { PickResult } from './lib';
```

- [ ] **Step 3: Type-check**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Run full test suite**

```bash
pnpm test --run
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/entities/catalog/api/hooks.ts src/entities/catalog/index.ts
git commit -m "feat: add useTopDiscountedCategory hook to entities/catalog"
```

---

## Task 7: Create presentational `<Banner>`

**Files:**

- Create: `src/shared/ui/banner/index.tsx`

- [ ] **Step 1: Create the file**

Create `src/shared/ui/banner/index.tsx`:

```tsx
import { cva } from 'class-variance-authority';

import icon from '@shared/assets/subtract.svg';
import { cn } from '@shared/lib/utils';

type BannerProps = {
  children: React.ReactNode;
  variant?: 'default' | 'mobile';
  className?: string;
};

const bannerVariants = cva('flex gap-2 transition-all', {
  variants: {
    variant: {
      default: 'grow items-center',
      mobile:
        'flex-col w-full max-w-[300px] items-center text-center mx-auto border-t-2 border-primary pt-8',
    },
  },
  defaultVariants: { variant: 'default' },
});

export const Banner = ({
  children,
  variant,
  className,
}: BannerProps): React.JSX.Element => {
  return (
    <div className={cn(bannerVariants({ variant }), className)}>
      <img src={icon} width={28} height={28} alt="discount icon" />
      <p className="text-xl">{children}</p>
    </div>
  );
};
```

- [ ] **Step 2: Type-check**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/shared/ui/banner/index.tsx
git commit -m "feat: recreate presentational Banner component (children + variant)"
```

---

## Task 8: Create `<DiscountBanner>` smart component

**Files:**

- Create: `src/entities/catalog/ui/discount-banner.tsx`
- Modify: `src/entities/catalog/ui/index.ts`
- Modify: `src/entities/catalog/index.ts`

- [ ] **Step 1: Create `discount-banner.tsx`**

Create `src/entities/catalog/ui/discount-banner.tsx`:

```tsx
import { Link } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';
import { Banner } from '@shared/ui/banner';

import { useTopDiscountedCategory } from '../api/hooks';

interface DiscountBannerProps {
  variant?: 'default' | 'mobile';
}

export const DiscountBanner = ({
  variant,
}: DiscountBannerProps): React.JSX.Element | null => {
  const result = useTopDiscountedCategory();
  if (!result) return null;

  return (
    <Banner variant={variant}>
      Discounts on{' '}
      <Link
        to={ROUTES.CATEGORY}
        params={{ _splat: result.root.slug }}
        className="hover:underline"
      >
        {result.root.name}
      </Link>{' '}
      this month!
    </Banner>
  );
};
```

- [ ] **Step 2: Export from `entities/catalog/ui/index.ts`**

Replace the file content:

```ts
export { CatalogCard } from './catalog-card';
export { CatalogList } from './catalog-list';
export { DiscountBanner } from './discount-banner';
```

- [ ] **Step 3: Re-export from `entities/catalog/index.ts`**

Update the UI export line:

```ts
export { CatalogCard, CatalogList, DiscountBanner } from './ui';
```

- [ ] **Step 4: Type-check**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/entities/catalog/ui/discount-banner.tsx src/entities/catalog/ui/index.ts src/entities/catalog/index.ts
git commit -m "feat: add DiscountBanner smart component to entities/catalog"
```

---

## Task 9: Integrate Banner into Header, MobileMenu, and Layout

**Files:**

- Modify: `src/shared/ui/header/index.tsx`
- Modify: `src/shared/ui/mobile-menu/index.tsx`
- Modify: `src/layouts/index.tsx`

- [ ] **Step 1: Update `Header` to accept and render the `banner` prop**

Replace `src/shared/ui/header/index.tsx` with:

```tsx
import { Suspense } from 'react';

import { Link } from '@tanstack/react-router';
import { Phone, ShoppingCart } from 'lucide-react';

import type { AuthProps } from '@shared/api';
import logo from '@shared/assets/header-logo-sprite.svg';
import { ROUTES } from '@shared/config/routes';
import { AuthMenu } from '@shared/ui/auth-menu';
import { ContactWidget } from '@shared/ui/contact-widget';
import { ThemeSwitcher } from '@shared/ui/theme-switcher';

interface HeaderProps extends AuthProps {
  mobileMenu?: React.ReactNode;
  banner?: React.ReactNode;
  onLogout(): Promise<void>;
}

export const Header = ({
  isLoading,
  isGuest,
  isAuthenticated,
  isError,
  onLogout,
  mobileMenu,
  banner,
}: HeaderProps): React.JSX.Element => {
  return (
    <>
      {banner && <Suspense fallback={null}>{banner}</Suspense>}
      <header className="flex h-16 items-center gap-4 px-4 border-b border-border min-[1020px]:h-20 min-[1020px]:px-8 min-[1120px]:h-25 min-[1120px]:px-11">
        <div className="flex items-center gap-3">
          {mobileMenu && (
            <div className="min-[1020px]:hidden">{mobileMenu}</div>
          )}
          <Link
            to={ROUTES.HOME}
            className="flex items-center text-foreground"
            aria-label="Yes Code Merch — home"
          >
            <svg
              viewBox="0 0 161 94"
              className="hidden h-12 w-auto min-[1120px]:block"
              aria-hidden="true"
            >
              <use href={`${logo}#logo`}></use>
            </svg>
            <svg
              viewBox="0 0 116 100"
              className="block h-10 w-auto min-[1120px]:hidden"
              aria-hidden="true"
            >
              <use href={`${logo}#face-logo`}></use>
            </svg>
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-center min-[1020px]:flex">
          <ContactWidget
            icon={<Phone className="h-6" />}
            label="(+971) 58 8284186"
            href="tel:971588284186"
          />
        </div>

        <nav className="ml-auto flex items-center gap-4 min-[1020px]:ml-0">
          <AuthMenu
            isLoading={isLoading}
            isGuest={isGuest}
            isAuthenticated={isAuthenticated}
            isError={isError}
            onLogout={onLogout}
          />
          <Link
            to={ROUTES.CART}
            className="flex items-center text-foreground"
            aria-label="Cart"
          >
            <ShoppingCart className="h-7 w-7" aria-hidden="true" />
          </Link>
          <ThemeSwitcher />
        </nav>
      </header>
    </>
  );
};
```

- [ ] **Step 2: Update `MobileMenu` to accept and render the `banner` prop**

Replace `src/shared/ui/mobile-menu/index.tsx` with:

```tsx
import { Suspense, useEffect } from 'react';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useLocation } from '@tanstack/react-router';
import { Menu, Phone } from 'lucide-react';

import { useCategoriesTree } from '@shared/api';
import { NAV_SKELETON_KEYS } from '@shared/lib/skeleton-keys';
import { CategoriesTree } from '@shared/ui/categories-tree';
import { ContactWidget } from '@shared/ui/contact-widget';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@shared/ui/sheet';

import { useMobileMenu } from './use-mobile-menu';

interface MobileMenuProps {
  banner?: React.ReactNode;
}

export const MobileMenu = ({
  banner,
}: MobileMenuProps = {}): React.JSX.Element => {
  const { isOpen, open: openMenu, close: closeMenu } = useMobileMenu();
  const location = useLocation();
  const { data: categoryTree } = useCategoriesTree();

  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(next) => (next ? openMenu() : closeMenu())}
    >
      <SheetTrigger aria-label="Open navigation menu">
        <Menu className="size-7 text-foreground" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex h-screen w-screen sm:max-w-[400px] flex-col p-5"
      >
        <SheetHeader className="p-2">
          <VisuallyHidden.Root>
            <SheetTitle>Navigation menu</SheetTitle>
            <SheetDescription>Navigation menu</SheetDescription>
          </VisuallyHidden.Root>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          <Suspense
            fallback={
              <div className="flex flex-col gap-5">
                {NAV_SKELETON_KEYS.map((key) => (
                  <div
                    key={key}
                    className="h-7 w-36 animate-pulse rounded bg-muted"
                  />
                ))}
              </div>
            }
          >
            <CategoriesTree categoryTree={categoryTree} variant="mobile" />
          </Suspense>
        </div>
        <div className="mt-auto flex flex-col items-center gap-6">
          {banner && <Suspense fallback={null}>{banner}</Suspense>}
          <div className="flex items-center gap-2 text-2xl">
            <ContactWidget
              icon={<Phone className="h-8" />}
              label="(+971) 58 8284186"
              href="tel:971588284186"
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
```

- [ ] **Step 3: Inject banners from `layouts/index.tsx`**

In `src/layouts/index.tsx`, add the `DiscountBanner` import and update the `<Header>` call:

```tsx
import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { TanStackQueryLayout } from '@shared/api/tanstack-query';
import { Footer } from '@shared/ui/footer';
import { Header } from '@shared/ui/header';
import { MobileMenu } from '@shared/ui/mobile-menu';
import { Toaster } from '@shared/ui/sonner';

import { DiscountBanner } from '@entities/catalog';

import { useAuth } from './hooks';

export const Layout = (): React.JSX.Element => {
  const { isLoading, isGuest, isAuthenticated, isError, handleLogout } =
    useAuth();

  return (
    <>
      <Header
        isLoading={isLoading}
        isGuest={isGuest}
        isAuthenticated={isAuthenticated}
        isError={isError}
        onLogout={handleLogout}
        mobileMenu={<MobileMenu banner={<DiscountBanner variant="mobile" />} />}
        banner={<DiscountBanner />}
      />
      <main className="flex flex-1">
        <Outlet />
      </main>
      <Footer
        isLoading={isLoading}
        isGuest={isGuest}
        isAuthenticated={isAuthenticated}
        isError={isError}
        onLogout={handleLogout}
      />
      <Toaster />
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </>
  );
};
```

- [ ] **Step 4: Type-check**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/shared/ui/header/index.tsx src/shared/ui/mobile-menu/index.tsx src/layouts/index.tsx
git commit -m "feat: integrate DiscountBanner into Header and MobileMenu via prop injection"
```

---

## Task 10: Refactor `<SuperHotDeals>`

**Files:**

- Modify: `src/pages/home/ui/super-hot-deals.tsx`

- [ ] **Step 1: Switch to `useTopDiscountedCategory`**

Replace `src/pages/home/ui/super-hot-deals.tsx` with:

```tsx
import { AddToCart } from '@features/add-to-cart';

import { CatalogCard, useTopDiscountedCategory } from '@entities/catalog';

const SECTION_TITLE = 'Super hot deals this month';
const SECTION_SUBTITLE =
  "Unveiling this month's hottest discounts and promotions! Dive into exceptional savings tailored for every shopper's delight.";

export const SuperHotDeals = (): React.JSX.Element | null => {
  const result = useTopDiscountedCategory();

  if (!result) return null;

  return (
    <section aria-label={SECTION_TITLE} className="container mx-auto px-4 py-6">
      <h2 className="mb-2 text-2xl text-center">{SECTION_TITLE}</h2>
      <p className="mb-6 text-center text-muted-foreground">
        {SECTION_SUBTITLE}
      </p>

      <div
        role="list"
        aria-label="Discounted products"
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4 xl:grid-cols-5"
      >
        {result.products.map((product) => (
          <div
            key={product.productId}
            role="listitem"
            className="w-[260px] shrink-0 snap-start sm:w-auto"
          >
            <CatalogCard
              product={product}
              actions={<AddToCart variant="catalog" />}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Type-check**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Run full test suite**

```bash
pnpm test --run
```

Expected: all tests pass (including the 9 new pick-top-discounted-root tests).

- [ ] **Step 4: Commit**

```bash
git add src/pages/home/ui/super-hot-deals.tsx
git commit -m "feat: SuperHotDeals switches to useTopDiscountedCategory (single-category derivation)"
```

---

## Task 11: Final verification

- [ ] **Step 1: Run `./init.sh`**

```bash
./init.sh
```

Expected: `tsc`, `lint`, `test` all green.

- [ ] **Step 2: Start dev server and verify desktop banner**

```bash
pnpm dev
```

Open `http://localhost:3000/`. At ≥1020px viewport:

- A promo strip appears above the header with text like "Discounts on Clothes this month!" (or whichever root wins).
- The category name is a link — click it → navigates to `/category/clothes`.
- "Super hot deals this month" section below "Shop by category" shows 1–6 cards, all from the same root category.

- [ ] **Step 3: Verify mobile banner**

In DevTools, set viewport to 375px. Open the burger menu:

- At the bottom of the sheet (above the phone contact widget), the banner appears with `variant="mobile"` styling — `border-t-2 border-primary`, centered text, same category name and link.

- [ ] **Step 4: Verify empty state**

If active discounts are unavailable (no rows in DB or all `is_active=false`):

- Promo strip in Header: absent.
- Mobile menu banner slot: absent.
- "Super hot deals this month" section: absent (no heading, no skeleton).

- [ ] **Step 5: Verify network deduplication**

Open DevTools → Network → filter `products_search`. On page load, there should be exactly **one** request with `product_discounts=not.is.null`, even though two `<DiscountBanner/>` instances are mounted.

- [ ] **Step 6: Lint fix if needed**

```bash
pnpm lint:fix
```

- [ ] **Step 7: Final commit if lint made changes**

```bash
git add -A
git commit -m "chore: lint fixes post-implementation"
```

---

## Self-Review Notes

**Spec coverage check:**

| Spec requirement                          | Task    |
| ----------------------------------------- | ------- |
| `categoryIds` in mapper                   | Task 1  |
| `DISCOUNTED_FETCH_HARD_LIMIT = 200`       | Task 2  |
| `pickTopDiscountedRoot` with 9 test cases | Task 3  |
| Lib re-export                             | Task 4  |
| Rewrite `getDiscountedProducts`           | Task 5  |
| `useTopDiscountedCategory` hook           | Task 6  |
| Presentational `<Banner>`                 | Task 7  |
| Smart `<DiscountBanner>`                  | Task 8  |
| Header + MobileMenu inject                | Task 9  |
| `SuperHotDeals` refactor                  | Task 10 |
| E2E verification                          | Task 11 |

**Type consistency across tasks:**

- `PickResult` defined in Task 3 (`pick-top-discounted-root.ts`) and exported in Task 4 — imported by hook (Task 6) and re-exported from entity public API (Task 6).
- `DISCOUNTED_FETCH_HARD_LIMIT` renamed in Task 2, used in Task 5.
- `useTopDiscountedCategory` defined in Task 6, used in Tasks 8 and 10.
- `DiscountBanner` defined in Task 8, used in Task 9.
- `Banner` `variant?: 'default' | 'mobile'` used consistently in Tasks 7, 8.

**FSD boundary check:**

- `shared/ui/banner` → no entity imports ✓
- `shared/ui/header` → no entity imports; receives `banner` prop ✓
- `shared/ui/mobile-menu` → no entity imports; receives `banner` prop ✓
- `entities/catalog/ui/discount-banner` → imports from `shared/ui/banner` (shared, allowed) ✓
- `layouts/index.tsx` → imports `DiscountBanner` from `@entities/catalog` (app/layout → entities, allowed) ✓
