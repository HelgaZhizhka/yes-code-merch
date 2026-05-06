# claude-progress.md

Живой лог сессий. Обновляется в конце каждой сессии или при смене задачи.

---

## Текущий статус (2026-05-06)

**Последнее проверенное состояние:** TypeScript ✓, ESLint ✓, 56 unit tests ✓, 75 storybook tests ✓.

**Следующий шаг:** ветка `yes-136` открыта. Начать с YES-137 (HeroSlider + USPSection) → затем YES-138 (ProductCard).

### Порядок задач на ветке yes-136

| #   | Linear                                               | Задача                                      | Статус      |
| --- | ---------------------------------------------------- | ------------------------------------------- | ----------- |
| 1   | [YES-137](https://linear.app/yes-code/issue/YES-137) | HeroSlider + USPSection на home page        | pending     |
| 2   | [YES-138](https://linear.app/yes-code/issue/YES-138) | ProductCard: discount badge + size selector | pending     |
| —   | [YES-136](https://linear.app/yes-code/issue/YES-136) | Header / nav / mobile menu redesign         | in-progress |

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
- Следующая приоритетная фича: Redesign header, navigation and home page

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
- Ветка запушена, PR #203 закрыт
