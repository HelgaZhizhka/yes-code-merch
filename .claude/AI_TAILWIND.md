---
name: Tailwind CSS (v4) styling rules
description: Utility-first, mobile-first, cn() for merging; no inline styles except dynamic CSS variables
type: reference
---

# Tailwind CSS (v4)

Utility-first styling. No custom CSS files or inline styles (with one exception: dynamic CSS variables).

---

## Entry Point

```css
/* src/app/styles/index.css */
@import 'tailwindcss';

@theme {
  --color-primary: #007bff;
  /* custom tokens */
}
```

---

## Component Pattern

Use arrow functions + `cn()` utility for merging + conditional classes.

```typescript
import { cn } from '@shared/lib/utils';

interface CardProps {
  title: string;
  className?: string;
}

export const Card = ({ title, className }: CardProps) => {
  return (
    <div className={cn(
      'p-6 rounded-lg border border-slate-200 bg-white shadow-sm',
      'hover:shadow-md transition-shadow',
      className
    )}>
      <h3 className="text-lg font-semibold text-slate-900">
        {title}
      </h3>
    </div>
  );
};
```

---

## Class Organization

1. **Layout:** `flex`, `grid`, `absolute`, `z-10`
2. **Sizing:** `w-full`, `h-32`, `max-w-md`
3. **Spacing:** `p-4`, `m-2`, `gap-4`
4. **Typography:** `text-base`, `font-semibold`
5. **Visuals:** `bg-blue-500`, `rounded-lg`, `border`, `shadow`
6. **Interactions:** `hover:`, `focus:`, `active:`
7. **Responsive:** `md:`, `lg:`

---

## Responsive Design

Mobile-first:

```typescript
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {/* responsive layout */}
</div>
```

---

## Conditional Classes

```typescript
interface ButtonProps {
  variant: 'primary' | 'outline';
  disabled?: boolean;
}

export const Button = ({ variant, disabled }: ButtonProps) => {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-md transition-all',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'outline' && 'border border-blue-600 text-blue-600',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      disabled={disabled}
    >
      Action
    </button>
  );
};
```

---

## Exception: Dynamic CSS Variables

**When:** Dynamic color/style calculated at runtime (e.g., user-selected theme color, background).

**Where:** `src/shared/ui/categories.tsx` and similar dynamic UI.

```typescript
// ✅ Allowed - dynamic CSS variable (not inline style)
export const CategoryTag = ({ color }: { color: string }) => {
  return (
    <div
      style={{
        backgroundColor: color,
        '--shadow-color': color,
      } as React.CSSProperties}
      className="p-2 rounded-md shadow-md hover:shadow-xl transition-shadow"
    >
      Category
    </div>
  );
};
```

**Why:** CSS variables can't be created in Tailwind classes at runtime. This is the exception, not the rule.

---

## Restrictions

❌ NO custom CSS files (`.my-class { ... }`)  
❌ NO inline `style={{ color: 'red' }}` (use CSS variables for dynamic)  
❌ NO arbitrary values (`top-[13px]`) — use standard scale  
❌ NO hardcoded hex codes (`text-[#3b82f6]`) — use Tailwind colors

---

## Checklist

- [ ] All styling via Tailwind classes
- [ ] Mobile-first responsive logic
- [ ] `cn()` utility for merging/conditionals
- [ ] Class order: Layout → Sizing → Spacing → Typography
- [ ] Hover/Focus states on interactive elements
- [ ] CSS variables only for dynamic color/theme
