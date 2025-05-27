# Testing Guide

## Unit Testing

- Framework: Vitest
- Coverage: components, utils, state slices

## E2E Testing

- Tool: Playwright
- Tests will run before final deployment
- Coverage: login flow, product navigation, basket logic

## Linting & Precommit

- ESLint + Prettier
- Husky pre-commit hook for lint & test check
