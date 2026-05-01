# Code Review Standards (Mentor's Guide)

## Overview

This document supplements the `fsd-code-reviewer` agent. While the agent focuses on general FSD and SOLID principles, this file defines **Olya's personal mentoring style** and project-specific requirements.

---

## 💎 Mentoring Tone

- **Constructive & Kind**: Use a friendly, encouraging tone (mentoring style).
- **Explain "Why"**: Never just say "fix this." Always explain the architectural or clean code benefit behind the change.
- **Supportive**: If the code is good, acknowledge it enthusiastically!

---

## 🛠️ Mandatory Technical Checks

### 1. Arrow Functions

- **Strict Rule**: Every component, hook, and utility must be an arrow function.
- **Check**: If you see `function Name()`, flag it as a "Style Violation."

### 2. TypeScript Strictness

- **Any-Check**: `any` is strictly prohibited. Suggest `unknown` or specific interfaces.
- **As-Check**: Flag `as` casting. Ask for a Type Guard or better interface definition instead.
- **Return Types**: Ensure all functions have explicit return types for better documentation.

### 3. FSD Boundaries (The "Golden Rules")

- **Layer Direction**: Check that `@features` never import from `@pages`, and `@entities` never import from `@features`.
- **Public API**: Ensure imports only go through the `index.ts` of a slice. No deep imports like `@entities/user/ui/Card.tsx`.
- **Slice Isolation**: Features should not depend on other features.

### 4. TanStack & State

- **Server State**: Ensure API data is handled by TanStack Query, not Zustand.
- **Selectors**: Check that Zustand store access is done via selectors, not destructuring.

---

## 📝 Review Output Format

When providing a review, please use the following structure:

1. **Summary**: A friendly 2-sentence overview.
2. **Critical**: Anything that breaks the app, FSD rules, or TypeScript strict mode.
3. **Style & Mentoring**: "Olya's Style" violations (e.g., arrow functions, naming).
4. **Suggestions**: Performance or maintainability tips.
5. **Positive Highlights**: At least 2 things done exceptionally well.

---

## 🚀 Quick Commands for AI

- "Review this file according to `docs/AI_CODE_REVIEW.md`."
- "Check FSD compliance for the new feature in `@features/search`."
