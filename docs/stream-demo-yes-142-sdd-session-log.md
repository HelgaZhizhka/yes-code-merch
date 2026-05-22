# Лог сессии YES-142: USP Section — Демо SDD + Superpowers

**Дата:** 2026-05-22  
**Ветка:** `yes-142`  
**Тикет:** YES-142 — Implement Home Page USP Section  
**Цель документа:** Показать на реальном примере, как работает harness + superpowers skills + Subagent-Driven Development (SDD) на проекте

---

## Контекст: Что такое Superpowers и SDD

**Superpowers** — система навыков (skills) для Claude Code. Скилы — это markdown-файлы с инструкциями, которые загружаются через `Skill` tool и диктуют агенту точный workflow вместо угадывания.

**SDD (Subagent-Driven Development)** — паттерн разработки, при котором каждая задача проходит через трёх независимых агентов:
1. **Implementer** — пишет код
2. **Spec Compliance Reviewer** — проверяет, что реализовано именно то, что было запрошено (не больше, не меньше)
3. **Code Quality Reviewer** — проверяет качество: типобезопасность, архитектура, тесты, accessibility

Ключевой принцип: **каждый агент работает независимо, без знания о предыдущих шагах**. Рецензент-2 не знает, что рецензент-1 уже проверил.

---

## Pipeline сессии — шаг за шагом

### Шаг 1 — Стартовые ритуалы (session hygiene)

Перед любым кодом агент выполняет стартовый чеклист из `AGENTS.md`:

```
claude-progress.md   → что было сделано, следующий шаг
feature_list.json    → приоритеты фич
git log --oneline    → последние коммиты
./init.sh            → smoke-check: tsc + lint + tests
```

**Зачем это нужно:** агент начинает каждую сессию "холодным" — без памяти о прошлых сессиях. Без этих файлов он не знает ни состояния проекта, ни следующего шага. `claude-progress.md` — это "рабочая память" между сессиями.

**Что нашли:** YES-137 был разбит на YES-142 (USPSection, текущий) и YES-141 (HeroSlider, следующий). Обновили `feature_list.json` и `claude-progress.md`.

---

### Шаг 2 — Skill: `superpowers:brainstorming`

**Вызов:**
```
Skill("superpowers:brainstorming")
```

**Зачем:** Перед имплементацией — анализ требований. Скил заставляет агента задать правильные вопросы, прежде чем писать код.

**Что анализировали:**
- Скриншот макета из Figma: заголовок "Shopping easy with YES CODE!", 3 карточки (синяя/зелёная/фиолетовая), raccoon-иллюстрации, описания и CTA-кнопки
- Определили тексты карточек прямо из макета
- Определили место в DOM: после `<SuperHotDeals />`, до секции каталога
- Определили FSD-слой: `pages/home/ui/` (компонент страницы, не переиспользуемая сущность)

**Ключевые решения на этом этапе:**
- Компонент полностью статический → нет Suspense, нет async
- CTA: внутренние ссылки через TanStack `<Link>`, внешние (tel:) через `<a>`
- Raccoon.svg как заглушка для всех трёх карточек (финальные иллюстрации пользователь добавит позже)
- i18n не нужен (текущее состояние проекта)

---

### Шаг 3 — Skill: `superpowers:writing-plans`

**Вызов:**
```
Skill("superpowers:writing-plans")
```

**Зачем:** Скил генерирует два артефакта:
1. **Design spec** — `docs/superpowers/specs/2026-05-21-usp-section-design.md` — что именно должно быть реализовано (типы, layout, ограничения)
2. **Implementation plan** — `docs/superpowers/plans/2026-05-21-usp-section.md` — как реализовывать (три задачи с полным кодом)

**Три задачи в плане:**

| # | Задача | Файл |
|---|--------|------|
| 1 | USPSection компонент | `src/pages/home/ui/usp-section.tsx` |
| 2 | Тесты | `src/pages/home/ui/usp-section.test.tsx` |
| 3 | Wire-up в home page | `src/pages/home/index.tsx` |

