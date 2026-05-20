# claude-progress.md

Живой лог сессий. Обновляется в конце каждой сессии или при смене задачи.

---

## Текущий статус (2026-05-20)

**Последнее проверенное состояние:** TypeScript ✓, ESLint ✓, 65 unit tests ✓, 67 storybook tests ✓.

**Сессия 2026-05-20:** YES-139 завершена. Создана ветка `yes-139`, реализована секция "Super hot deals this month" с горизонтальным скроллом. Баннер в шапке теперь динамически показывает категорию с максимальным количеством активных скидок (используется `useTopDiscountedCategory` + `pickTopDiscountedRoot`). Проведён FSD-рефакторинг: каталог-логика выделена из `entities/product` в новую сущность `entities/catalog`, созданы filter features (`filter-by-color`, `filter-by-price`, `filter-by-size`, `active-filters`, `paginate`). Коммиты запушены, PR #210 создан → develop.

**Следующий шаг:** PR #210 review/merge, затем YES-137 (HeroSlider + USPSection) → YES-138 (ProductCard discount badge + size selector).

### Порядок задач

| #   | Linear                                               | Задача                                      | Статус         |
| --- | ---------------------------------------------------- | ------------------------------------------- | -------------- |
| —   | [YES-136](https://linear.app/yes-code/issue/YES-136) | Header / nav / mobile menu redesign         | ✅ done        |
| 1   | [YES-139](https://linear.app/yes-code/issue/YES-139) | Super hot deals блок + BannerText refactor  | ✅ done (PR #210) |
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

### 2026-05-20 — YES-139 Super Hot Deals + Catalog Entity Refactor ✅ DONE

**Что сделано:**

- ✅ SuperHotDeals секция на главной (horizontal scroll mobile, grid desktop)
- ✅ Динамический Banner — показывает категорию с максимальным числом скидок
- ✅ `useTopDiscountedCategory` + `pickTopDiscountedRoot` — выбор категории по количеству скидок
- ✅ Prop injection для DiscountBanner в Header и MobileMenu (без FSD-нарушений)
- ✅ FSD-рефакторинг: новая сущность `entities/catalog` с api/model/lib/ui слоями
- ✅ Новые filter features: `filter-by-color`, `filter-by-price`, `filter-by-size`, `active-filters`, `paginate`
- ✅ `CatalogCard` перемещена в `entities/catalog/ui/`
- ✅ Zod-схема для `product_discounts` (type-safe парсинг в маппере)
- ✅ `line-clamp-2` для описания товара в карточке

**Коммиты в ветке yes-139:**

1. `feat: catalog entity with api, lib, model, ui layers`
2. `feat: catalog filter features (color, price, size, active-filters, paginate)`
3. `refactor: update shared and pages for catalog entity integration`
4. `refactor: remove migrated catalog code from entities/product`
5. `style: limit product description to 2 lines with ellipsis`
6. `style: limit super hot deals section width to 1020px`
7. `style: super hot deals horizontal scroll instead of grid`
8. `feat: super hot deals switches to useTopDiscountedCategory`
9. `feat: integrate DiscountBanner into Header and MobileMenu via prop injection`

**Верификация:** ✅ tsc ✓, lint ✓, 65 unit tests ✓, 67 storybook tests ✓

**PR:** #210 → develop (awaiting review)

---

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
