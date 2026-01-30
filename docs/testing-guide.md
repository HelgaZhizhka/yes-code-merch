# Testing Guide

## Unit Testing

- Framework: Vitest
- Coverage: components, utils, state slices

### When to Write Tests

Tests are valuable where there is business logic or validation that can silently break. The rule:

| File contains... | Write tests? |
|---|---|
| Business logic (discounts, calculations) | Yes |
| Validation (Zod schemas) | Yes |
| Field mapping (DTO → domain) | No — TypeScript catches mismatches |
| React hooks with navigation | No — use E2E instead |
| Components without logic | No — use Storybook |
| API calls | No — use E2E instead |

### Examples

**Business logic** — `calculate-discount.ts`:
- Discount selection by priority
- Percent vs fixed amount calculation
- Date-based filtering (`valid_from` / `valid_to`)
- Edge cases (`finalPrice` cannot go below 0)

```bash
pnpm vitest run src/entities/product/lib/calculate-discount.test.ts --config vitest.unit.config.ts
```

**Zod schema validation** — `catalog-search-schema.ts`:
- Default values are applied correctly
- Invalid inputs are rejected (negative page, unknown sort field)
- Optional fields behave as expected

```bash
pnpm vitest run src/entities/product/lib/catalog-search-schema.test.ts --config vitest.unit.config.ts
```

### Test File Location

Place test files next to the source file in the same directory:

```
entities/product/lib/
├── calculate-discount.ts
├── calculate-discount.test.ts      ✅
├── catalog-search-schema.ts
└── catalog-search-schema.test.ts   ✅
```

## E2E Testing

- Tool: Playwright
- Tests will run before final deployment
- Coverage: login flow, product navigation, basket logic

## Linting & Precommit

- ESLint + Prettier
- Husky pre-commit hook for lint & test check
