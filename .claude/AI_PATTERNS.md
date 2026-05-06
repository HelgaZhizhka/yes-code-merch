---
name: Common patterns and recipes
description: Ready-made examples for routing, state, forms, entities — copy-paste when building
type: reference
---

# Project Patterns

Quick reference for common architectural patterns in this project.

---

## 1. Routing (TanStack Router)

Routes are factory functions in `src/app/routing/routes.ts`.

**Example:** Creating a new route

```typescript
// routes.ts
import { createRoute } from '@tanstack/react-router';

export const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductsPage,
});
```

Then add to router:

```typescript
const routeTree = rootRoute.addChildren([productsRoute, ...])
export const router = createMemoryHistory() // or createBrowserHistory()
```

**Read:** [.claude/AI_TANSTACK.md](AI_TANSTACK.md)

---

## 2. Global State (Zustand)

Factory pattern from `@shared/lib/create-app-store.ts`.

**Example:** Creating a store

```typescript
// features/cart/lib/store.ts
import { createAppStore } from '@shared/lib/create-app-store';

export const useCartStore = createAppStore((set) => ({
  items: [],
  addItem: (id) =>
    set((state) => ({
      items: [...state.items, id],
    })),
}));

// Component usage
export const CartView = () => {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  // ...
};
```

**Why:** Selectors prevent unnecessary re-renders.

**Read:** [.claude/AI_ZUSTAND.md](AI_ZUSTAND.md)

---

## 3. Data Fetching (TanStack Query + Supabase)

Entity pattern with API hooks.

**Structure:**

```
entities/product/
├── api/
│   ├── hooks.ts       # React Query hooks with query keys
│   ├── types.ts       # DTO types
│   ├── mapper.ts      # DTO → domain transformation (if needed)
│   └── index.ts       # Exports
└── ui/
    ├── ProductCard.tsx
    └── ProductList.tsx
```

**Example:**

```typescript
// entities/product/api/hooks.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@shared/api/supabase-client';
import type { Database } from '@shared/api/database.types';

const PRODUCT_QUERY_KEYS = {
  all: ['products'] as const,
  detail: (id: string) => [...PRODUCT_QUERY_KEYS.all, id] as const,
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  });
};
```

**Read:** [.claude/AI_TANSTACK.md](AI_TANSTACK.md)

---

## 4. Forms (React Hook Form + Zod)

Validation schemas live in entity `lib/schema.ts`.

**Example:**

```typescript
// entities/product/lib/schema.ts
import { z } from 'zod'

export const productFilterSchema = z.object({
  minPrice: z.number().min(0),
  maxPrice: z.number().min(0),
  colors: z.array(z.string()).optional(),
})

export type ProductFilters = z.infer<typeof productFilterSchema>

// Component
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export const FilterForm = () => {
  const form = useForm({
    resolver: zodResolver(productFilterSchema),
    defaultValues: { minPrice: 0, maxPrice: 1000, colors: [] },
  })

  return (
    <form onSubmit={form.handleSubmit((data) => console.log(data))}>
      {/* form fields */}
    </form>
  )
}
```

---

## 5. UI Components

Built with Radix UI primitives + Tailwind CSS. Located in `@shared/ui/`.

**Naming:** `ComponentName.tsx` or `index.tsx` in folder.

**Structure:**

```typescript
import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '@shared/lib/cn'

interface DialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export const MyDialog = ({ isOpen, onOpenChange, children }: DialogProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Content className={cn(/* Tailwind classes */)}>
        {children}
      </Dialog.Content>
    </Dialog.Root>
  )
}
```

**Read:** [.claude/AI_TAILWIND.md](AI_TAILWIND.md)

---

## 6. TypeScript Patterns

Strict mode — no `any`.

**Type utilities:**

```typescript
// Instead of duplicating:
type ProductWithoutId = Omit<Product, 'id'>;

// Instead of object mutation:
const updated = { ...state, field: newValue };

// Type guards:
function isProduct(item: unknown): item is Product {
  return typeof item === 'object' && item !== null && 'id' in item;
}
```

**Read:** [.claude/AI_TYPESCRIPT.md](AI_TYPESCRIPT.md)

---

## 7. Import Order (enforced by ESLint)

```
builtin → external → @app → @pages → @features → @entities → @shared → @/
```

**Example:**

```typescript
import * as React from 'react'; // builtin
import { useQuery } from '@tanstack/react-query'; // external
import { router } from '@app/routing'; // @app
import { CartView } from '@features/cart/ui'; // @features
import { useProduct } from '@entities/product/api'; // @entities
import { Button } from '@shared/ui/button'; // @shared
import { cn } from '@/lib/utils'; // @/
```

---

## 8. FSD Layer Boundaries

| Layer        | Can import from  | Cannot import from    |
| ------------ | ---------------- | --------------------- |
| **app**      | shared           | anything else         |
| **pages**    | entities, shared | features, pages       |
| **features** | entities, shared | pages, other features |
| **entities** | shared           | anything above        |
| **shared**   | nothing above    | —                     |

**Read:** [.claude/AI_FSD.md](AI_FSD.md)

---

## 9. Testing

Unit tests with Vitest co-located next to code.

**Example:**

```typescript
// ProductCard.test.tsx
import { render, screen } from '@testing-library/react'
import { ProductCard } from './ProductCard'

describe('ProductCard', () => {
  it('renders product title', () => {
    render(<ProductCard product={{ id: '1', title: 'Shirt' }} />)
    expect(screen.getByText('Shirt')).toBeInTheDocument()
  })
})
```

Run single file:

```bash
pnpm vitest run src/entities/product/ui/ProductCard.test.tsx --config vitest.unit.config.ts
```

**Read:** [.claude/TESTING_GUIDE.md](TESTING_GUIDE.md)

---

## 10. Session Continuity Files

| File                 | Purpose                                    |
| -------------------- | ------------------------------------------ |
| `feature_list.json`  | Source of truth (done/in-progress/pending) |
| `claude-progress.md` | Session log + verified status + next step  |
| `session-handoff.md` | Filled only when interrupted mid-feature   |
| `AGENTS.md`          | Agent workflow rules                       |

**Read:** [AGENTS.md](../AGENTS.md)
