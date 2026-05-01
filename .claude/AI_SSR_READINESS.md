# SSR Readiness — Project Constraint

**Status:** Planned migration to TanStack Start (SSR) after filter feature + cart + checkout MVP are complete.
**Date added:** 2026-05-01
**Owner:** decided with Olha (project owner)

---

## What this means for current decisions

Every architectural decision in this project should be evaluated against the SSR migration. We are NOT doing SSR now, but the code we write today must NOT make the migration harder.

The migration target is **TanStack Start** (Vite-based, but with a server runtime). Until then we run pure SPA on Vite.

---

## DO

### ✅ Use `queryOptions(...)` factory for all queries

Reusable in both router `loader` and component `useQuery`/`useSuspenseQuery`.

```ts
// entities/product/api/queries.ts
export const filterOptionsQueryOptions = (categoryIds: string[]) =>
  queryOptions({
    queryKey: ['filter-options', categoryIds],
    queryFn: () => getFilterOptions(categoryIds),
    staleTime: 1000 * 60 * 60,
  });
```

### ✅ Prefer router `loader` + `ensureQueryData` for route-level data

- Good UX (no fallback flash)
- SSR-ready by design
- Use `loaderDeps` to declare dependencies on params/search

### ✅ Keep state in URL (search params)

- Filters, pagination, sorting, search — all in URL via Zod schema
- Avoid Zustand for view state that affects what's rendered

### ✅ Guard browser-only APIs

- `typeof window !== 'undefined'` before `window`/`document`/`localStorage`/`sessionStorage`
- Or extract into a hook that's safe by construction (`useLocalStorage` with SSR check)

### ✅ Pure functions in render

- No `Math.random()`, `Date.now()`, `new Date()` in render output (causes hydration mismatch)
- Use `useEffect` or stable IDs

### ✅ Supabase client should be lazy/single

- Currently `@shared/api/supabase-client` — keep it as a singleton, accessed inside functions, not at module top-level if it touches `window`

---

## DON'T

### ❌ Don't read `window`/`document`/`localStorage` at module scope

```ts
// BAD — runs at import time, breaks SSR
const theme = localStorage.getItem('theme');

// GOOD — runs in browser only
const useTheme = () => {
  const [theme, setTheme] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('theme') : null
  );
};
```

### ❌ Don't put filter/UI state in Zustand

- URL is the source of truth. Zustand is fine for cart/auth, NOT for filters/sort/pagination.

### ❌ Don't use `useEffect` to sync URL ↔ component state

- Use `useSearch` from TanStack Router directly.

### ❌ Don't depend on `process.env` directly in client code

- Use `import.meta.env.VITE_*` (Vite) — works in SSR build too.

### ❌ Don't hardcode absolute URLs

- Future SSR runtime needs config-based base URLs.

---

## Migration Day Checklist (informational, not now)

When we eventually migrate to TanStack Start:

1. Replace `createRouter` with `createTanStackStartConfig`
2. Add server entry (`app/ssr.tsx`)
3. Split Supabase client: server uses `service_role` for some ops, client uses `anon` (public read)
4. Replace any `window`-checks with proper SSR guards
5. Add `dehydrate`/`hydrate` for React Query state
6. Update auth flow to use `createServerFn` for sensitive ops
7. Update deploy target (Vercel Edge / Node)

If we follow the DO/DON'T list above today, the migration becomes a **mechanical refactor**, not a rewrite.

---

## When to update this file

- After SSR migration is complete: replace this file with a "post-migration notes" doc.
- If a new framework constraint emerges (e.g., RSC, Suspense streaming): add a section.
- If a DO/DON'T turns out wrong in practice: update with the lesson learned.