**Почему план важен:**
- Он фиксирует ожидания до написания кода
- Рецензенты проверяют реализацию против плана, а не "своего ощущения правильности"
- Следующая сессия может подхватить работу с любого места

---

### Шаг 4 — Skill: `superpowers:subagent-driven-development`

**Вызов:**
```
Skill("superpowers:subagent-driven-development")
```

Пользователь выбрал режим **"Subagent-Driven"** (в отличие от "Manual" где агент пишет всё сам).

**Что происходит для каждой задачи:**

```
Task N → [Implementer] → [Spec Compliance Reviewer] → [Code Quality Reviewer] → Next Task
```

---

#### Задача 1: USPSection компонент

**Implementer subagent** создал `src/pages/home/ui/usp-section.tsx`:
- `UspCard` type
- `USP_CARDS` массив с данными трёх карточек
- `USPSection` компонент: `<section>`, `<h2>`, `<ul>` с тремя `<li>`
- `<Button asChild>` + `<Link>` / `<a>` для CTA

**Spec Compliance Reviewer** проверил код против spec:
- ✅ Три карточки с правильными цветами (blue-600 / green-700 / purple-600)
- ✅ Raccoon.svg с `alt=""` (декоративный, правильно скрыт от screen readers)
- ✅ CTA: tel: ссылка через `<a>`, внутренние через `<Link>`
- ✅ FSD: только `pages/home/ui/` слой, нет cross-layer импортов

**Code Quality Reviewer** нашёл проблемы:

> ⚠️ **Important:** `<Link to={card.cta.href as '/'}>` — небезопасный type cast
> - Файл: `usp-section.tsx`
> - Проблема: `as '/'` заглушает TanStack Router type-checker. Если href не является валидным роутом — TypeScript не предупредит
> - Фикс: использовать `ROUTES.HOME` из `@shared/config/routes`

> ⚠️ **Important:** `<section aria-label="Shopping easy with YES CODE!">` дублирует `<h2>`
> - Проблема: screen reader объявит заголовок дважды
> - Фикс: `aria-labelledby="usp-section-heading"` + `id="usp-section-heading"` на `<h2>`

> ⚠️ **Important:** Обе кнопки "More" имеют одинаковый accessible name
> - Проблема: пользователь screen reader слышит "More, More, Contact us" без контекста
> - Фикс: `ariaLabel` поле в `UspCard.cta` с уникальными метками

**Применили фиксы** → два коммита:
```
18aa6a8 fix: use ROUTES.HOME instead of type cast on Link to (YES-142)
e6e7479 fix: accessibility improvements — aria-labelledby and distinct CTA labels (YES-142)
```

---

#### Задача 2: Тесты

**Implementer subagent** создал `src/pages/home/ui/usp-section.test.tsx` с 4 тестами:
- renders section heading
- renders all three card titles
- renders CTA buttons
- renders raccoon images

**Spec Compliance Reviewer:** ✅ все 4 теста присутствуют, покрывают основные требования

**Code Quality Reviewer** нашёл критическую проблему:

> ❌ **Critical:** `React.ReactElement` используется без импорта React
> - Файл: `usp-section.test.tsx`
> - Проблема: TypeScript ошибка при сборке
> - Фикс: `import type { ReactElement } from 'react'`

> ❌ **Critical:** Тесты падают с пустым DOM
> - Проблема: TanStack Router `RouterProvider` рендерится **асинхронно** в jsdom. Синхронный `getByRole` видит пустой DOM на первом тике
> - Фикс: заменить все `getBy*` на `await findBy*` или `await waitFor(() => getBy*)`

**Применили фиксы** — все 69 тестов проходят ✅

---

#### Задача 3: Wire-up в home page

**Implementer subagent** добавил в `src/pages/home/index.tsx`:
```tsx
import { USPSection } from './ui/usp-section';

// После SuperHotDeals Suspense block:
<Suspense fallback={<SuperHotDealsSkeleton />}>
  <SuperHotDeals />
</Suspense>

<USPSection />
```

**Spec Compliance Reviewer:** ✅ размещение верное, нет лишних изменений

