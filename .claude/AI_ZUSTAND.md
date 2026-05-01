### Обновлённый файл: `docs/AI_ZUSTAND.md`

````markdown
# State Management (Zustand) Rules for AI Assistants

## Core Philosophy

In this project, we separate state into two distinct categories:

1. **Server State** (Data from API) → Managed by **TanStack Query**.

   - Do NOT use Zustand to store data fetched from the backend.
   - Use `useQuery` and `useMutation` hooks within the `entities/` layer.

2. **Client State** (UI State, User Session, Cart, Modals) → Managed by **Zustand**.
   - Use Zustand ONLY for global UI state that is not persisted in the database or needs to be shared across features without prop drilling.

---

## When to use Zustand?

✅ **YES:**

- Shopping Cart (client-side items before checkout).
- User Session / Auth Tokens (if not handled by HTTP-only cookies).
- UI Themes (Dark/Light mode).
- Global Modals / Toasts / Notifications management.
- Complex multi-step form state (wizard).

❌ **NO:**

- Caching API responses (Use TanStack Query).
- Storing lists of products/users (Use TanStack Query).
- Local component state (Use `useState` or `useReducer`).

---

## Store Creation Pattern

Use the `createAppStore` helper from `@shared/lib/create-app-store.ts` to ensure consistency (Immer, Devtools, and Persistence).

### Example: Shopping Cart Store

```typescript
import { createAppStore } from '@shared/lib/create-app-store';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  toggleCart: () => void;
  clearCart: () => void;
}

// ✅ Good - Explicitly typed arrow function within the factory
export const useCartStore = createAppStore<CartState>(
  'cart-store', // Unique name for Devtools/Persistence
  (set) => ({
    items: [],
    isOpen: false,

    addItem: (newItem) =>
      set((state) => {
        const existingItem = state.items.find((item) => item.id === newItem.id);
        if (existingItem) {
          existingItem.quantity += newItem.quantity;
        } else {
          state.items.push(newItem); // Valid because of Immer
        }
      }),

    removeItem: (id) =>
      set((state) => {
        state.items = state.items.filter((item) => item.id !== id);
      }),

    toggleCart: () =>
      set((state) => {
        state.isOpen = !state.isOpen;
      }),

    clearCart: () =>
      set((state) => {
        state.items = [];
      }),
  })
);
```
````

---

## Usage in Components (Selectors)

**IMPORTANT**: Always use specific selectors to prevent unnecessary re-renders.

```typescript
// ✅ Good - Select specific data
export const CartBadge = () => {
  const itemCount = useCartStore((state) => state.items.length);
  return <span className="badge">{itemCount}</span>;
};

// ✅ Good - Select specific action
export const CartToggle = () => {
  const toggleCart = useCartStore((state) => state.toggleCart);
  return <button onClick={toggleCart}>Cart</button>;
};

// ❌ Bad - Destructuring (Causes re-renders on unrelated changes)
const { items, toggleCart } = useCartStore();
```

---

## Integration with TanStack Query

Sometimes Zustand needs to interact with Server State. Keep them decoupled.

- **Component Layer**: Component calls Zustand action AND TanStack mutation.
- **Effect Layer**: `useEffect` listens to Query data and updates Zustand (avoid if possible).

**Best Practice**: Keep them separate.

- The UI renders data from `useQuery`.
- User interactions trigger `useMutation`.
- Zustand handles the _result_ of interactions only if it affects global UI (e.g., opening a success modal).

---

## Restrictions

❌ **NO Server Data in Zustand**: If it comes from an API, it belongs in `useQuery`.  
❌ **NO `any` types**: State and actions must be strictly typed.  
❌ **NO Logic in Components**: Move complex state logic into store actions.  
❌ **NO Direct State Access in Render**: Always use selectors.

---

## Checklist for AI

- [ ] Is this "Server State"? If yes → Use **TanStack Query**.
- [ ] Is this "Global UI State"? If yes → Use **Zustand**.
- [ ] Store uses `createAppStore` factory.
- [ ] All actions use arrow functions.
- [ ] Selectors are used in components.

```

```
