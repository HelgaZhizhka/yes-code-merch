# Header redesign — yes-136 (Phase 1)

## Контекст

Текущий `Header` (`src/shared/ui/header/index.tsx`) — двухстрочный:

1. Верхняя строка: логотип (большой, h-24 w-40), баннер-промо, телефон, AuthMenu, корзина
2. Нижняя строка `bg-dark-background` (h-17): мобильное меню (sm:hidden) ИЛИ горизонтальный список категорий, ThemeSwitcher

Цель: убрать тёмную нижнюю строку с категориями полностью, всё схлопнуть в одну верхнюю строку, уменьшить высоту шапки до ~100px, ввести три breakpoint-этапа адаптива.

## Что меняем

### Структура (десктоп ≥1120)

Одна строка, высота ~100px, элементы в порядке слева-направо:

- логотип (уменьшенный по высоте)
- промо-текст (Banner)
- телефон (ContactWidget)
- AuthMenu (Sign in / Sign up или Profile / Logout)
- Cart (иконка корзины)
- ThemeSwitcher (последним в ряду)

### Адаптив

- **<1120**: логотип меняется на компактный `face_logo.svg`.
  - В тёмной теме: чёрные пути (`#0B0A0A`) должны становиться белыми.
- **<1020 (мобильный вид шапки)**:
  - В шапке остаётся: `бургер | логотип | AuthMenu | Cart | ThemeSwitcher`
  - Промо-баннер и телефон скрываются из шапки и уезжают в mobile sheet
  - Mobile sheet содержит: список категорий, промо-баннер, телефон
  - AuthMenu тут всё ещё текстовый (Sign in / Sign up как кнопки)
- **<640**: AuthMenu → иконки (Sign in → иконка входа, Sign up → иконка добавления пользователя; для авторизованного — Profile/Logout уже и так иконочные).
  - При визуальной проверке возможно потребуется поднять брейкпоинт выше (если перестаёт влезать) — финальное значение определим в ходе реализации.

### Удаляется

- `bg-dark-background` нижняя полоса целиком
- Горизонтальный список категорий (`<Categories />` в шапке)

## Решения

1. ✅ Корзина — оставляем в шапке, между AuthMenu и ThemeSwitcher
2. ✅ Категории — на десктопе только через секцию "Shop by category" на главной + футер. На <1020 категории доступны внутри mobile sheet (как сейчас). Доступ к категориям внутри страницы каталога — отдельной задачей.
3. ✅ На <1020 в шапке: `бургер | логотип | AuthMenu | Cart | ThemeSwitcher`. Промо и телефон уезжают в mobile sheet.
4. ✅ AuthMenu → иконки от <640 (брейкпоинт можно поднять выше, если визуально не влезает).
5. ✅ Логотип `face_logo` интегрируется как `<symbol id="face-logo">` в существующий `header-logo-sprite.svg`. Чёрные пути → `fill="currentColor"`, оранжевые остаются `#FF9843`. Цвет темы через `text-foreground`.

## Mobile menu — анимация и layout

### Слайд-анимация открытия sheet

- Sheet уже имеет анимацию через классы `data-[state=open]:slide-in-from-left` и подобные (от `tailwindcss-animate`).
- ✅ **Решение: вариант A** — заменить `tailwindcss-animate` на `tw-animate-css`:
  - `pnpm remove tailwindcss-animate && pnpm add tw-animate-css`
  - Добавить `@import 'tw-animate-css';` в `src/app/styles/index.css` сразу после `@import 'tailwindcss';`
  - Существующие `animate-in / slide-in-from-* / fade-in-*` классы в `sheet.tsx` начинают работать.

### Поэтапное появление пунктов меню (stagger)

- Каждый пункт списка категорий появляется с задержкой относительно предыдущего.
- keyframe `menu-item-fade-in` (translateY + opacity) в `src/app/styles/index.css` + утилитный класс `.animate-menu-item` с `animation-delay` через inline-стиль по индексу:
  ```tsx
  <li
    style={{ animationDelay: `${index * 60}ms` }}
    className="animate-menu-item"
  >
    ...
  </li>
  ```
