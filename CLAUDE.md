# CLAUDE.md

@AGENTS.md

---

## Project Info

**Name:** yes-code-merch  
**Stack:** React + TypeScript + Vite + TanStack Router + Zustand + Supabase + Tailwind CSS  
**Architecture:** Feature-Sliced Design (FSD)  
**Package Manager:** pnpm (do NOT use npm/yarn)

---

## Commands

```bash
pnpm dev              # Start dev server on port 3000
pnpm build            # Type-check and build for production
pnpm test             # Run unit tests with Vitest
pnpm test:storybook   # Run Storybook tests
pnpm lint             # Run ESLint
pnpm lint:fix         # Run ESLint with auto-fix
pnpm format           # Format code with Prettier
pnpm check            # Format + lint:fix combined
pnpm storybook        # Start Storybook on port 6006
pnpm types:db:local   # Generate Supabase types from local DB
```

Run a single test file:

```bash
pnpm vitest run path/to/file.test.ts --config vitest.unit.config.ts
```

---

## Architecture

This project uses **Feature-Sliced Design (FSD)** architecture with these layers:

```
src/
├── app/           # App initialization, routing, global styles
├── pages/         # Route entry points
├── features/      # User-facing features (e.g., add-to-cart)
├── entities/      # Domain entities with API/UI (product, address, customer)
├── layouts/       # Layout wrappers (header/footer)
└── shared/        # Reusable utilities, UI components, API clients
```

### Path Aliases

Use `@app/`, `@pages/`, `@features/`, `@entities/`, `@shared/`, `@/` for imports.

### Import Order (enforced by ESLint)

`builtin → external → @app → @pages → @widgets → @features → @entities → @shared → @/`

**For detailed FSD rules and patterns, see [`.claude/AI_FSD.md`](.claude/AI_FSD.md)**

---

## Key Patterns

### Routing (TanStack Router)

Routes are factory functions in `src/app/routing/routes.ts`.  
**Details:** [`.claude/AI_TANSTACK.md`](.claude/AI_TANSTACK.md)

### State Management (Zustand)

Global state uses `createAppStore` factory from `@shared/lib/create-app-store.ts`.  
**Details:** [`.claude/AI_ZUSTAND.md`](.claude/AI_ZUSTAND.md)

### Data Fetching (TanStack Query + Supabase)

Entity pattern for API integration:

```
entities/product/
├── api/
│   ├── hooks.ts    # React Query hooks with query keys
│   ├── types.ts    # DTO types
│   └── mapper.ts   # DTO → domain transformation
└── ui/             # ProductCard, ProductList components
```

Supabase client: `@shared/api/supabase-client/`  
Generated types: `@shared/api/database.types.ts`  
**Details:** [`.claude/AI_TANSTACK.md`](.claude/AI_TANSTACK.md)

### Forms (React Hook Form + Zod)

Validation schemas live in entity `lib/schema.ts` files. Use `@hookform/resolvers` for integration.

### UI Components

Built with Radix UI primitives and Tailwind CSS. Located in `@shared/ui/`.  
**Details:** [`.claude/AI_TAILWIND.md`](.claude/AI_TAILWIND.md)

---

## Environment Variables

Required in `.env`:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_REGION=EU
```

---

## Documentation for Claude Code

**Read these files before working on specific areas:**

- **TypeScript Guidelines**: [`.claude/AI_TYPESCRIPT.md`](.claude/AI_TYPESCRIPT.md) - Strict mode, type utilities, arrow functions
- **React Best Practices**: [`.claude/AI_REACT.md`](.claude/AI_REACT.md) - Hooks, components, performance
- **FSD Architecture Details**: [`.claude/AI_FSD.md`](.claude/AI_FSD.md) - Layer boundaries, import rules, slice structure
- **State Management (Zustand)**: [`.claude/AI_ZUSTAND.md`](.claude/AI_ZUSTAND.md) - Store patterns, selectors
- **TanStack (Router & Query)**: [`.claude/AI_TANSTACK.md`](.claude/AI_TANSTACK.md) - Routing, data fetching patterns
- **Styling (Tailwind)**: [`.claude/AI_TAILWIND.md`](.claude/AI_TAILWIND.md) - Class naming, responsive design
- **Localisation**: [`.claude/AI_LOCALE.md`](.claude/AI_LOCALE.md) - i18n patterns, locale config
- **Code Review Checklist**: [`.claude/AI_CODE_REVIEW.md`](.claude/AI_CODE_REVIEW.md) - Quality criteria
- **SSR Readiness (Future Migration)**: [`.claude/AI_SSR_READINESS.md`](.claude/AI_SSR_READINESS.md) - DO/DON'T to keep code SSR-friendly for planned TanStack Start migration

---

## Custom Shortcuts

### **GG** (Good Game / Archive Knowledge)

Run this command when you want to archive architectural decisions and update documentation.
Session continuity (progress, feature status, commit) is handled automatically via `AGENTS.md`.

**What this command does:**

1. **Update Documentation** (`docs/`):

   - Create or update the relevant `docs/` file for the feature.
   - Structure: Overview, API Methods, Usage Examples, Key Decisions, Edge Cases.
   - Key Decisions belong here — why this approach, what was rejected and why.

2. **Verify Rules Consistency**:

   - Check if any new patterns need to be reflected in `.claude/AI_*.md` files.

3. **Output Summary**:
   - Brief report listing everything updated.

### Processing the "GG" Command

When the user types "GG":

- **Step 1**: Update or create the feature doc in `docs/`. Include a **Decisions** section.
- **Step 2**: Check if `.claude/AI_*.md` files need updates.
- **Step 3**: Report what was done in a concise list.
- **DO NOT ask for permission** — just execute and report status.

---

## Response Guidelines for Claude

### Plan Mode

When planning code changes:

- Make the plan extremely concise. Sacrifice grammar for concision.
- Use lists instead of paragraphs.
- Remove unnecessary words.
- At the end, list unresolved questions if any.

### Code Mode

- Be concise - show code, don't talk about code
- Use lists instead of paragraphs
- Provide working examples, not pseudo-code
- Ask if something is unclear before proceeding

### Incremental Changes

- DON'T rewrite entire files unless absolutely necessary
- Make targeted, minimal changes
- Preserve existing code structure and style
- Comment why if significant refactoring is needed
- Show only changed parts with context (e.g., `// ... existing code ...`)

