# Отчёт: Реализация поиска/сортировки каталога через DATABASE VIEW

**Дата:** 2026-01-28
**Тема:** Решение проблемы сортировки по цене в каталоге товаров

---

## Что было

Каталог товаров работал через прямые запросы к таблице `products` через Supabase PostgREST API:

```typescript
supabase
  .from('products')
  .select('*, product_variants!inner(*)')
  .order('product_variants.price')  // ❌ ЛОМАЛОСЬ
```

### Проблема

PostgREST (API Supabase) имеет ограничение: **нельзя сортировать по колонкам из связанных таблиц** в отношениях `one-to-many`.

У нас:
- Таблица `products` (один товар)
- Таблица `product_variants` (много вариантов у товара)
- Нужно сортировать по `price` из `product_variants`

Ошибка: `"A related order on 'product_variants' is not possible"`

---

## Почему VIEW?

### Что такое VIEW?

VIEW (представление) — это **сохранённый SQL запрос**. Не новая таблица с данными, а виртуальная таблица, которая создаётся из запроса к реальным таблицам каждый раз при обращении.

```sql
-- VIEW это просто "сохранённый запрос"
CREATE VIEW products_search AS
  SELECT p.*, pv.price, pv.sku
  FROM products p
  JOIN product_variants pv ON pv.product_id = p.id AND pv.is_master = true;

-- Используешь как обычную таблицу:
SELECT * FROM products_search ORDER BY price;
```

### Почему выбрали VIEW а не другие варианты?

Рассматривались альтернативы:

| Решение | Плюсы | Минусы |
|---------|-------|--------|
| **VIEW** ✅ | Стандарт SQL, переносимо, нет дублирования данных | — |
| RPC функция | Полный контроль | Привязка к Postgres, больше кода |
| Edge Function | Гибкость | Привязка к Supabase Functions |
| Computed column | Быстро | Денормализация, нужен триггер |
| Начать запрос с product_variants | Сортировка работает | Не работает для фильтров по атрибутам |

**Решающий аргумент от ментора:** Проект должен быть независимым от Supabase, чтобы можно было мигрировать на другой бэкенд.

- VIEW = **стандарт SQL**, работает в любой базе данных
- При миграции: просто скопируть один SQL скрипт
- API слой (`getCatalogProducts`) остаётся тем же — меняется только внутренняя реализация

---

## Что было сделано

### 1. Создана миграция с VIEW

**Файл:** `supabase/migrations/20260127_create_products_search_view.sql`

VIEW объединяет:
- `products` — базовая информация товара
- `product_variants` (master) — цена, SKU, stock
- `product_images` — первая картинка (subquery)
- `product_discounts` — скидки (JSONB агрегация)
- `product_categories` — категория товара

```sql
CREATE VIEW products_search
WITH (security_invoker = true) AS  -- Безопасность: выполняется с правами пользователя
SELECT
  p.id, p.name, p.slug, p.description,
  pv.id as variant_id, pv.price, pv.sku, pv.stock,
  (SELECT url FROM product_images WHERE variant_id = pv.id ORDER BY sort_order LIMIT 1) as primary_image_url,
  (SELECT jsonb_agg(...) FROM product_discounts ...) as product_discounts,
  pc.category_id
FROM products p
INNER JOIN product_variants pv ON pv.product_id = p.id AND pv.is_master = true
LEFT JOIN product_categories pc ON pc.product_id = p.id
WHERE p.is_published = true;
```

**Ключевые решения:**
- `security_invoker = true` — VIEW выполняется с правами запрашивающего пользователя, а не создателя. Это важно для безопасности и RLS.
- `is_master = true` — на витрине каталога показываем только master вариант товара
- `product_discounts` через `jsonb_agg` — скидки приходят как JSONB массив, который парсим на клиенте

### 2. Обновлён API запрос

**Файл:** `src/entities/product/api/index.ts`

Было:
```typescript
supabase.from('products').select('*, product_variants!inner(*)...')
  .eq('product_variants.is_master', true)
  .order('product_variants.price')  // ❌
```

Стало:
```typescript
supabase.from('products_search').select('*', { count: 'exact' })
  .in('category_id', categoryIds)
  .order(sortField)  // ✅ price теперь колонка в VIEW
```

Упрощения:
- Нет больше вложенных `!inner()` selects
- Сортировка по `price` просто `.order('price')` — колонка уже в VIEW
- Фильтр по цене: `.gte('price', priceMin)` — напрямую

### 3. Создан новый mapper

**Файл:** `src/entities/product/api/mapper.ts`

`mapFromViewToCatalogProducts` — преобразует flat данные из VIEW в `CatalogProduct`:
- Парсит `product_discounts` из JSONB и применяет скидки через `applyDiscountsToProduct`
- Генерирует URL картинок из `primary_image_url`
- Валидация: пропускает записи с пропущенными обязательными полями

### 4. Обновлены типы

**Файл:** `src/entities/product/api/types.ts`

```typescript
// Тип берётся из сгенерированных типов Supabase (автоматически)
export type ProductSearchViewDTO = Public['Views']['products_search']['Row'];
```

После миграции: `pnpm types:db:local` — TypeScript автоматически видит VIEW и генерирует типы.

### 5. Обновлены hooks

**Файл:** `src/entities/product/api/hooks.ts`

Хук `useProducts` теперь использует новый тип и mapper, но **интерфейс не изменился**:
```typescript
const { data } = useProducts({ categoryIds, search, sortField, page });
// data.data — массив CatalogProduct (как раньше)
// data.meta — пагинация (как раньше)
```

---

## Как работает каталог сейчас

```
URL: /category/clothes?search=shirt&sortField=price&sortDirection=asc&page=2

1. TanStack Router парсит URL параметры через Zod schema
2. useCatalogSearch() даёт доступ к параметрам
3. useProducts(params) вызывает getCatalogProducts()
4. getCatalogProducts() делает запрос к VIEW products_search
5. VIEW выполняет SQL JOIN на лету
6. Mapper преобразует flat данные в CatalogProduct[]
7. React Query кеширует результат (5 минут)
```

---

## Будущие фильтры по атрибутам

Когда нужно добавить фильтры по размеру, цвету и т.д.:

```typescript
// В getCatalogProducts добавить:
if (size) {
  // Фильтр: товар попадёт если ХОТЯ БЫ ОДИН вариант подходит
  query = query.in('id',
    supabase.from('product_variants').select('product_id').eq('size', size)
  );
}
```

VIEW не нужно менять — фильтрация идёт через дополнительный subquery к `product_variants`.

---

## Миграция на другой backend

При смене бэкенда:
1. VIEW (`products_search`) — скопировать SQL в новую БД (стандарт SQL)
2. `getCatalogProducts` — изменить только внутренность (fetch к новому API)
3. Типы, mapper, hooks — **не меняются**

---

## Файлы которые были изменены

| Файл | Что сделано |
|------|-------------|
| `supabase/migrations/20260127_create_products_search_view.sql` | Миграция с VIEW |
| `src/entities/product/api/index.ts` | Запрос к VIEW |
| `src/entities/product/api/types.ts` | Тип VIEW из сгенерированных |
| `src/entities/product/api/mapper.ts` | Новый mapper для flat данных |
| `src/entities/product/api/hooks.ts` | Обновлены для нового mapper |
| `docs/SEARCH.md` | Документация для студентов |