- Длительность одного шага ~300ms, шаг между пунктами ~60–80ms (точное значение визуально).
- Анимация запускается только при открытии sheet.

### Layout sheet — промо + телефон прибиты к низу

- Текущий `MobileMenu`: список категорий → телефон → промо-баннер (вертикально, `flex flex-col gap-4`).
- Новый layout: контейнер `flex flex-col h-full`:
  - Сверху: список категорий (`flex-1 overflow-y-auto`)
  - Снизу: телефон + промо-баннер (`mt-auto`, между ними `gap`)

## YES-139 (Super hot deals) — расширить скоуп

В рамках задачи YES-139 (карточки товаров со скидкой на главной) дополнительно: **рефакторинг `src/shared/ui/header/banner.tsx` (BannerText)**.

- Что не так: `BannerText` имеет хардкод-`switch (category)` на строки `'DrinkWare'` / `'T-Shirts'`, неудобно расширять.
- Цель: убрать switch, описать варианты текста баннера через словарь/конфиг (по category), либо принимать готовый текст пропсом.
- Точные критерии и подход обсудим в момент реализации YES-139.
- Это нужно отразить в описании Linear-тикета YES-139.

## Иконки для AuthMenu (<640)

- `Sign in` → `LogIn` из `lucide-react`
- `Sign up` → `UserPlus` из `lucide-react`
- (для авторизованного состояния `Profile` / `Logout` уже иконочные)

## Высота шапки

- Десктоп ≥1120: высота ~100px (`h-25`), логотип `h-12 w-20`
- 1120 > w ≥ 1020: высота ~80px, `face-logo` (`h-12 w-14`)
- <1020: высота ~64px, `face-logo` (`h-10 w-12`)
- Точные значения визуально в ходе реализации.

## Затрагиваемые файлы

- `src/shared/ui/header/index.tsx` — основной рефакторинг: одна строка, новые брейкпоинты, переключение логотипа, удаление нижней `bg-dark-background` секции
- `src/shared/ui/auth-menu/auth-links.tsx` — добавить иконочный вариант (от <640) через Tailwind responsive classes
- `src/shared/assets/header-logo-sprite.svg` — добавить `<symbol id="face-logo">` (чёрные пути → `currentColor`, оранжевые `#FF9843`)
- `src/shared/ui/mobile-menu/index.tsx` — обновить layout: категории `flex-1` сверху, промо + телефон `mt-auto` снизу. Подключить stagger-анимацию к пунктам.
- `src/shared/ui/categories-tree.tsx` (или соседний файл, где рендерятся пункты) — добавить класс `animate-menu-item` + inline `animationDelay` по индексу (только для `variant="mobile"`).
- `src/app/styles/index.css` — keyframe `menu-item-fade-in` + утилитный класс `.animate-menu-item`. Подключить плагин для slide-in анимаций sheet (см. секцию выше).
- `src/shared/ui/header/banner.tsx` — без изменений в этой ветке (рефактор переедет в YES-139)
- `src/layouts/index.tsx` — без изменений

## Verification

1. `pnpm dev` → визуальный обход на брейкпоинтах: ≥1120, 1100, 1020, 900, 640, 400
2. Light/dark переключение на каждом брейкпоинте — face-logo меняет цвет чёрных путей на белые
3. Mobile sheet (<1020): открытие плавно слева, пункты категорий появляются каскадом, промо-баннер и телефон закреплены внизу
4. Категорий нет в шапке на десктопе ≥1020
5. AuthMenu корректно переключается между текстом и иконками на <640
6. `pnpm build` — type-check проходит
7. `pnpm lint` — без ошибок
8. `pnpm test` — существующие тесты проходят
9. `./init.sh` зелёный

## Follow-up действия (выполнены вне этой ветки)

- ✅ Создана Linear-задача [YES-139](https://linear.app/yes-code/issue/YES-139/home-page-super-hot-deals-this-month-product-cards-block) — Super hot deals блок на главной.
- ✅ Добавлена запись `home-super-hot-deals` в `feature_list.json`.
- ⏳ Обновить описание YES-139, добавив пункт про BannerText refactor (после ответа пользователя по варианту анимаций).
