# claude-progress.md

Живой лог сессий. Обновляется в конце каждой сессии или при смене задачи.

---

## Текущий статус (2026-05-08)

**Последнее проверенное состояние:** TypeScript ✓, ESLint ✓, 56 unit tests ✓, 75 storybook tests ✓.

**Сессия 2026-05-08:** Post-review fixes для YES-136 — исправлены bg-transparent/border-0 в LogoutButton, aria-label на ProfileLink, sm:max-w-[400px] в SheetContent, w-full max-w-[300px] в Banner, stagger убран из спека, init.sh OK constant для Sonar. Supabase MCP настроен через .mcp.json. PR #209 code review (code-review skill) — 1 issue (aria-label) уже исправлен и запушен. Ветка yes-136 запушена, готова к merge.

**Следующий шаг:** Новая ветка. Приоритет: YES-139 (SuperHotDeals + BannerText refactor) → YES-137 (HeroSlider + USPSection) → YES-138 (ProductCard discount badge + size selector).

### Порядок задач на ветке yes-136

| #   | Linear                                               | Задача                                      | Статус         |
| --- | ---------------------------------------------------- | ------------------------------------------- | -------------- |
| —   | [YES-136](https://linear.app/yes-code/issue/YES-136) | Header / nav / mobile menu redesign         | ✅ done        |
| 1   | [YES-139](https://linear.app/yes-code/issue/YES-139) | Super hot deals блок + BannerText refactor  | 🔨 in progress |
| 2   | [YES-137](https://linear.app/yes-code/issue/YES-137) | HeroSlider + USPSection на home page        | pending        |
| 3   | [YES-138](https://linear.app/yes-code/issue/YES-138) | ProductCard: discount badge + size selector | pending        |

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

### 2026-05-07 — YES-136 Header Redesign (Phase 1) ✅ DONE

**Что сделано:**

- ✅ Одностроковая шапка с адаптивом на 3 брейкпоинта (h-16 | h-20 | h-25)
- ✅ Переключение логотипа (full "YES CODE" → compact "face-logo")
- ✅ AuthMenu dual-variant (текст на десктопе, иконки на мобилке <640px)
- ✅ Mobile sheet layout (категории scrollable, прomo+phone закреплены снизу)
- ✅ UX улучшения:
  - Padding между пунктами меню (py-2)
  - Бордеры только у родительских категорий
  - Расширенная область клика на стрелку (32px touch target)
  - Стрелка прибита к краю справа (justify-between)
  - Выделение активной категории (оранжевый + bold)
- ✅ Header border для визуального разделения
- ✅ Code review fixes (accessibility, FSD compliance, SVG clipPath)
  - ThemeSwitcher: `type="button"` + `aria-label`
  - SVG logos: убрана redundant `aria-hidden="false"`
  - Banner: moved to public `shared/ui/banner/`
  - SVG sprite: clipPath перемещён в outer defs

**Коммиты:**

- `b493d7e` — feat: header redesign
- `7ef1cf3` — refactor: code review fixes
- `593faae` — refactor: UX improvements
- `192bb91` — docs: mark yes-136 as done

**Верификация:** ✅ Визуальная проверка в браузере passed, lint ✓, tsc ✓, tests ✓

**Следующий приоритет:** YES-139 Super Hot Deals (зависит от YES-137 & YES-138)

---

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
