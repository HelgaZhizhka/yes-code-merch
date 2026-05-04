# Styling Rules (Tailwind CSS) for AI Assistants

## General Principles

- **Utility-First**: Use Tailwind utility classes directly in the `className` prop. Avoid creating custom CSS files or `<style>` blocks.
- **Consistency**: Follow the project's design system (colors, spacing, typography).
- **Responsive Design**: Use mobile-first approach with prefix modifiers (`sm:`, `md:`, `lg:`, `xl:`).
- **No Inline Styles**: Strictly forbidden unless calculating values dynamically (e.g., progress bar width).

---

## Component Pattern

Always use **Arrow Functions** and clean class organization.

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging tailwind classes safely
 */
const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

interface CardProps {
  title: string;
  description: string;
  className?: string;
}

// ✅ Good - Clean tailwind classes with conditional merging
export const InfoCard = ({ title, description, className }: CardProps): JSX.Element => {
  return (
    <div className={cn(
      'p-6 rounded-xl border border-slate-200 bg-white shadow-sm',
      'hover:shadow-md transition-shadow duration-200',
      className
    )}>
      <h3 className="text-lg font-semibold text-slate-900 leading-tight">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-600">
        {description}
      </p>
    </div>
  );
};
```

---

## Class Organization

### 1. Order of Classes

To keep classes readable, follow this logical order:

1. **Layout**: `flex`, `grid`, `block`, `absolute`, `z-10`
2. **Sizing**: `w-full`, `h-32`, `max-w-md`
3. **Spacing**: `p-4`, `m-2`, `space-x-4`, `gap-4`
4. **Typography**: `text-base`, `font-bold`, `leading-tight`
5. **Visuals**: `bg-blue-500`, `rounded-lg`, `border`, `shadow`
6. **Interactions**: `hover:`, `focus:`, `active:`
7. **Responsive**: `md:`, `lg:`

### 2. Handling Complexity

If the `className` string becomes too long, break it into multiple lines or use the `cn()` utility.

```typescript
// ✅ Good - Multi-line for readability
<button
  className={cn(
    'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium',
    'bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2',
    'disabled:pointer-events-none disabled:opacity-50 transition-colors'
  )}
>
  Click Me
</button>
```

---

## Responsive Design

Always build for mobile first, then add larger screen modifiers.

```typescript
// ✅ Good
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {/* Content */}
</div>
```

---

## Conditional Classes

Use the `cn()` utility (which combines `clsx` and `tailwind-merge`) for conditional logic.

```typescript
interface ButtonProps {
  variant: 'primary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button = ({ variant, fullWidth }: ButtonProps): JSX.Element => {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-md transition-all',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'outline' && 'border border-blue-600 text-blue-600 hover:bg-blue-50',
        variant === 'ghost' && 'text-slate-600 hover:bg-slate-100',
        fullWidth ? 'w-full' : 'w-auto'
      )}
    >
      Action
    </button>
  );
};
```

---

## Design System Constraints

- **Colors**: Use the Slate scale for neutrals (e.g., `text-slate-600`, `bg-slate-50`).
- **Spacing**: Use standard multiples of 4 (e.g., `p-4` = 16px).
- **Typography**:
  - Titles: `font-bold` or `font-semibold`.
  - Body: `text-base` (16px) or `text-sm` (14px).

---

## Restrictions

❌ **NO Custom CSS**: Do not write `.my-class { ... }` in CSS files.  
❌ **NO Inline Styles**: Do not use `style={{ color: 'red' }}`.  
❌ **NO Arbitrary Values**: Avoid `top-[13px]` or `w-[432px]` unless absolutely necessary (prefer standard scale).  
❌ **NO Hardcoded Hex Codes**: Use Tailwind colors (e.g., `text-blue-500`, not `text-[#3b82f6]`).

---

## Checklist for AI

- [ ] All styling is done via Tailwind classes.
- [ ] Responsive prefixes (`sm:`, `md:`, etc.) follow mobile-first logic.
- [ ] `cn()` utility is used for merging and conditional classes.
- [ ] Class order is logical (Layout → Sizing → Spacing → Typography).
- [ ] Hover and Focus states are implemented for interactive elements.
