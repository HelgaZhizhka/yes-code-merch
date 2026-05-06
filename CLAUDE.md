# CLAUDE.md

**Start here:** [.claude/AI_QUICKSTART.md](.claude/AI_QUICKSTART.md) ← read first (2 min)

---

## ⛔ Hard Constraints (NEVER violate these)

1. ❌ Use `any` types (use `unknown` + type guards)
2. ❌ Use npm or yarn (only `pnpm`)
3. ❌ Violate FSD layer boundaries (features can't import from pages)
4. ❌ Use `@ts-ignore`, `console.log` in commits
5. ❌ Write class components (only arrow function components)
6. ❌ Mutate state directly (always immutable updates)
7. ❌ Use `index` as key in dynamic lists
8. ❌ Inline styles (use Tailwind)
9. ❌ Force push to main
10. ❌ Run sub-agents without approval
11. ❌ Add dependencies without asking
12. ❌ Do extra work beyond the ask
13. ❌ Commit code with security holes
14. ❌ Create circular dependencies between layers
15. ❌ Use `eval`, ignore accessibility

**Why:** Previous incidents, compliance, maintainability, performance, security.

---

## Project Overview

**yes-code-merch** — React + TypeScript + Vite + TanStack Router + Zustand + Supabase + Tailwind  
**Architecture:** Feature-Sliced Design (FSD)  
**Package Manager:** pnpm only

---

## Quick Commands

```bash
pnpm dev              # Dev server (port 3000)
pnpm build            # Type-check + build
pnpm test             # Unit tests
pnpm lint:fix         # Fix linting + format
./init.sh             # Smoke-check (run at session start)
```

---

## Where to Find Everything

### Session Start

1. **[claude-progress.md](claude-progress.md)** — What was done, where we are, next step
2. **[AGENTS.md](AGENTS.md)** — Continuity rules for agents (read this for session workflow)
3. **[feature_list.json](feature_list.json)** — Feature status (done/in-progress/pending)
4. Run `./init.sh` — Smoke-check (tsc + lint + tests)

### Code Rules & Patterns

| Topic                         | Document                                                   | When to read                   |
| ----------------------------- | ---------------------------------------------------------- | ------------------------------ |
| FSD architecture              | [.claude/AI_FSD.md](.claude/AI_FSD.md)                     | Layer boundaries, imports      |
| TanStack Router / React Query | [.claude/AI_TANSTACK.md](.claude/AI_TANSTACK.md)           | Routing, data fetching         |
| Zustand state management      | [.claude/AI_ZUSTAND.md](.claude/AI_ZUSTAND.md)             | Global state, selectors        |
| TypeScript rules              | [.claude/AI_TYPESCRIPT.md](.claude/AI_TYPESCRIPT.md)       | Strict mode, no `any`          |
| React best practices          | [.claude/AI_REACT.md](.claude/AI_REACT.md)                 | Hooks, components, performance |
| Tailwind + styling            | [.claude/AI_TAILWIND.md](.claude/AI_TAILWIND.md)           | Class naming, responsive       |
| Testing                       | [.claude/TESTING_GUIDE.md](.claude/TESTING_GUIDE.md)       | Unit + E2E strategies          |
| Localization                  | [.claude/AI_LOCALE.md](.claude/AI_LOCALE.md)               | i18n patterns                  |
| Code review checklist         | [.claude/AI_CODE_REVIEW.md](.claude/AI_CODE_REVIEW.md)     | Quality gates                  |
| SSR readiness                 | [.claude/AI_SSR_READINESS.md](.claude/AI_SSR_READINESS.md) | TanStack Start migration prep  |
| Common patterns               | [.claude/AI_PATTERNS.md](.claude/AI_PATTERNS.md)           | Recipes, copy-paste examples   |

---

## Required Environment Variables

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_REGION=EU
```

Optional: See [.claude/SETUP_OPTIONAL.md](.claude/SETUP_OPTIONAL.md) for Supabase MCP configuration.

---

## Session End Checklist

Before leaving:

1. Update `claude-progress.md` (what was done, next step)
2. Update `feature_list.json` (mark feature as done if Definition of Done met)
3. Commit to git (safe state)
4. Leave repo clean enough for `./init.sh` to pass

If interrupted mid-feature: fill `session-handoff.md`.  
If feature is done: clear `session-handoff.md`.

---

## Definition of Done

Feature is `done` only when **all** true:

- ✅ Target behavior implemented
- ✅ Verification actually run (lint + tsc + tests)
- ✅ Evidence in `feature_list.json` or `claude-progress.md`
- ✅ `./init.sh` passes

---

**Questions?** See [.claude/AI_QUICKSTART.md](.claude/AI_QUICKSTART.md) or the topic-specific docs above.
