# Harness + SDD + Superpowers — обзор системы

**Проект:** yes-code-merch  
**Цель документа:** Обзор для стрима — как устроен harness и как работает SDD + Superpowers

---

## Часть 1 — Harness

Harness — это набор файлов-инструкций, которые превращают агента из "угадывателя" в предсказуемого исполнителя. Агент начинает каждую сессию холодным (без памяти о прошлых сессиях), harness даёт ему всё необходимое для немедленной работы.

### Структура harness

```
yes-code-merch/
├── CLAUDE.md                  ← entrypoint для Claude Code
├── AGENTS.md                  ← session workflow (работает в любом агенте)
├── claude-progress.md         ← живой лог: что сделано, следующий шаг
├── feature_list.json          ← статус всех фич (done/in-progress/pending)
├── session-handoff.md         ← заполняется при прерванной сессии
├── init.sh                    ← smoke-check: tsc + lint + tests
└── .claude/
    ├── AI_QUICKSTART.md       ← 2-минутный онбординг для агента
    ├── AI_FSD.md              ← правила FSD архитектуры
    ├── AI_TANSTACK.md         ← роутинг и data fetching
    ├── AI_ZUSTAND.md          ← глобальный стейт
    ├── AI_TYPESCRIPT.md       ← strict mode правила
    ├── AI_REACT.md            ← компоненты и хуки
    ├── AI_TAILWIND.md         ← стилизация
    ├── AI_PATTERNS.md         ← готовые рецепты
    ├── AI_CODE_REVIEW.md      ← чеклист code review
    ├── AI_LOCALE.md           ← i18n паттерны
    └── AI_SSR_READINESS.md    ← требования для SSR миграции
```

Также: `~/.claude/CLAUDE.md` — глобальные правила поведения агента (стиль ответов, TypeScript strict, decision making).

---

### Что делает каждый файл

#### `CLAUDE.md` — главный entrypoint

Загружается Claude Code автоматически при старте. Содержит:

- **15 Hard Constraints** — то что НИКОГДА нельзя делать:
  ```
  ❌ any types  ❌ npm/yarn  ❌ нарушение FSD границ
  ❌ @ts-ignore  ❌ console.log в коммитах  ❌ class components
  ❌ inline styles  ❌ force push to main  ❌ sub-agents без апрува
  ❌ extra work beyond the ask (каждая изменённая строка = трассируется к запросу)
  ...
  ```
- **Git Flow:** ветки `yes-NNN` → PR в `develop` → squash merge
- **Ссылки** на все AI_*.md документы с указанием когда читать

#### `AGENTS.md` — workflow агента

Загружается автоматически Codex и другими агентами, явно читается Claude Code. Содержит:

- **Session Start Workflow** (6 шагов: pwd → прогресс → handoff → фичи → git log → init.sh)
- **Working Rules** (один фич за раз, не рефакторить соседний код)
- **Session End Checklist** (обновить progress, feature_list, зафиксировать блокеры)
- **Definition of Done** (реализовано + верификация прогнана + зафиксировано в файлах)

#### `claude-progress.md` — рабочая память между сессиями

Без этого файла агент каждый раз начинал бы с exploration кодовой базы.
Содержит: последнее проверенное состояние, текущий статус, следующий шаг, лог прошлых сессий.

#### `feature_list.json` — источник правды о статусе фич

```json
{ "id": "home-usp-section", "ticket": "YES-142", "status": "in-progress" }
```
Агент выбирает задачу с наивысшим приоритетом со статусом `pending` или `in-progress`.

#### `init.sh` — smoke-check

```bash
./init.sh  # → tsc + lint + tests
```
Запускается в начале каждой сессии. Если падает — агент чинит это первым, не начинает фичу.

#### `.claude/AI_*.md` — документы по требованию

Агент читает их только когда нужно (например, перед работой с роутингом читает `AI_TANSTACK.md`). Не загружает всё в контекст сразу.

---

### Поток данных в harness

```
Старт сессии
    ↓
CLAUDE.md → прочитать AGENTS.md
    ↓
claude-progress.md → где мы находимся
    ↓
feature_list.json → что делать дальше
    ↓
./init.sh → можно ли вообще начать
    ↓
Работа
    ↓
claude-progress.md + feature_list.json → обновить
    ↓
Конец сессии
```

---

## Часть 2 — Superpowers + SDD

### Что такое Superpowers

Система навыков (skills) для Claude Code. Скил — markdown-файл с инструкциями, загружается через `Skill` tool:

```
Skill("superpowers:brainstorming")
```

Скил диктует агенту **точный workflow** вместо угадывания. Без скилов агент может пропустить шаг, сделать меньше или больше нужного. Со скилами поведение предсказуемо и воспроизводимо.

### Полный pipeline фичи

