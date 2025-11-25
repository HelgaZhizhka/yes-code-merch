# Архитектура базы данных: Продукты, варианты и скидки

## 📚 Содержание

1. [Введение](#введение)
2. [Структура базы данных](#структура-базы-данных)
3. [Связи между таблицами](#связи-между-таблицами)
4. [Работа с данными на клиенте](#работа-с-данными-на-клиенте)
5. [Почему используется маппинг](#почему-используется-маппинг)
6. [Примеры запросов](#примеры-запросов)

---

## Введение

В нашем приложении используется **Supabase** как база данных (PostgreSQL). Для работы с продуктами у нас есть несколько взаимосвязанных таблиц, которые позволяют гибко управлять товарами, их вариантами (размеры, цвета) и скидками.

### Основная концепция

```
ПРОДУКТ (товар)
  ↓
ВАРИАНТЫ (размеры/цвета)
  ↓
СКИДКИ (процентные или фиксированные)
```

**Пример:** Товар "Футболка YesCode" может иметь варианты:

- Красная, размер S, цена 3000 центов (€30.00)
- Красная, размер M, цена 3000 центов (€30.00)
- Синяя, размер S, цена 3000 центов (€30.00)

И на каждый вариант можно применить скидку (TODO - Phase 1 в разработке)!

---

## Структура базы данных

### 1️⃣ Таблица `products` (Продукты)

Основная информация о товаре.

```sql
create table products (
  id uuid primary key,
  name text not null,              -- Название: "Футболка YesCode"
  slug text unique not null,       -- URL: "futbolka-yescode"
  description text,                -- Описание товара
  is_published boolean default false, -- Опубликован ли товар
  created_at timestamptz,
  updated_at timestamptz
);
```

**Зачем нужны эти поля:**

- `id` - уникальный идентификатор (UUID для безопасности)
- `name` - то, что видит пользователь
- `slug` - для SEO-дружественных URL (`/products/futbolka-yescode`)
- `is_published` - можно скрыть товар без удаления

---

### 2️⃣ Таблица `product_variants` (Варианты продукта)

Конкретные версии продукта с ценой и остатком.

```sql
create table product_variants (
  id uuid primary key,
  product_id uuid references products(id), -- Ссылка на продукт
  sku text unique not null,         -- Артикул: "YC-TSHIRT-RED-S"
  price integer not null,           -- Цена в ЦЕНТАХ: 3000 = €30.00
  currency text not null,           -- Валюта: "EUR"
  stock int not null default 0,     -- Количество на складе
  is_master boolean default false,  -- Главный вариант для отображения
  created_at timestamptz,
  updated_at timestamptz
);
```

**Важные моменты:**

1. **Цена хранится в центах** (integer, умножаем на 100)

   - Почему? Чтобы избежать ошибок округления с floating point
   - €30.00 → хранится как `3000` (integer)
   - €150.99 → хранится как `15099` (integer)
   - Преимущества: точность, производительность, стандарт индустрии (Stripe, Shopify)

2. **is_master = true** - это вариант, который показываем в каталоге

   - Обычно это самый популярный размер/цвет
   - Один продукт = один мастер-вариант

3. **SKU (Stock Keeping Unit)** - уникальный артикул
   - Помогает отслеживать конкретный товар на складе

---

### 3️⃣ Таблица `product_images` (Изображения)

Картинки для вариантов продукта в трёх размерах.

```sql
create table product_images (
  id uuid primary key,
  variant_id uuid references product_variants(id), -- К какому варианту
  url text not null,                -- Путь к файлу в storage
  alt text,                         -- Описание для SEO
  width int,                        -- Ширина изображения (600, 384, 120)
  height int,                       -- Высота изображения
  is_primary boolean default false, -- Главное фото
  sort_order int default 0,         -- Порядок отображения
  created_at timestamptz
);
```

**Как это работает:**

1. **Три размера для каждого изображения:**

   - `large` (600px) - для страниц деталей товара, галерей
   - `medium` (384px) - для карточек в каталоге, списков товаров
   - `small` (120px) - для миниатюр, превью, корзины

2. **Хранение в Supabase Storage:**

   - URL содержит размер: `/large/image.jpg`, `/medium/image.jpg`, `/small/image.jpg`
   - Для каждого варианта создаются 3 записи с разными URL
   - Пример:
     ```
     variant_id: "abc-123"
     ├─ url: "products/large/tshirt-red.jpg"    (sort_order: 0)
     ├─ url: "products/medium/tshirt-red.jpg"   (sort_order: 0)
     └─ url: "products/small/tshirt-red.jpg"    (sort_order: 0)
     ```

3. **Группировка изображений:**
   - `sort_order` - группирует три размера одного изображения (все имеют одинаковый sort_order)
   - Первый набор фото: `sort_order = 0` (для large, medium, small)
   - Второй набор (галерея): `sort_order = 1`, и так далее
   - `is_primary` - не используется в текущей реализации

---

### 4️⃣ Таблица `product_discounts` (Скидки)

> **⚠️ ВАЖНО: Текущая фаза разработки - Процентные скидки**
>
> На данном этапе реализованы **только процентные скидки** (`discount_type = 'percent'`).
> Фиксированные скидки (`discount_type = 'amount'`) будут добавлены позже.

```sql
create table product_discounts (
  id uuid primary key,
  name text not null,               -- "Черная пятница", "Летняя распродажа"
  description text,                 -- Описание акции

  -- Тип и значение скидки
  discount_type text not null,      -- 'percent' или 'amount'
  discount_value numeric(12,2) not null, -- Значение (20 или 500)

  -- К чему применяется
  product_id uuid references products(id),  -- Скидка на продукт
  variant_id uuid references product_variants(id), -- Или на вариант

  -- Приоритет и активность
  priority int not null default 0,  -- Чем больше, тем важнее
  is_active boolean default true,   -- Включена/выключена

  -- Временные рамки
  valid_from timestamptz,           -- Начало действия
  valid_to timestamptz,             -- Окончание действия

  created_at timestamptz,
  updated_at timestamptz,

  -- Проверка: только 'percent' или 'amount'
  constraint discount_type_check
    check (discount_type in ('percent', 'amount'))
);
```

**Типы скидок:**

1. **Процентная скидка** (`discount_type = 'percent'`)

   ```json
   {
     "name": "Черная пятница",
     "discount_type": "percent",
     "discount_value": 20, // 20%
     "priority": 10
   }
   ```

   - Для цены 3000 центов (€30.00) → скидка 600 центов (20%)
   - Финальная цена: 2400 центов (€24.00)

2. **Фиксированная скидка** (`discount_type = 'amount'`) 🔜 (TODO)
   ```json
   {
     "name": "Скидка новому клиенту",
     "discount_type": "amount",
     "discount_value": 500, // 500 центов = €5.00
     "priority": 5
   }
   ```
   - Вычитаем фиксированную сумму из цены
   - **TODO:** Будет реализовано позже

**Уровни применения:**

```
┌─────────────────────────────────────┐
│ product_id = "123", variant_id = null │ → Скидка на ВСЕ варианты продукта
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ product_id = null, variant_id = "456" │ → Скидка только на ОДИН вариант
└─────────────────────────────────────┘
```

**Приоритет скидок:**

Если на товар действует несколько скидок:

1. Сначала смотрим на `priority` (больше = важнее)
2. Если приоритеты равны → выбираем самую выгодную для клиента

Пример:

```
Скидка A: priority = 10, -20%
Скидка B: priority = 5,  -30%
→ Применится A (выше приоритет)

Скидка A: priority = 10, -20%
Скидка B: priority = 10, -30%
→ Применится B (больше выгода)
```

---

### 5️⃣ Таблица `product_categories` (Категории)

Связь many-to-many: один продукт → много категорий.

```sql
create table product_categories (
  product_id uuid references products(id),
  category_id uuid references categories(id),
  primary key (product_id, category_id)
);
```

Пример: Товар "Футболка" может быть в категориях:

- "Одежда"
- "Новинки"
- "Распродажа"

---

## Связи между таблицами

```
┌─────────────┐
│  products   │ (один продукт)
└──────┬──────┘
       │
       ├──────► product_variants (много вариантов)
       │          └──────► product_images (много фото)
       │
       ├──────► product_discounts (много скидок)
       │
       └──────► product_categories (много категорий)
```

**Тип связей:**

- `products` → `product_variants`: **1:N** (один ко многим)
- `product_variants` → `product_images`: **1:N**
- `products` → `product_discounts`: **1:N**
- `product_variants` → `product_discounts`: **1:N**
- `products` ↔ `categories`: **M:N** (многие ко многим)

---

## Работа с данными на клиенте

### Запрос данных из Supabase

Файл: `src/entities/product/api/index.ts`

```typescript
export const getCatalogProducts = async (
  params: GetCatalogParams
): Promise<ProductDTO[]> => {
  const { categoryIds } = params;

  const query = supabase
    .from('products')
    .select(
      `
      id,
      name,
      slug,
      description,

      product_variants!inner(
        id,
        sku,
        price,
        currency,
        stock,
        is_master,
        product_images(
          url,
          alt,
          is_primary,
          sort_order
        )
      ),

      product_discounts(
        id,
        name,
        discount_type,
        discount_value,
        priority,
        valid_from,
        valid_to,
        is_active,
        variant_id,
        product_id
      ),

      product_categories!inner(
        category_id
      )
    `
    )
    .eq('is_published', true)
    .eq('product_variants.is_master', true)
    .in('product_categories.category_id', categoryIds);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
};
```

**Разбор запроса построчно:**

1. **`.from('products')`** - начинаем с таблицы products

2. **`.select(...)`** - выбираем поля (вложенный запрос):

   - Прямые поля: `id, name, slug, description`
   - Связанные данные: `product_variants(...)`, `product_discounts(...)`

3. **`product_variants!inner(...)`** - восклицательный знак + `inner`:

   - `!` означает "связь по foreign key"
   - `inner` означает INNER JOIN (только продукты с вариантами)
   - Если бы было `product_variants(...)` - это LEFT JOIN (могут быть продукты без вариантов)

4. **`.eq('is_published', true)`** - фильтр: только опубликованные товары

5. **`.eq('product_variants.is_master', true)`** - только мастер-варианты

   - Точка означает фильтр по вложенной таблице
   - Получим только 1 вариант на продукт

6. **`.in('product_categories.category_id', categoryIds)`** - фильтр по категориям
   - Например: `categoryIds = ['uuid1', 'uuid2']`
   - Вернет продукты из этих категорий

**Что вернет запрос:**

```typescript
// ProductDTO[] - массив объектов:
[
  {
    id: 'prod-uuid-1',
    name: 'Футболка YesCode',
    slug: 'futbolka-yescode',
    description: 'Крутая футболка',

    // Вложенный массив (но всегда 1 элемент, т.к. is_master = true)
    product_variants: [
      {
        id: 'var-uuid-1',
        sku: 'YC-TSHIRT-RED-M',
        price: 3000, // В центах! (integer)
        currency: 'EUR',
        stock: 15,
        is_master: true,

        product_images: [
          { url: 'products/large/tshirt.jpg', is_primary: true, sort_order: 0 },
          {
            url: 'products/medium/tshirt.jpg',
            is_primary: true,
            sort_order: 0,
          },
          { url: 'products/small/tshirt.jpg', is_primary: true, sort_order: 0 },
        ],
      },
    ],

    // Все скидки на этот продукт
    product_discounts: [
      {
        id: 'disc-uuid-1',
        name: 'Черная пятница',
        discount_type: 'percent',
        discount_value: 20,
        priority: 10,
        valid_from: '2025-11-20T00:00:00Z',
        valid_to: '2025-11-30T23:59:59Z',
        is_active: true,
        variant_id: null, // На весь продукт
        product_id: 'prod-uuid-1',
      },
      {
        id: 'disc-uuid-2',
        name: 'Скидка на красный цвет',
        discount_type: 'percent',
        discount_value: 10,
        priority: 5,
        variant_id: 'var-uuid-1', // Только на этот вариант
        product_id: null,
      },
    ],

    product_categories: [{ category_id: 'cat-uuid-1' }],
  },
  // ... другие продукты
];
```

---

## Почему используется маппинг

### Проблема: Разные форматы данных

**DTO (Data Transfer Object)** - формат данных из БД:

```typescript
{
  product_variants: [...],  // snake_case (стиль БД)
  product_discounts: [...],
  is_master: true
}
```

**Domain Model** - формат для приложения:

```typescript
{
  masterVariantId: "...",   // camelCase (стиль JS)
  finalPrice: 4000,
  hasDiscount: true,
  images: {                 // Сгруппированные изображения
    large: "",
    medium: "",
    small: ""
  }
}
```

### Зачем нужна трансформация?

1. **Упрощение структуры**

   ```typescript
   // ДО (DTO):
   product.product_variants[0].price;

   // ПОСЛЕ (Domain):
   product.originalPrice;
   ```

2. **Расчет дополнительных полей**

   ```typescript
   // DTO не содержит финальную цену, только оригинальную
   // Domain Model содержит:
   {
     originalPrice: 5000,
     finalPrice: 4000,      // Рассчитано!
     hasDiscount: true,     // Рассчитано!
     discountAmount: 1000,  // Рассчитано!
     images: {              // Сгруппировано!
       large: "",
       medium: "",
       small: ""
     }
   }
   ```

3. **Соблюдение принципа разделения слоев (FSD)**
   ```
   API Layer (DTO) → Mapper → Business Logic → UI
   ```

### Как работает mapper

Файл: `src/entities/product/api/mapper.ts`

```typescript
// Вспомогательная функция: определяет размер по URL
const extractImageSize = (url: string): 'large' | 'medium' | 'small' | null => {
  if (url.includes('/large/')) return 'large';
  if (url.includes('/medium/')) return 'medium';
  if (url.includes('/small/')) return 'small';
  return null;
};

// Группирует изображения по размерам
const groupImagesBySizes = (
  images: ProductImageDTO[] | undefined
): ProductImages | null => {
  if (!images || images.length === 0) return null;

  // Находим минимальный sort_order
  const minSortOrder = Math.min(...images.map((img) => img.sort_order));

  // Берём все изображения с минимальным sort_order
  const targetImages = images.filter((img) => img.sort_order === minSortOrder);

  // Группируем по размерам
  const result: ProductImages = { large: null, medium: null, small: null };

  for (const img of targetImages) {
    const size = extractImageSize(img.url);
    if (size && !result[size]) {
      result[size] = getStorageUrl(img.url);
    }
  }

  return result.large || result.medium || result.small ? result : null;
};

export const mapToCatalogProducts = (
  products: readonly ProductDTO[] // Из БД
): CatalogProduct[] => {
  // Для UI
  return products
    .map((raw) => {
      // 1. Извлекаем мастер-вариант
      const masterVariant = raw.product_variants?.[0];
      if (!masterVariant) return null; // Нет варианта - пропускаем

      // 2. Группируем изображения по размерам
      const images = groupImagesBySizes(masterVariant.product_images);

      // 3. TODO: Применяем скидки (в разработке)

      // 4. Формируем упрощенный объект
      return {
        // Базовая информация
        productId: raw.id,
        name: raw.name,
        slug: raw.slug,
        description: raw.description,

        // Информация о варианте
        masterVariantId: masterVariant.id,
        sku: masterVariant.sku,
        stock: masterVariant.stock,

        // Ценообразование
        originalPrice: masterVariant.price,
        finalPrice: masterVariant.price, // TODO: применить скидки
        currency: masterVariant.currency,
        hasDiscount: false, // TODO: рассчитать
        discountAmount: undefined, // TODO: рассчитать
        discountPercentage: undefined, // TODO: рассчитать
        appliedDiscount: undefined, // TODO: рассчитать

        // Изображения (сгруппированные по размерам)
        images, // { large: "url", medium: "url", small: "url" }
      };
    })
    .filter(isNotNull); // Убираем null (продукты без вариантов)
};
```

**Почему `product_variants?.[0]`?**

```typescript
// Вопросительный знак - безопасный доступ (optional chaining)
// Если product_variants === undefined → вернет undefined
// Без ?: был бы runtime error

// [0] - берем первый элемент
// Почему первый? Потому что в запросе фильтр:
// .eq('product_variants.is_master', true)
// Всегда вернется массив с 1 элементом
```

**Как работает группировка изображений?**

```typescript
// 1. Из БД приходят все размеры одного изображения (одинаковый sort_order):
product_images: [
  { url: "products/large/tshirt.jpg", sort_order: 0 },
  { url: "products/medium/tshirt.jpg", sort_order: 0 },
  { url: "products/small/tshirt.jpg", sort_order: 0 }
]

// 2. Mapper находит минимальный sort_order (0) и берет эту группу:
const minSortOrder = Math.min(...images.map(img => img.sort_order)); // 0
const targetImages = images.filter(img => img.sort_order === minSortOrder);

// 3. Группирует по размеру через extractImageSize():
images: {
  large: "https://storage.example.com/products/large/tshirt.jpg",
  medium: "https://storage.example.com/products/medium/tshirt.jpg",
  small: "https://storage.example.com/products/small/tshirt.jpg"
}

// 4. UI выбирает нужный размер:
// Каталог: product.images?.medium
// Превью: product.images?.small
// Детали: product.images?.large
```

**Пример галереи (несколько наборов фото):**

```typescript
// В БД:
product_images: [
  // Первое фото (sort_order = 0)
  { url: 'products/large/tshirt-front.jpg', sort_order: 0 },
  { url: 'products/medium/tshirt-front.jpg', sort_order: 0 },
  { url: 'products/small/tshirt-front.jpg', sort_order: 0 },

  // Второе фото (sort_order = 1)
  { url: 'products/large/tshirt-back.jpg', sort_order: 1 },
  { url: 'products/medium/tshirt-back.jpg', sort_order: 1 },
  { url: 'products/small/tshirt-back.jpg', sort_order: 1 },
];

// Mapper берёт только первый набор (minSortOrder = 0)
```

**Почему `filter(isNotNull)`?**

```typescript
// map() может вернуть null (если нет варианта)
// filter(isNotNull) убирает все null из массива

// БЫЛО: [Product1, null, Product2, null]
// СТАЛО: [Product1, Product2]
```

---

## Примеры запросов

### Получить продукты из категории "Футболки"

```typescript
const products = await getCatalogProducts({
  categoryIds: ['category-tshirts-uuid'],
});

// Вернет:
// - Все продукты где is_published = true
// - Привязанные к категории "Футболки"
// - С мастер-вариантом
// - С их скидками
```
---

### Использование изображений в UI

```typescript
// В компоненте ProductCard (каталог)
export const ProductCard = ({ product }: ProductCardProps) => {
  const imageUrl =
    product.images?.medium || 'https://placehold.co/400x400?text=No+Image';

  return (
    <img
      src={imageUrl}
      alt={product.name}
      width={380}
      height={460}
      loading="lazy"
    />
  );
};
```

---

### Ключевые концепции:

1. **Цены в центах (integer)** - всегда умножаем на 100 при сохранении, используем целые числа для точности
2. **Nested queries** - Supabase позволяет загружать связанные данные одним запросом
3. **Маппинг** - преобразуем сложный DTO в простой Domain Model
4. **Скидки (TODO - Phase 1)** - могут быть на продукт или вариант, с приоритетом. Сейчас только процентные
5. **Изображения** - три размера (large/medium/small), выбираются по минимальному sort_order
