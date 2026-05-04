# TanStack (Router & Query) Rules for AI Assistants

## TanStack Router

We use **code-based routing** with factory functions.

### Route Definition Pattern

Routes are defined as factory functions to support FSD and dependency injection.

```typescript
// app/routing/routes.ts
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './router';
import { HomePage } from '@pages/home';

// ✅ Good - Route Factory
export const homeRoute = (parentRoute: typeof rootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: '/',
    component: HomePage,
  });
```

### Navigation

Use the type-safe `Link` component or `useNavigate` hook.

```typescript
import { Link } from '@tanstack/react-router';

// ✅ Good - Type-safe navigation
export const Nav = () => (
  <nav>
    <Link to="/" className="[&.active]:font-bold">Home</Link>
    <Link to="/products" params={{ page: 1 }}>Products</Link>
  </nav>
);
```

---

## TanStack Query (React Query)

**Primary Rule**: This is our **Server State Manager**. All API data lives here.

### Query Hooks Location

- Queries must be encapsulated in **Custom Hooks** inside the `entities/{entity}/api/` layer.
- Do NOT use `useQuery` directly in UI components.

### Structure Example

```typescript
// entities/product/api/hooks.ts
import { useQuery } from '@tanstack/react-query';
import { productService } from './service';
import { productKeys } from './keys';

// ✅ Good - Encapsulated Hook using Arrow Function
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
};
```

### Query Keys Factory

Always use a Query Key Factory pattern to avoid key collisions and make invalidation easy.

```typescript
// entities/product/api/keys.ts
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};
```

### Paginated Queries

For queries with pagination, return a structured response with data and metadata:

```typescript
// entities/product/api/hooks.ts
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const useProducts = (params: CatalogParams) => {
  return useSuspenseQuery<APIResponse, Error, PaginatedResponse<Product>>({
    queryKey: productKeys.catalog(params), // Include ALL params in key
    queryFn: () => getCatalogProducts(params),
    select: (response) => transformToPaginated(response, params),
  });
};

// Usage in component
const { data } = useProducts({ categoryIds, page: 2, pageSize: 12 });
const products = data.data;
const { hasNextPage, totalCount } = data.meta;
```

### Mutations

Mutations should also be encapsulated hooks.

```typescript
// features/add-to-cart/model/use-add-to-cart.ts
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.addItem,
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};
```

---

## Restrictions

❌ **NO direct `useQuery` in components**: Always wrap in a custom hook in `entities/`.  
❌ **NO magic strings for keys**: Use the Key Factory pattern.  
❌ **NO business logic in `queryFn`**: The `queryFn` should only call an API service/client.  
❌ **NO ignoring `isLoading` / `isError`**: Always handle loading and error states in the UI.

---

## Checklist for AI

- [ ] Routes are defined using the factory pattern.
- [ ] API calls are wrapped in `useQuery`/`useMutation` hooks inside `entities/`.
- [ ] Query Keys are centralized in a `keys.ts` file.
- [ ] Loading and Error states are handled in the UI.
