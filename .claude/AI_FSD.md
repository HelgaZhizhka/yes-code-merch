# Feature-Sliced Design (FSD) Rules for AI Assistants

## What is FSD?

**Feature-Sliced Design** is a modular architecture for frontend projects. Code is organized into layers and slices for better maintainability and scalability.

---

## Layer Structure

```
src/
├── app/           # Application layer (initialization, providers, routing)
├── pages/         # Page layer (route entry points, composed from features/entities)
├── features/      # Feature layer (user interactions, business features)
├── entities/      # Entity layer (business entities with data & UI)
├── layouts/       # Layout layer (page layouts, wrappers)
└── shared/        # Shared layer (reusable code, UI kit, utilities)
```

---

## Layers Explained

### 🏗️ app/ - Application Layer

**Purpose:** App-wide initialization, global providers, routing setup.

**Contains:**

- `main.tsx` - App entry point
- `app/index.tsx` - Root component with providers
- `routing/` - Route definitions
- `styles/` - Global styles

**Rules:**

- ✅ CAN import from any layer
- ✅ Initializes global state, routing, providers
- ❌ CANNOT contain business logic
- ❌ CANNOT contain UI components (except root App)

---

### 📄 pages/ - Pages Layer

**Purpose:** Route entry points. Compose UI from features/entities.

**Contains:**

- One page per route
- Page-specific layouts
- Composition of features/entities

**Rules:**

- ✅ CAN import from: features, entities, layouts, shared
- ❌ CANNOT import from: other pages
- ❌ CANNOT contain business logic (delegate to features)
- ❌ CANNOT make API calls directly (use entities)

---

### 🎯 features/ - Features Layer

**Purpose:** User-facing features and interactions (e.g., add-to-cart, login, search).

**Slice structure:**

```
features/add-to-cart/
├── ui/
│   └── add-to-cart-button.tsx
├── model/
│   ├── use-add-to-cart.ts
│   └── types.ts
├── lib/
│   └── utils.ts
└── index.ts
```

**Example:**

```typescript
// features/add-to-cart/model/use-add-to-cart.ts
import { useCartStore } from '@entities/cart';
import type { Product } from '@entities/product';

export function useAddToCart() {
  const addItem = useCartStore((state) => state.addItem);

  return (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  };
}

// features/add-to-cart/ui/AddToCartButton.tsx
import { useAddToCart } from '../model/use-add-to-cart';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addToCart = useAddToCart();

  return (
    <button onClick={() => addToCart(product)}>
      Add to Cart
    </button>
  );
}

// features/add-to-cart/index.ts
export { AddToCartButton } from './ui/add-to-cat-button';
export { useAddToCart } from './model/use-add-to-cart';
```

**Rules:**

- ✅ CAN import from: entities, shared
- ❌ CANNOT import from: pages, other features
- ✅ Contains business logic for user interactions
- ✅ Can use entity stores/hooks
- ❌ CANNOT define entities (use entities/ layer)

---

### 🧩 entities/ - Entities Layer

**Purpose:** Business entities with data layer and UI components.

**Slice structure:**

```
entities/product/
├── api/
│   ├── hooks.ts       # React Query hooks
│   ├── types.ts       # DTO types
│   ├── mapper.ts      # DTO → domain transformation
├── model/
│   ├── types.ts       # Domain types
│   └── store.ts       # Zustand store (if needed)
├── ui/
│   ├── product-card.tsx
│   └── product-list.tsx
├── lib/
│   ├── utils.ts
│   └── schema.ts      # Zod schemas
└── index.ts
```

**Example:**

```typescript
// entities/product/api/types.ts
export interface ProductDTO {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

// entities/product/api/mapper.ts
import type { ProductDTO } from './types';
import type { Product } from '../model/types';

export function mapProductFromDTO(dto: ProductDTO): Product {
  return {
    id: dto.id,
    name: dto.name,
    price: dto.price,
    imageUrl: dto.image_url,
  };
}

// entities/product/api/hooks.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@shared/api/supabase-client';
import { mapProductFromDTO } from './mapper';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;
      return data.map(mapProductFromDTO);
    },
  });
}

// entities/product/ui/ProductCard.tsx
import type { Product } from '../model/types';

interface ProductCardProps {
  product: Product;
  actions?: React.ReactNode;
}

export function ProductCard({ product, actions }: ProductCardProps) {
  return (
    <div className="card">
      <img src={product.imageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      {actions}
    </div>
  );
}

// entities/product/index.ts
export { useProducts } from './api/hooks';
export { ProductCard } from './ui/product-card';
export type { Product } from './model/types';
```

**Rules:**

- ✅ CAN import from: shared, other entities (carefully!)
- ❌ CANNOT import from: pages, features
- ✅ Owns data fetching/mutations
- ✅ Provides UI components for displaying entity
- ✅ Defines domain types
- ⚠️ Cross-entity imports should be minimal (avoid coupling)

---

### 🎨 layouts/ - Layouts Layer

**Purpose:** Page layouts and wrappers (header, footer, sidebar).

**Rules:**

