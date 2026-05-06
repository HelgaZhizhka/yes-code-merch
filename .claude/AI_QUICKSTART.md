---
name: Быстрый старт для агентов
description: Обязательно прочитать перед любой работой — 2 минуты на понимание проекта
type: user
---

# Быстрый старт

**Проект:** yes-code-merch — React + TypeScript + Vite + TanStack Router + Zustand + Supabase + Tailwind  
**Архитектура:** Feature-Sliced Design (FSD)  
**Пакетный менеджер:** pnpm (ТОЛЬКО pnpm, не npm/yarn)

## За 30 секунд

```
src/
├── app/       # Инициализация, роутинг, глобальные стили
├── pages/     # Entry points маршрутов  
├── features/  # User-facing фичи (cart, filters, etc)
├── entities/  # Доменные сущности (product, user, etc) 
├── shared/    # Utils, UI компоненты, API клиенты
└── layouts/   # Макеты (header, footer)
```

## Команды (copy-paste)

```bash
pnpm dev              # Стартуй локально (порт 3000)
pnpm build            # Тип-чек + build
pnpm test             # Unit тесты (Vitest)
pnpm lint:fix         # Авто-fix линтер + prettier
./init.sh             # Smoke-check (запускай В НАЧАЛЕ сессии)
```

## Ключевые паттерны

| Что | Где | Документ |
|-----|-----|----------|
| **FSD классификация** | Какой слой куда | [AI_FSD.md](AI_FSD.md) |
| **Роутинг** | TanStack Router factory | [AI_TANSTACK.md](AI_TANSTACK.md) |
| **State** | Zustand + selectors | [AI_ZUSTAND.md](AI_ZUSTAND.md) |
| **Data fetch** | React Query + Supabase | [AI_TANSTACK.md](AI_TANSTACK.md) |
| **UI** | Radix + Tailwind | [AI_TAILWIND.md](AI_TAILWIND.md) |
| **TypeScript** | Strict mode rules | [AI_TYPESCRIPT.md](AI_TYPESCRIPT.md) |
| **Тестирование** | Unit + E2E | [TESTING_GUIDE.md](TESTING_GUIDE.md) |

## Hard constraints (⛔ никогда)

- ❌ `any`, npm/yarn, class components, inline styles
- ❌ Нарушение FSD границ (features не может импортировать из pages)
- ❌ Мутирование стейта, `index` как key в списках
- ❌ `@ts-ignore`, console.log в коммитах, динамические импорты в forms

## Session Start (3 шага)

1. Запусти `./init.sh` — smoke-check (TypeScript + lint + tests)
2. Прочитай `claude-progress.md` — где проект, что дальше
3. Запусти `git log --oneline -5` — последние коммиты

**Если smoke check валится — чини ЭТО первым.**

## Где найти

- **Маршрут + расписание:** [CLAUDE.md](../CLAUDE.md)
- **Continuity:** [AGENTS.md](../AGENTS.md), `claude-progress.md`
- **Фичи + статус:** `feature_list.json`
- **Конфиг:** `.mcp.json.example` → `.mcp.json` (Supabase)
