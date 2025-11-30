# Categories & Breadcrumbs Entity

Categories entity for catalog navigation, category trees and breadcrumbs.

## Structure

```text
shared/api/categories/
  ├── types.ts        # DTO + domain types (Category, CategoryTree, BreadcrumbItem)
  ├── mapper.ts       # DTO -> Domain mapping (flat list, tree, breadcrumbs)
  ├── helpers.ts      # Category utilities (getCategoryBySlug, getAllCategoryIds, breadcrumbs)
  ├── index.ts        # Supabase API (root categories, categories tree RPC)
  └── hooks.ts        # React Query hooks (useCategoriesTree, useCategoryData)

shared/ui/breadcrumbs.tsx   # Breadcrumbs UI component
```

## Features

- ✅ **Root categories** for top-level navigation
- ✅ **Full category tree** via Supabase RPC and client-side mapping
- ✅ **Breadcrumbs** derived from category tree and current route
- ✅ **Hierarchical category IDs** - collects parent + all children IDs
- ✅ **Category lookup** by slug with path finding
- ✅ **Universal hook** - `useCategoryData` returns everything in one call
- ✅ **Typed DTOs and domain models** for categories and breadcrumbs
- ✅ **React Query integration** with aggressive caching (24h/7d)
- ✅ **Suspense integration** - automatic loading states with React Suspense
- ✅ **Error boundaries** - centralized error handling at page level

## API

### Types

```typescript
import type { Public } from '@shared/api/supabase-client';

// DTOs from Supabase database and RPC functions
export type CategoryRowDTO = Public['Tables']['categories']['Row'];
export type CategoryTreeDTO =
  Public['Functions']['get_all_categories_tree']['Returns'][0];

// Domain models (camelCase)
export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  orderHint: string; // Stored as text in database for custom sorting
}

export type CategoryTree = Category & {
  depth: number;
  rootId: string;
  rootName: string;
  rootSlug: string;
  children: CategoryTree[];
};

export type BreadcrumbItem = {
  path: string;
  name: string;
  isCurrent: boolean;
};
```

**Type Architecture:**

- `CategoryRowDTO` - auto-generated from Supabase `categories` table (snake_case)
- `CategoryTreeDTO` - auto-generated from RPC function return type (snake_case)
- `Category` - domain model with camelCase fields
- `CategoryTree` - extends `Category` with tree-specific fields
- `BreadcrumbItem` - domain model for navigation breadcrumbs

### Mapping

```typescript
// mapper.ts
export const mapCategories = (categories: readonly CategoryDTO[]): Category[] =>
  categories.map(({ id, name, slug, parent_id, order_hint }) => ({
    id,
    name,
    slug,
    parentId: parent_id,
    orderHint: order_hint,
  }));

export const mapCategoriesTree = (
  rows: readonly CategoryTreeDTO[]
): CategoryTree[] => {
  const categoryMap = new Map<string, CategoryTree>();
  const rootCategories: CategoryTree[] = [];

  // Build nodes
  for (const row of rows) {
    const category: CategoryTree = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      parentId: row.parent_id,
      orderHint: row.order_hint,
      depth: row.depth,
      rootId: row.root_id,
      rootName: row.root_name,
      rootSlug: row.root_slug,
      children: [],
    };
    categoryMap.set(row.id, category);
  }

  // Build tree structure
  for (const row of rows) {
    const category = categoryMap.get(row.id);
    if (!category) continue;

    if (row.parent_id && categoryMap.has(row.parent_id)) {
      const parent = categoryMap.get(row.parent_id);
      parent?.children.push(category);
    } else {
      rootCategories.push(category);
    }
  }

  return rootCategories;
};
```

**Note:** Breadcrumb items are created directly from the category tree structure using helper functions, so no separate mapper is needed.

### Supabase API

```typescript
// index.ts
import { RpcFunctions, supabase } from '@shared/api/supabase-client';
import type { CategoryRowDTO, CategoryTreeDTO } from './types';

export const getRootCategories = async (): Promise<CategoryRowDTO[]> => {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('order_hint', { ascending: true })
    .order('name', { ascending: true })
    .throwOnError();

  return categories ?? [];
};

export const getCategoriesTree = async (): Promise<CategoryTreeDTO[]> => {
  const { data } = await supabase
    .rpc(RpcFunctions.getCategoriesTree)
    .throwOnError();

  return data ?? [];
};
```