**Code Quality Reviewer:** ✅ нет замечаний — минимальный, чистый wire-up

---

### Шаг 5 — Verification

После всех задач — финальная проверка:

```bash
pnpm tsc    → ✅ 0 errors
pnpm lint   → ✅ 0 warnings  
pnpm test   → ✅ 69/69 tests passing
```

---

### Шаг 6 — Skill: `superpowers:finishing-a-development-branch`

**Вызов:**
```
Skill("superpowers:finishing-a-development-branch")
```

**Зачем:** Скил завершает сессию по чеклисту:
1. Обновить `claude-progress.md` (что сделано, следующий шаг)
2. Обновить `feature_list.json` (YES-142 → done)
3. Предложить варианты: merge / PR / keep / discard

---

## Итог: Что поймали рецензенты vs что пропустил бы один агент

| Проблема | Кто нашёл | Серьёзность |
|----------|-----------|-------------|
| `as '/'` type cast заглушает роутер | Code Quality Reviewer | ⚠️ Important |
| `aria-label` дублирует `<h2>` | Code Quality Reviewer | ⚠️ Important |
| Одинаковые CTA accessible names | Code Quality Reviewer | ⚠️ Important |
| `React.ReactElement` без импорта | Code Quality Reviewer | ❌ Critical |
| TanStack async rendering в тестах | Code Quality Reviewer | ❌ Critical |

**5 реальных проблем** — от падения тестов до accessibility нарушений — были пойманы **не автором кода**, а независимыми рецензентами.

---

## Структура коммитов

```
a8159f9  docs: add YES-142 USP section implementation plan
2dc3e9c  feat: add USPSection component with 3 benefit cards (YES-142)
18aa6a8  fix: use ROUTES.HOME instead of type cast on Link to (YES-142)
3aed873  feat: wire up USPSection in home page below SuperHotDeals (YES-142)
e6e7479  fix: accessibility improvements — aria-labelledby and distinct CTA labels (YES-142)
```

---

## Ключевые выгоды SDD на этом проекте

### 1. Независимость рецензентов — реальная защита
Spec Reviewer не знает о Code Quality Reviewer. Code Quality Reviewer не знает о реализации до чтения кода. Это устраняет confirmation bias — агент не "соглашается" с собой.

### 2. Plan-as-contract
`docs/superpowers/plans/` — контракт между сессиями. Любой следующий агент (или сессия после context compaction) знает, что было спланировано, что реализовано, и может продолжить без потери контекста.

### 3. Session hygiene автоматизирует continuity
`claude-progress.md` + `feature_list.json` решают проблему "холодного старта" агента. Без этого каждая сессия начиналась бы с exploration кодовой базы вместо немедленной работы.

### 4. Harness = предсказуемое поведение
`CLAUDE.md` задаёт hard constraints (no `any`, только pnpm, FSD boundaries, no `console.log` в коммитах). Агент проверяет код против этих правил — не полагается на "я помню что нельзя делать".

### 5. Масштабируемость на сложных фичах
Для этой фичи: 3 задачи × 3 агента = 9 "рабочих сессий". Для YES-139 (Super Hot Deals + catalog entity refactor) было ~15 задач. SDD держит качество линейным, а не деградирующим по мере роста сложности.

---

## Файлы созданные в сессии

```
src/pages/home/ui/usp-section.tsx          ← компонент
src/pages/home/ui/usp-section.test.tsx     ← тесты
src/pages/home/index.tsx                   ← wire-up (изменён)
docs/superpowers/specs/2026-05-21-usp-section-design.md   ← design spec
docs/superpowers/plans/2026-05-21-usp-section.md          ← implementation plan
```

---

## Используемые скилы

| Скил | Когда | Зачем |
|------|-------|-------|
| `superpowers:brainstorming` | Начало фичи | Анализ требований, определение скоупа |
| `superpowers:writing-plans` | После brainstorming | Генерация spec + implementation plan |
| `superpowers:subagent-driven-development` | После плана | Реализация через 3-агентный pipeline |
| `superpowers:finishing-a-development-branch` | После реализации | Session end checklist, branch disposition |