```
brainstorming → writing-plans → subagent-driven-development → finishing-a-development-branch
```

---

### Скил 1: `brainstorming`

**Когда:** перед любой новой фичей  
**Что делает:** анализ требований до написания кода

- Изучает макет / требования
- Формулирует ключевые решения вслух (FSD слой, статический vs async, edge cases)
- Задаёт уточняющие вопросы до, не после
- Результат: согласованное понимание задачи

**Пример решений из YES-142:**
- FSD слой: `pages/home/ui/` (не `features/`, не `entities/`)
- Компонент полностью статический → нет Suspense
- CTA: внутренние через `<Link>`, tel: через `<a>`

---

### Скил 2: `writing-plans`

**Когда:** после brainstorming  
**Что делает:** генерирует два артефакта

```
docs/superpowers/specs/ДАТА-название-design.md   ← Design Spec
docs/superpowers/plans/ДАТА-название.md          ← Implementation Plan
```

**Design Spec** — что реализовать: типы данных, layout, constraints, out of scope.  
**Implementation Plan** — как реализовать: N задач, каждая с полным кодом.

Эти файлы — **контракт между сессиями**. Если сессия прервётся, следующий агент подхватит работу с любого места без потери контекста.

**Накопленные артефакты на проекте:**
```
docs/superpowers/specs/
├── 2026-05-06-header-redesign-design.md
├── 2026-05-20-super-hot-deals-design.md
└── 2026-05-21-usp-section-design.md

docs/superpowers/plans/
├── 2026-05-20-super-hot-deals.md
└── 2026-05-21-usp-section.md
```

---

### Скил 3: `subagent-driven-development` (SDD)

**Когда:** после writing-plans  
**Что делает:** реализует план через трёхагентный pipeline

#### Pipeline для каждой задачи:

```
Task N
  ↓
[Implementer subagent]
  — пишет код по плану
  ↓
[Spec Compliance Reviewer subagent]
  — проверяет: реализовано именно то что просили? (не больше, не меньше)
  — читает код, не верит отчёту implementer'а
  ↓
[Code Quality Reviewer subagent]
  — проверяет: TypeScript, архитектура, тесты, accessibility, FSD
  ↓
Next Task
```

#### Ключевой принцип — независимость агентов

Каждый субагент стартует холодным. Spec Reviewer не знает что нашёл Code Quality Reviewer. Code Quality Reviewer не знает что делал Implementer кроме как из кода. Это устраняет confirmation bias.

#### Реальные находки рецензентов в YES-142:

| Проблема | Кто нашёл | Серьёзность |
|----------|-----------|-------------|
| `<Link to={href as '/'}>`  — type cast заглушает роутер | Code Quality | ⚠️ Important |
| `aria-label` дублирует `<h2>` на секции | Code Quality | ⚠️ Important |
| Две кнопки "More" с одинаковым accessible name | Code Quality | ⚠️ Important |
| `React.ReactElement` без импорта в тестах | Code Quality | ❌ Critical |
| TanStack `RouterProvider` рендерится async — тесты падают | Code Quality | ❌ Critical |

**5 проблем** пойманы независимыми рецензентами, не автором кода.

---

### Скил 4: `finishing-a-development-branch`

**Когда:** фича реализована  
**Что делает:** финальный чеклист

1. Прогнать `./init.sh` — последняя проверка
2. Обновить `claude-progress.md` и `feature_list.json`
3. Предложить варианты: PR / merge / keep / discard

---

## Сравнение: с harness vs без

| | Без harness | С harness + SDD |
|---|---|---|
| Старт сессии | Exploration кодовой базы, угадывание контекста | Немедленная работа: прогресс + feature_list готовы |
| Архитектурные решения | По ситуации, непредсказуемо | FSD документирован, нарушения = hard constraint |
| Качество кода | Один агент = один взгляд | 3 независимых агента на задачу |
| Завершение сессии | Агент останавливается после коммита | Явный чеклист, состояние зафиксировано |
| Continuity | Новая сессия — с нуля | claude-progress.md + планы в docs/ |
| Accessibility / TypeScript | Ловится случайно | Обязательный шаг рецензента |

---

## Итого: три уровня системы

```
Уровень 1 — HARNESS
    Правила + контекст + continuity
    CLAUDE.md, AGENTS.md, AI_*.md, claude-progress.md, feature_list.json

Уровень 2 — SUPERPOWERS
    Исполняемые workflow через скилы
    brainstorming → writing-plans → SDD → finishing

Уровень 3 — SDD
    Многоагентный pipeline на каждую задачу
    Implementer → Spec Reviewer → Quality Reviewer
```

Каждый уровень решает свою проблему. Harness — предсказуемость. Superpowers — дисциплина процесса. SDD — качество через независимые взгляды.