- ✅ CAN import from: entities, shared
- ❌ CANNOT import from: pages, features
- ✅ Provides page structure
- ❌ CANNOT contain business logic

---

### 🔧 shared/ - Shared Layer

**Purpose:** Reusable code, UI kit, utilities, API clients.

**Structure:**

```
shared/
├── ui/                 # UI components (Button, Input, Modal, etc.)
├── lib/                # Utilities, helpers
├── api/                # API clients, types
├── config/             # Constants, configs
├── types.ts              # Shared types
```

**Rules:**

- ✅ CAN import from: nothing (or other shared modules)
- ❌ CANNOT import from: app, pages, features, entities
- ✅ Must be reusable across the app
- ❌ CANNOT contain business logic
- ❌ CANNOT depend on upper layers

---

## Import Rules (Public API)

### ✅ Always export through index.ts

```typescript
// entities/product/index.ts
export { useProducts } from './api/hooks';
export { ProductCard } from './ui/product-card';
export type { Product } from './model/types';

// ❌ DON'T export internals
// export { mapProductFromDTO } from './api/mapper'; // Internal!
```

### ✅ Import only from index.ts

```typescript
// ✅ Good
import { ProductCard, useProducts } from '@entities/product';

// ❌ Bad - bypassing public API
import { ProductCard } from '@entities/product/ui/product-card';
import { useProducts } from '@entities/product/api/hooks';
```

---

## Layer Dependencies

```
app/       → can import from: pages, features, entities, shared
pages/     → can import from: features, entities, layouts, shared
features/  → can import from: entities, shared
entities/  → can import from: shared, (other entities carefully)
layouts/   → can import from: entities, shared
shared/    → can import from: nothing (or other shared)
```

**Visualization:**

```
┌─────────────────────────────────────┐
│ app/                                │
├─────────────────────────────────────┤
│ pages/                              │
├─────────────────────────────────────┤
│ features/        layouts/           │
├─────────────────────────────────────┤
│ entities/                           │
├─────────────────────────────────────┤
│ shared/                             │
└─────────────────────────────────────┘
    ↑ Lower layers can't import from upper layers
```

---

## Common Mistakes

### ❌ Feature importing from another feature

```typescript
// ❌ BAD
// features/add-to-cart/model/use-add-to-cart.ts
import { useRemoveFromCart } from '@features/remove-from-cart'; // NO!
```

**Fix:** Use entity stores or lift logic to a shared hook.

```typescript
// ✅ GOOD
// entities/cart/model/store.ts
export const useCartStore = createAppStore<CartState>(...);

// features/add-to-cart/model/use-add-to-cart.ts
import { useCartStore } from '@entities/cart';
```

---

### ❌ Page containing business logic

```typescript
// ❌ BAD
// pages/cart/ui/CartPage.tsx
export function CartPage() {
  const [items, setItems] = useState([]);

  const addItem = (item) => {
    // Business logic in page!
    setItems([...items, item]);
  };

  return <div>...</div>;
}
```

**Fix:** Move logic to feature.

```typescript
// ✅ GOOD
// features/add-to-cart/model/use-add-to-cart.ts
export function useAddToCart() { ... }

// pages/cart/ui/CartPage.tsx
import { useAddToCart } from '@features/add-to-cart';

export function CartPage() {
  const addToCart = useAddToCart();
  return <div>...</div>;
}
```

---

### ❌ Entity importing from feature

```typescript
// ❌ BAD
// entities/product/ui/ProductCard.tsx
import { useAddToCart } from '@features/add-to-cart'; // NO!
```

**Fix:** Pass actions as props (Dependency Inversion).

```typescript
// ✅ GOOD
// entities/product/ui/product-card.tsx
interface ProductCardProps {
  product: Product;
  actions?: React.ReactNode;
}

export function ProductCard({ product, actions }: ProductCardProps) {
  return (
    <div>
      {/* ... */}
      {actions}
    </div>
  );
}

// pages/home/9ndex.tsx
import { ProductCard } from '@entities/product';
import { AddToCartButton } from '@features/add-to-cart';

<ProductCard
  product={product}
  actions={<AddToCartButton productId={product.id} />}
/>
```

---

## Checklist

Before creating/modifying code:

- [ ] Identified correct layer (app/pages/features/entities/shared)
- [ ] No forbidden imports (check layer dependencies)
- [ ] Public API exported through `index.ts`
- [ ] Imports use path aliases (`@entities/`, not `../../`)
- [ ] Business logic NOT in pages
- [ ] Entities don't know about features
- [ ] Shared layer has no dependencies on upper layers

---

## Quick Reference

| Layer        | Purpose            | Can Import From                     |
| ------------ | ------------------ | ----------------------------------- |
| **app**      | Initialization     | pages, features, entities, shared   |
| **pages**    | Route entry points | features, entities, layouts, shared |
| **features** | User interactions  | entities, shared                    |
| **entities** | Business entities  | shared, (other entities)            |
| **layouts**  | Page layouts       | entities, shared                    |
| **shared**   | Reusable code      | nothing                             |

---

**For more details, see:** [Feature-Sliced Design Documentation](https://feature-sliced.design/)
