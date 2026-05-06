---
name: TanStack (Router & Query) patterns
description: Routes as factories, Query with queryOptions, suspense queries
type: reference
---

# TanStack Router & Query

---

## TanStack Router

Code-based routing with factory functions.

### Route Definition

```typescript
// src/app/routing/routes.ts
export const homeRoute = (parentRoute: typeof rootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: '/',
    component: HomePage,
  });
```

### Navigation (Type-Safe)

```typescript
import { Link, useNavigate } from '@tanstack/react-router';

// Link
<Link to="/" params={{ page: 1 }}>Home</Link>

// Programmatic
const navigate = useNavigate();
navigate({ to: '/products', search: { page: 1 } });
```

---

## TanStack Query

**Server state manager** — all API data lives here.

### Pattern: queryOptions Factories

**NOT query keys factory** — we use `queryOptions` factories. More modern, includes queryKey + queryFn + select together.

```typescript
// entities/product/api/queries.ts
import { queryOptions } from '@tanstack/react-query';
import { supabase } from '@shared/api/supabase-client';

export const productQueries = {
  catalog: (params: CatalogParams) =>
    queryOptions({
      queryKey: ['products', 'catalog', params],
      queryFn: () => supabase.from('products').select('*').match(params),
      select: (data) => transformCatalog(data),
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: ['products', id],
      queryFn: () => supabase.from('products').select('*').eq('id', id).single(),
    }),
};
```

### Custom Hooks (Encapsulation)

Always wrap queries in custom hooks in `entities/{entity}/api/hooks.ts`.

```typescript
// entities/product/api/hooks.ts
import { useSuspenseQuery } from '@tanstack/react-query';
import { productQueries } from './queries';

export const useProduct = (id: string) => {
  return useSuspenseQuery(productQueries.detail(id));
};

export const useCatalogProducts = (params: CatalogParams) => {
  return useSuspenseQuery(productQueries.catalog(params));
};
```

### Usage in Component

```typescript
// pages/catalog/index.tsx
export const CatalogPage = () => {
  const { data } = useCatalogProducts({ categoryIds: ['c1'], page: 1 });
  
  return <ProductList products={data.products} />;
};
```

### Mutations

```typescript
// features/add-to-cart/model/use-add-to-cart.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item) => cartService.add(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
```

---

## Restrictions

❌ NO direct `useQuery` in components — wrap in custom hook  
❌ NO raw strings for query keys — use `queryOptions` factory pattern  
❌ NO business logic in `queryFn` — only API calls  
❌ NO ignoring `isLoading`/`isError` — always handle states

---

## Checklist

- [ ] Routes use factory pattern
- [ ] API calls wrapped in hooks inside `entities/`
- [ ] Query keys in `queries.ts` via `queryOptions`
- [ ] Loading & error states handled
- [ ] Mutations invalidate correct keys
