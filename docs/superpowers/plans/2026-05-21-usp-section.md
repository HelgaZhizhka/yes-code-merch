# USP Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a static `USPSection` component to the home page showing three benefit cards (delivery, range, quick order) below SuperHotDeals.

**Architecture:** Single file `usp-section.tsx` with static `USP_CARDS` data array rendered via `.map()`. No async data. Wired up in `src/pages/home/index.tsx` after `<SuperHotDeals />`.

**Tech Stack:** React, TypeScript (strict), Tailwind CSS, `@tanstack/react-router` (`<Link>`), `@radix-ui/react-slot` (via `Button asChild`), Vitest + React Testing Library.

---

## Files

| Action | Path |
|--------|------|
| Create | `src/pages/home/ui/usp-section.tsx` |
| Create | `src/pages/home/ui/usp-section.test.tsx` |
| Modify | `src/pages/home/index.tsx` |

---

## Task 1: Write failing tests

**Files:**
- Create: `src/pages/home/ui/usp-section.test.tsx`

- [ ] **Step 1: Create the test file**

```tsx
// src/pages/home/ui/usp-section.test.tsx
import { render, screen } from '@testing-library/react';
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { describe, expect, it } from 'vitest';

import { USPSection } from './usp-section';

function renderWithRouter(ui: React.ReactElement) {
  const rootRoute = createRootRoute({ component: () => <>{ui}</> });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory(),
  });
  return render(<RouterProvider router={router} />);
}

describe('USPSection', () => {
  it('renders section heading', () => {
    renderWithRouter(<USPSection />);
    expect(
      screen.getByRole('heading', { name: /shopping easy with yes code/i })
    ).toBeInTheDocument();
  });

  it('renders all three card titles', () => {
    renderWithRouter(<USPSection />);
    expect(screen.getByText('Free and Fast delivery')).toBeInTheDocument();
    expect(screen.getByText('Wide range')).toBeInTheDocument();
    expect(screen.getByText('Quick order placement')).toBeInTheDocument();
  });

  it('renders "Contact us" as a tel: anchor', () => {
    renderWithRouter(<USPSection />);
    const link = screen.getByRole('link', { name: /contact us/i });
    expect(link).toHaveAttribute('href', 'tel:971588284186');
  });

  it('renders "More" buttons as router links pointing to /', () => {
    renderWithRouter(<USPSection />);
    const moreLinks = screen.getAllByRole('link', { name: /^more$/i });
    expect(moreLinks).toHaveLength(2);
    moreLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/');
    });
  });
});
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
pnpm test -- usp-section --run
```

Expected output: `Cannot find module './usp-section'` or similar — the file doesn't exist yet.

---

## Task 2: Implement `usp-section.tsx`

**Files:**
- Create: `src/pages/home/ui/usp-section.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/pages/home/ui/usp-section.tsx
import { Link } from '@tanstack/react-router';

import Raccoon from '@shared/assets/Raccoon.svg';
import { Button } from '@shared/ui/button';

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

const SECTION_TITLE = 'Shopping easy with YES CODE!';

export const USPSection = (): React.JSX.Element => {
  return (
    <section
      aria-label={SECTION_TITLE}
      className="mx-auto max-w-[1020px] px-4 py-10"
    >
      <h2 className="text-2xl font-bold text-center text-foreground">
        {SECTION_TITLE}
      </h2>
      <div className="w-10 h-1 bg-pink-500 mx-auto mt-2 mb-8" />

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Benefits">
        {USP_CARDS.map((card) => (
          <li
            key={card.id}
            className={`relative overflow-hidden rounded-xl min-h-[280px] p-6 flex flex-col ${card.bg}`}
          >
            <img
              src={Raccoon}
              alt=""
              className="absolute top-0 right-0 w-40 h-40 object-contain"
              loading="lazy"
            />
            <div className="mt-auto flex flex-col gap-2">
              <h3 className="text-xl font-bold text-white">{card.title}</h3>
              <p className="text-sm text-white/90">{card.description}</p>
              <div className="mt-2">
                {card.cta.isExternal ? (
                  <Button asChild variant="outline" className="bg-white">
                    <a href={card.cta.href}>{card.cta.label}</a>
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="bg-white">
                    <Link to={card.cta.href as '/'}>{card.cta.label}</Link>
                  </Button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
```

- [ ] **Step 2: Run tests — confirm they pass**

```bash
pnpm test -- usp-section --run
```

Expected: 4 tests passing.

- [ ] **Step 3: Run full test suite to confirm no regressions**

```bash
pnpm test --run
```

Expected: all existing tests still pass.

- [ ] **Step 4: Commit**

```bash
git add src/pages/home/ui/usp-section.tsx src/pages/home/ui/usp-section.test.tsx
git commit -m "feat: add USPSection component with 3 benefit cards (YES-142)"
```

---

## Task 3: Wire up in home page

**Files:**
- Modify: `src/pages/home/index.tsx`

- [ ] **Step 1: Import and add `<USPSection />`**

In `src/pages/home/index.tsx`, add the import and place `<USPSection />` directly after the `<Suspense>` block wrapping `<SuperHotDeals />`:

```tsx
import { Suspense } from 'react';

import { NAV_SKELETON_KEYS } from '@shared/lib/skeleton-keys';
import { Categories } from '@shared/ui/categories';

import { SuperHotDeals } from './ui/super-hot-deals';
import { SuperHotDealsSkeleton } from './ui/super-hot-deals-skeleton';
import { USPSection } from './ui/usp-section';

export const Home = (): React.JSX.Element => {
  return (
    <div className="flex flex-1 flex-col items-center justify-between p-4">
      <div className="flex flex-col items-center gap-4 w-full">
        <h2 className="text-2xl">Shop by category</h2>
        <Suspense
          fallback={
            <div className="flex flex-wrap justify-center gap-4 w-full">
              {NAV_SKELETON_KEYS.map((key) => (
                <div
                  key={key}
                  className="h-32 w-40 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          }
        >
          <Categories />
        </Suspense>
      </div>

      <Suspense fallback={<SuperHotDealsSkeleton />}>
        <SuperHotDeals />
      </Suspense>

      <USPSection />
    </div>
  );
};
```

- [ ] **Step 2: Run smoke check**

```bash
./init.sh
```

Expected: tsc ✓, lint ✓, tests ✓.

- [ ] **Step 3: Start dev server and visually verify**

```bash
pnpm dev
```

Open `http://localhost:3000`, scroll to the USP section below Super Hot Deals. Verify:
- Heading "Shopping easy with YES CODE!" visible with pink accent line
- 3 cards visible: blue / green / purple
- Raccoon image in each card (top-right)
- Card titles and descriptions readable (white text)
- "More" and "Contact us" buttons visible
- Responsive: on narrow viewport cards stack vertically; on ≥640px (sm) they go 3-column

- [ ] **Step 4: Commit**

```bash
git add src/pages/home/index.tsx
git commit -m "feat: wire up USPSection in home page below SuperHotDeals (YES-142)"
```