**Note:** These functions return DTOs (snake_case) which are then mapped to domain models (camelCase) via React Query's `select` option.

### React Query Hooks

```typescript
// hooks.ts
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRootCategories, getCategoriesTree } from './index';
import { mapCategories, mapCategoriesTree } from './mapper';

export const useRootCategories = (): { data: Category[] } => {
  const { data } = useSuspenseQuery<CategoryRowDTO[], Error, Category[]>({
    queryKey: queryKey.rootCategories,
    queryFn: getRootCategories, // Returns CategoryRowDTO[]
    select: mapCategories, // Maps to Category[]
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return { data };
};

export const useCategoriesTree = (): { data: CategoryTree[] } => {
  const { data } = useSuspenseQuery<CategoryTreeDTO[], Error, CategoryTree[]>({
    queryKey: queryKey.categoriesTree,
    queryFn: getCategoriesTree, // Returns CategoryTreeDTO[]
    select: mapCategoriesTree, // Maps to CategoryTree[]
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return { data };
};

// Universal hook - returns all category data in one call
export const useCategoryData = (categoryPath?: string) => {
  const { data: tree } = useCategoriesTree();

  return useMemo(() => {
    if (!categoryPath || !tree) {
      return {
        breadcrumbs: [],
        category: null,
        categoryId: null,
        categoryIds: null,
      };
    }

    const segments = categoryPath.split('/').filter(Boolean);
    const targetSlug = segments.at(-1) ?? '';

    const category = getCategoryBySlug(tree, targetSlug);
    const breadcrumbs = getCategoryBreadcrumbPaths(tree, targetSlug);
    const categoryId = category?.id ?? null;
    const categoryIds = category ? getAllCategoryIds(category) : null;

    return { breadcrumbs, category, categoryId, categoryIds };
  }, [categoryPath, tree]);
};
```

**Type flow:**

- `queryFn` returns DTOs (snake_case from database)
- `select` transforms DTOs to domain models (camelCase)
- Final `data` is always in domain model format

## Helper Functions

### `getCategoryBySlug(tree, slug)`

Finds a category in the tree by its slug.

```typescript
const category = getCategoryBySlug(tree, 'mens-clothing');
// Returns: CategoryTree | null
```

### `getAllCategoryIds(category)`

Collects the current category ID and all child category IDs recursively.

```typescript
const category = getCategoryBySlug(tree, 'clothing');
const ids = getAllCategoryIds(category);
// Returns: ['clothing-id', 'mens-id', 'womens-id', 'kids-id']
```

**Use case:** Filtering products by parent category (includes all children).

### `getCategoryBreadcrumbPaths(tree, slug)`

Builds breadcrumb items from root to target category.

```typescript
const breadcrumbs = getCategoryBreadcrumbPaths(tree, 'mens-t-shirts');
// Returns: [
//   { path: 'clothing', name: 'Clothing', isCurrent: false },
//   { path: 'clothing/mens', name: 'Mens', isCurrent: false },
//   { path: 'clothing/mens/t-shirts', name: 'T-Shirts', isCurrent: true }
// ]
```

## Flow: Categories & Product Filtering

### 1. Category Tree Loading

- `getCategoriesTree` calls Supabase RPC to fetch flattened tree
- `useCategoriesTree` caches it for 24 hours
- All other hooks consume this cached tree

### 2. Category Resolution

- User navigates to `/category/clothing/mens`
- `useCategoryData` finds category by slug
- Collects `categoryIds`: `['clothing-id', 'mens-id', 'mens-tshirts-id', ...]`

### 3. Product Filtering

- `useProducts({ categoryIds })` fetches products using `useSuspenseQuery`
- Query filters by `.in('product_categories.category_id', categoryIds)`
- Products from parent + all children are shown
- Loading state handled by Suspense, errors by ErrorBoundary

### 4. Breadcrumbs

- `getCategoryBreadcrumbPaths` builds path from tree
- `Breadcrumbs` component renders navigation

## Optimization

**Single Query to Rule Them All:**

React Query automatically deduplicates:

- `useCategoryData` calls `useCategoriesTree()` ✅
- Other components call `useCategoriesTree()` ✅
- Result: **One HTTP request**, rest from cache!

**Aggressive Caching:**

- `staleTime: 24h` - categories rarely change
- `gcTime: 7d` - keep in memory for a week
- No refetch on mount/focus/reconnect
