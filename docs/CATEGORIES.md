# Categories & Breadcrumbs Entity

Categories entity for catalog navigation, category trees and breadcrumbs.

## Structure

```text
shared/api/categories/
  ├── types.ts        # DTO + domain types (Category, CategoryTree, BreadcrumbItem)
  ├── mapper.ts       # DTO -> Domain mapping (flat list, tree, breadcrumbs)
  ├── index.ts        # Supabase API (root categories, categories tree RPC)
  └── hooks.ts        # React Query hooks (useRootCategories, useCategoriesTree, useBreadcrumbs)

shared/ui/breadcrumbs.tsx   # Breadcrumbs UI component
```

## Usage

### Catalog Page with Breadcrumbs

```typescript
import { useParams } from '@tanstack/react-router';
import { useBreadcrumbs } from '@shared/api';
import { Breadcrumbs } from '@shared/ui/breadcrumbs';

function CatalogPage() {
  const { _splat } = useParams({ strict: false });
  const breadcrumbs = useBreadcrumbs(_splat);

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} className="mb-4" />
      <h1 className="text-2xl">Catalog Page</h1>
      {/* catalog content */}
    </div>
  );
}
```

### Category Navigation

```typescript
import { useRootCategories } from '@shared/api/categories/hooks';

function CategoriesBar() {
  const { data: categories } = useRootCategories();

  return (
    <nav>
      {categories.map((category) => (
        <CategoryLink key={category.id} category={category} />
      ))}
    </nav>
  );
}
```

## Features

- ✅ **Root categories** for top-level navigation.
- ✅ **Full category tree** via Supabase RPC and client-side mapping.
- ✅ **Breadcrumbs** derived from category tree and current route.
- ✅ **Typed DTOs and domain models** for categories and breadcrumbs.
- ✅ **React Query integration** with caching and `select` mappers.

## API

### Types

```typescript
// DTOs from Supabase / RPC
export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  order_hint: number | null;
}

export interface CategoryTreeDTO {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  order_hint: number | null;
  depth: number;
  root_id: string;
  root_name: string;
  root_slug: string;
}

export interface BreadcrumbItemDTO {
  path: string;
  name: string;
  is_current: boolean;
}

// Domain models
export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  orderHint: number | null;
}

export interface CategoryTree extends Category {
  depth: number;
  rootId: string;
  rootName: string;
  rootSlug: string;
  children: CategoryTree[];
}

export interface BreadcrumbItem {
  path: string;
  name: string;
  isCurrent: boolean;
}
```

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

export const mapCategoryBreadcrumbs = (
  rows: readonly BreadcrumbItemDTO[]
): BreadcrumbItem[] =>
  rows.map(({ path, name, is_current }) => ({
    path,
    name,
    isCurrent: is_current,
  }));
```

### Supabase API

```typescript
// index.ts
import { RpcFunctions, supabase } from '@shared/api/supabase-client';

export const getRootCategories = async (): Promise<CategoryDTO[]> => {
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

### React Query Hooks & Breadcrumbs

```typescript
// hooks.ts
export const useRootCategories = (): { data: Category[] } => {
  const { data } = useSuspenseQuery<CategoryDTO[], Error, Category[]>({
    queryKey: queryKey.rootCategories,
    queryFn: getRootCategories,
    select: mapCategories,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
  });

  return { data };
};

export const useCategoriesTree = (): { data: CategoryTree[] } => {
  const { data } = useSuspenseQuery<CategoryTreeDTO[], Error, CategoryTree[]>({
    queryKey: queryKey.categoriesTree,
    queryFn: getCategoriesTree,
    select: mapCategoriesTree,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
  });

  return { data };
};

export const useBreadcrumbs = (categoryPath?: string): BreadcrumbItem[] => {
  const { data: tree } = useCategoriesTree();
  // breadcrumbs are derived on the client side from the loaded category tree and the current category path.
  // The hook returns a ready-to-render array of BreadcrumbItem.
  return computeBreadcrumbsFromTree(tree, categoryPath);
};
```

## Flow: Categories & Breadcrumbs

### Root Categories

- `getRootCategories` fetches all top-level categories (`parent_id IS NULL`).
- `useRootCategories` exposes them as domain `Category[]` via `select: mapCategories`.
- Used in navigation components and category selection UIs.

### Category Tree

- `getCategoriesTree` calls a Supabase RPC to fetch a flattened tree structure.
- `mapCategoriesTree` converts this structure into nested `CategoryTree[]` with `children` arrays.
- `useCategoriesTree` provides the tree to UI components and breadcrumb logic.

### Breadcrumbs

- `useBreadcrumbs` consumes the category tree and the current route path.
- It builds a `BreadcrumbItem[]` representing the path from the root category to the current category.
- The result is passed to the `Breadcrumbs` UI component for consistent navigation across catalog pages.
