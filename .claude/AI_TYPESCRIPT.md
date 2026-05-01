# TypeScript Rules for AI Assistants

## General Principles

### Strict Mode
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**Rules:**
- **NO `any` allowed**: Use `unknown` if the type is truly dynamic, then use type guards.
- **Explicit Typing**: All function parameters and return types must be explicitly typed.
- **Arrow Functions**: ALWAYS use arrow functions for components, hooks, and general logic. Avoid the `function` keyword unless specifically required (e.g., for `this` context or specific generator patterns).
- **Inference**: Let TypeScript infer types for simple variable initializations where the value is obvious.

### Naming Conventions

```typescript
// ✅ Good
interface UserProfile { }
type UserId = string;
enum UserRole { }
const MAX_RETRY_COUNT = 3;

// ❌ Bad
interface userProfile { }
type userid = string;
enum userrole { }
const max_retry_count = 3;
```

**Rules:**
- **Interfaces/Types/Enums**: `PascalCase`.
- **Variables/Functions**: `camelCase`.
- **Constants**: `UPPER_SNAKE_CASE`.
- **Private Fields**: Use `_prefix` (optional).

## Typing Strategy

### Interfaces vs Types

**Use `interface` for component props and object definitions:**
```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

// ❌ Bad
type ButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}
```

**Use `type` for unions, intersections, and primitives:**
```typescript
// ✅ Good
type Status = 'pending' | 'success' | 'error';
type UserWithRole = User & { role: Role };

// ❌ Bad (interfaces cannot represent unions)
interface Status { } 
```

### TypeScript Utilities

**Always use built-in utility types instead of duplicating logic:**

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  inStock: boolean;
}

// Pick - select specific fields
type ProductPreview = Pick<Product, 'id' | 'name' | 'price'>;

// Omit - exclude specific fields
type ProductWithoutId = Omit<Product, 'id'>;

// Partial - all fields become optional
type ProductUpdate = Partial<Product>;

// Record - key-value mapping
type ProductMap = Record<string, Product>;
```

## Function Typing

### Arrow Function Syntax

```typescript
// ✅ Good - Typed arrow function
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

// ✅ Good - Generics with arrow functions
const findById = <T extends { id: string }>(items: T[], id: string): T | undefined => {
  return items.find(item => item.id === id);
};

// ❌ Bad - Using 'function' keyword
function calculateTotal(items: CartItem[]): number { ... }
```

### Async/Await and Promises

```typescript
// ✅ Good
const fetchUser = async (id: string): Promise<User> => {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
};

// ✅ Good - Error handling
const fetchUserSafe = async (id: string): Promise<User | null> => {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};
```

## Type Guards and Safety

### Type Guards

```typescript
// ✅ Good - Type guard
const isProduct = (obj: unknown): obj is Product => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'price' in obj
  );
};
```

### Discriminated Unions

```typescript
type ApiResponse<T> = 
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
  | { status: 'loading' };

const handleResponse = <T>(response: ApiResponse<T>): void => {
  switch (response.status) {
    case 'success':
      console.log(response.data);
      break;
    case 'error':
      console.log(response.error);
      break;
  }
};
```

## React-Specific Types

### Components and Props

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

// ✅ Good - Typed component using Arrow Function
export const Button = ({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false 
}: ButtonProps): JSX.Element => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
};
```

### Event Handling

```typescript
const Form = ({ onSubmit }: FormProps): JSX.Element => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    console.log(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
    </form>
  );
};
```

## Immutability and Null Safety

### Immutability Patterns

```typescript
// ✅ Good - Immutable map
const updatedItems = items.map(item => 
  item.id === targetId ? { ...item, quantity: item.quantity + 1 } : item
);

// ✅ Good - Immutable add
const newItems = [...items, newItem];

// ❌ Bad - Direct mutation
items.push(newItem); 
```

### Null Safety

```typescript
// ✅ Good - Optional chaining and Nullish coalescing
const userName = user?.profile?.name ?? 'Guest';
const port = config.port ?? 3000;

// ❌ Bad - Non-null assertion (use with extreme caution)
const name = user!.name; 
```

## Restrictions

❌ **NO `any`**: Use `unknown` or specific interfaces.  
❌ **NO `function` keyword**: Strictly use `const Name = () => {}`.  
❌ **NO `@ts-ignore`**: Fix the underlying type issue instead.  
❌ **NO `as` Casting**: Only use if absolutely necessary (e.g., external API mismatches) and verify with guards.  
❌ **NO Type Duplication**: Use utility types (`Pick`, `Omit`, etc.).  

## Pre-commit Checklist

- [ ] No `any` types in the codebase.
- [ ] Every function is an Arrow Function.
- [ ] Explicit return types for all functions/components.
- [ ] TypeScript utilities are used instead of duplicates.
- [ ] `strictNullChecks` are handled (no crashing on undefined).
- [ ] `tsc --noEmit` runs without errors.
