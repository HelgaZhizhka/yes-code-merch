# USP Section — Design Spec

**Linear:** YES-142  
**Branch:** yes-142  
**Date:** 2026-05-21

---

## What

A static promotional section on the home page with heading and three benefit cards.
Placed below `SuperHotDeals` and above the catalog section in `src/pages/home/index.tsx`.

---

## Component

**File:** `src/pages/home/ui/usp-section.tsx`

Single file — no child components extracted. Three cards are static data rendered via `.map()`.

---

## Data

```ts
type UspCard = {
  id: string;
  title: string;
  description: string;
  cta: { label: string; href: string; isExternal: boolean };
  bg: string;
};

const USP_CARDS: UspCard[] = [
  {
    id: 'delivery',
    title: 'Free and Fast delivery',
    description:
      'Receipt of goods within 1-2 weeks. We will pack your package securely and ship it carefully. Want more information?',
    cta: { label: 'More', href: '/', isExternal: false },
    bg: 'bg-blue-600',
  },
  {
    id: 'range',
    title: 'Wide range',
    description:
      'A large selection of quality goods. Funny gifts for you and your loved ones. Go to catalog to see more.',
    cta: { label: 'More', href: '/', isExternal: false },
    bg: 'bg-green-700',
  },
  {
    id: 'order',
    title: 'Quick order placement',
    description:
      'Our team will be happy to process your order quickly. If you have any questions - write or call us!',
    cta: { label: 'Contact us', href: 'tel:971588284186', isExternal: true },
    bg: 'bg-purple-600',
  },
];
```

---

## Layout

### Section wrapper

- `<section aria-label="Shopping easy with YES CODE!">`
- `mx-auto max-w-[1020px] px-4 py-10`

### Heading

- `<h2>` with `text-foreground` (dark-mode compatible)
- Pink accent line: `<div>` with `w-10 h-1 bg-pink-500 mx-auto mt-2 mb-8`

### Grid

- `<ul>` with `grid grid-cols-1 gap-4 sm:grid-cols-3`

### Card (`<li>`)

- `relative overflow-hidden rounded-xl min-h-[280px] p-6 flex flex-col justify-between {bg}`
- **Raccoon image:** `absolute top-0 right-0 w-40 h-40 object-contain` — `Raccoon.svg` from `@shared/assets/Raccoon.svg`, `alt=""` (decorative, ignored by screen readers)
- **Title:** `text-xl font-bold text-white`
- **Description:** `text-sm text-white/90 mt-2`
- **CTA button:** `mt-4` — `variant="outline"` with explicit `bg-white` override

### CTA link logic

- `isExternal: false` → `<Button asChild><Link to={href}>` from `@tanstack/react-router`
- `isExternal: true` → `<Button asChild><a href={href}>` (tel: link)

---

## Wire-up in `src/pages/home/index.tsx`

Add `<USPSection />` directly after the `<Suspense>` block wrapping `<SuperHotDeals />`, before the categories section or any future catalog section.

```tsx
<Suspense fallback={<SuperHotDealsSkeleton />}>
  <SuperHotDeals />
</Suspense>

<USPSection />
```

No Suspense needed — fully static, no async data.

---

## Constraints

- Tailwind only — no inline styles
- `text-foreground` for section heading (dark-mode safe)
- Internal links: `<Link>` from `@tanstack/react-router`
- `tel:` link: plain `<a>` (not a router Link)
- File name: kebab-case `usp-section.tsx`
- FSD layer: `pages/home/ui/` — no cross-layer imports needed
- Raccoon image is decorative → `alt=""` (empty alt, standard for decorative images)

---

## Out of scope

- Actual per-card raccoon illustrations (user will provide later; `Raccoon.svg` is placeholder for all three)
- Animations or hover effects beyond Tailwind defaults
- i18n (inline strings acceptable per current project state)
