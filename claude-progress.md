# claude-progress.md

Живой лог сессий. Обновляется в конце каждой сессии или при смене задачи.

---

## Текущий статус (2026-05-04)

**Последнее проверенное состояние:** TypeScript ✓, ESLint ✓, 56 unit tests ✓, 75 storybook tests ✓.

**Следующий шаг:** Смержить PR #203 → начать `cart` feature на новой ветке от `develop`.

**Активная ветка:** `yes-100` запушена, PR #203 открыт → develop. Готов к мержу.

---

## Как начать новую сессию

1. `pwd` — убедиться что ты в `/Users/mac/Projects/yes-code-merch`
2. Прочитать этот файл (`claude-progress.md`)
3. Прочитать `feature_list.json` — выбрать незавершённую фичу с наивысшим приоритетом
4. `git log --oneline -5` — последние коммиты
5. `./init.sh` — smoke-проверка (lint + tsc + tests)
6. Если базовая верификация падает — **сначала чинить её**, не начинать новую фичу

---

## Лог сессий

### 2026-05-03 — Настройка системы continuity (walkinglabs шаблон)

**Что сделано:**

- Создан `feature_list.json` — источник истины о статусе фич
- Создан `claude-progress.md` (этот файл) — живой лог сессий
- Создан `init.sh` — smoke-проверка при старте сессии
- Обновлён `AGENTS.md` — добавлен стартовый воркфлоу

**Текущее состояние проекта:**

- 4 фичи завершены: product-search-pagination, discount-calculation, unit-tests, product-filters
- Следующая приоритетная фича: Shopping Cart

**Нерешённые вопросы:**

- Нет явной договорённости о стеке для Cart (Zustand + localStorage vs Supabase RLS orders table)
- Перед стартом Cart нужно решить: сохранять корзину в Supabase или только локально

---

### 2026-05-03 — Code review + polish yes-100

**Что сделано:**

- Code review ветки yes-100 (8 issues исправлено)
- Fix: `useCatalogSearch` unsafe cast → `catalogSearchSchema.parse()`
- Fix: `FilterSection` `aria-controls` → `hidden` вместо unmount
- Fix: `CatalogFiltersSheet` Suspense boundary для `useSuspenseQuery`
- Fix: дублирование `FilterTag`/`ActiveTag` → единый экспорт из entity
- Fix: `type="button"` на expand кнопку в `CategoriesTree`
- Fix: `useFilterOptions` возвращает полный query object
- Fix: `resetFilters` не сбрасывает search-запрос
- Fix: `ContentSkeleton` теперь реально рендерится (useQuery + placeholderData)
- Убраны категории из мобильного sheet
- Убран лишний `div` вокруг сайдбара
- `withRouter` декоратор для Storybook stories с TanStack Router хуками
- Supabase PAT удалён из git-истории через `git filter-repo`
- Ветка запушена, PR #203 открыт

**Статус на конец сессии:** PR открыт, все тесты зелёные, репо чистое.

**Нерешённые вопросы/блокеры:**

- Supabase PAT нужно ротировать в Supabase Dashboard
- Нет договорённости о стеке для Cart (Zustand + localStorage vs Supabase)

---

### 2026-05-04 — Code review polish + CI setup

**Что сделано:**

- Запущен `superpowers:requesting-code-review` → исправлено ещё несколько issues
- Fix: `Slider.Thumb` — добавлены `aria-label` Min/Max
- Fix: `categories-tree` — `aria-label` стал динамическим, добавлен `aria-expanded`
- Fix: `queries.ts` — удалён дублирующий `placeholderData` (мёртвый код)
- Fix: `decorators.tsx` — убран лишний тип `React.FC`
- Fix: `AI_ZUSTAND.md` — удалён stray heading и внешний code fence
- Создан и затем удалён GitHub Actions Claude PR review (заменён на `/code-review` skill)
- Telegram workflow временно отключён (`if: false`)
- Изучены и сравнены 3 подхода к ревью: GitHub Actions / `fsd-code-reviewer` / `/code-review:code-review`
- `/code-review:code-review` оставил комментарий в PR #203 (1 issue — `withRouter` singleton, решено не исправлять)

**Статус на конец сессии:**

- Все тесты зелёные: TypeScript ✓, ESLint ✓, 56 unit tests ✓, 75 storybook tests ✓
- PR #203 открыт, готов к мержу
- Ветка `yes-100` чистая

**Нерешённые вопросы/блокеры:**

- `withRouter` в `.storybook/decorators.tsx` создаёт роутер на каждый рендер — решено оставить как есть (Storybook only, тесты проходят)
- Supabase PAT нужно ротировать в Supabase Dashboard (если ещё не сделано)
- Нет договорённости о стеке для Cart (Zustand + localStorage vs Supabase)

**Следующий шаг:** Смержить PR #203 → начать `cart` feature на новой ветке.
