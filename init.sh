#!/usr/bin/env bash
# init.sh — smoke-verification for session start
# Run this at the beginning of every coding session to verify the repo is in a clean state.
# If any step fails, fix it before starting new feature work.

set -e

OK="    OK"

echo "=== yes-code-merch: session smoke check ==="
echo ""

# 1. Check package manager
if ! command -v pnpm &>/dev/null; then
  echo "ERROR: pnpm not found. Install it: corepack enable && corepack prepare pnpm@latest --activate" >&2
  exit 1
fi

# 2. Install dependencies if needed
if [[ ! -d "node_modules" ]]; then
  echo ">>> node_modules missing — running pnpm install..."
  pnpm install --frozen-lockfile
fi

# 3. TypeScript check
echo ">>> TypeScript..."
pnpm tsc -p tsconfig.json --noEmit
echo "$OK"

# 4. Lint
echo ">>> ESLint..."
pnpm lint
echo "$OK"

# 5. Unit tests
echo ">>> Unit tests..."
pnpm vitest run --config vitest.unit.config.ts
echo "$OK"

# 6. Storybook tests
echo ">>> Storybook tests..."
pnpm test:storybook
echo "$OK"

# 7. Build check
echo ">>> Build..."
pnpm build
echo "$OK"

echo ""
echo "=== Smoke check PASSED ==="
echo ""
echo "Next step: read claude-progress.md and feature_list.json to pick your task."