---

## What NOT to Do

❌ **TypeScript:**

- DON'T use `any` types (use `unknown` + type guards)
- DON'T ignore TypeScript errors with `@ts-ignore`
- DON'T duplicate types (use utility types: `Pick`, `Omit`, etc.)

❌ **Architecture:**

- DON'T violate FSD layer boundaries (features can't import from pages)
- DON'T create circular dependencies between layers
- DON'T put business logic in UI components

❌ **React:**

- DON'T write class components (only functional with arrow functions)
- DON'T mutate state directly (use immutable updates)
- DON'T forget `key` prop in lists
- DON'T use `index` as key for dynamic lists
- DON'T put derived state in useState (calculate during render)

❌ **General:**

- DON'T use npm or yarn (only `pnpm`)
- DON'T add new dependencies without asking first
- DON'T commit `console.log` statements
- DON'T ignore accessibility (use semantic HTML + ARIA)
- DON'T use inline styles (use Tailwind classes)

❌ **Workflow:**

- Don’t run any sub-agents without my approval
- Don't do anything extra that I didn’t ask you to

---

## Code Review Checklist (Quick)

Before suggesting code changes, verify:

- [ ] TypeScript strict mode compliance (no `any`)
- [ ] FSD layer boundaries respected
- [ ] React hooks rules followed
- [ ] Immutable state updates
- [ ] Proper error handling
- [ ] Accessibility considerations (semantic HTML, ARIA)
- [ ] Tests included (if adding/changing logic)
- [ ] No unused imports/variables
- [ ] Tailwind classes used (no inline styles)
- [ ] Import order follows ESLint config

For detailed review criteria, see [`.claude/AI_CODE_REVIEW.md`](.claude/AI_CODE_REVIEW.md).

---

## Common Patterns

For detailed code examples and implementation patterns, refer to specialized documentation:

- **Creating Features**: [`.claude/AI_FSD.md`](.claude/AI_FSD.md) - Feature structure and public API
- **Creating Entities**: [`.claude/AI_FSD.md`](.claude/AI_FSD.md) - Entity layers (api, model, ui)
- **Zustand Stores**: [`.claude/AI_ZUSTAND.md`](.claude/AI_ZUSTAND.md) - Store creation and usage
- **React Components**: [`.claude/AI_REACT.md`](.claude/AI_REACT.md) - Hooks, props, patterns
- **TanStack Query**: [`.claude/AI_TANSTACK.md`](.claude/AI_TANSTACK.md) - Query hooks and keys
- **Styling**: [`.claude/AI_TAILWIND.md`](.claude/AI_TAILWIND.md) - Tailwind patterns

---

## Questions to Ask Before Coding

When the task is unclear, ask:

1. **Scope:** Which FSD layer does this belong to? (feature/entity/shared)
2. **Dependencies:** Can I use existing entities/features, or create new ones?
3. **State:** Should this use Zustand (global) or useState (local)?
4. **API:** Does this need new API endpoints or use existing ones?
5. **Tests:** What test coverage is expected?
6. **Edge cases:** What should happen on error/loading/empty states?

---

## Project Memory Management

After completing any significant task or feature, run the `GG` command (see above).
It updates `docs/` with feature documentation including key architectural decisions.

For session continuity — tracking what's done, what's next, smoke-check on start — see `AGENTS.md`.
