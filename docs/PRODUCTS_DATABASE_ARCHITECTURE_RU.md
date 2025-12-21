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

Картинки для вариантов продукта.

```sql
create table product_images (
  id uuid primary key,
  variant_id uuid references product_variants(id), -- К какому варианту
  url text not null,                -- Относительный путь к файлу в storage
  alt text,                         -- Описание для SEO
  width int,                        -- Ширина изображения
  height int,                       -- Высота изображения
  is_primary boolean default false, -- Главное фото
  sort_order int default 0,         -- Порядок отображения
  created_at timestamptz
);
```

**Как это работает:**

1. **Одна запись на изображение (только large):**

   - В базе хранится **только путь к large** размеру
   - `medium` и `small` генерируются автоматически в коде заменой `/large/` → `/medium/` или `/small/`

2. **Хранение в Supabase Storage:**

   - Структура папок:
     ```
     catalog/variants/{sku}/
       ├── large/{sku}.png   (600px)
       ├── medium/{sku}.png  (384px)
       └── small/{sku}.png   (120px)
     ```
   - В БД хранится только: `catalog/variants/{sku}/large/{sku}.png`
   - Пример записи:
     ```
     variant_id: "abc-123"
     url: "catalog/variants/tshirt-red-m/large/tshirt-red-m.png"
     sort_order: 0
     ```

3. **Преимущества подхода:**
   - Одна запись = одно изображение (меньше данных в БД)
   - Нет рассинхронизации между размерами
   - Легко добавить новый размер без изменения БД
   - `sort_order` определяет порядок (0 = главное фото)

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

        // Только одна запись на изображение (large путь)
        // medium и small генерируются автоматически в mapper
        product_images: [
          {
            url: 'catalog/variants/YC-TSHIRT-RED-M/large/YC-TSHIRT-RED-M.png',
            is_primary: true,
            sort_order: 0,
          },
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
// Генерирует URL для всех размеров из базового пути (large)
const getImageSizes = (basePath: string): ProductImages => {
  return {
    large: getStorageUrl(basePath),
    medium: getStorageUrl(basePath.replace('/large/', '/medium/')),
    small: getStorageUrl(basePath.replace('/large/', '/small/')),
  };
};

// Находит главное изображение и генерирует все размеры
const groupImagesBySizes = (
  images: ProductImageDTO[] | undefined
): ProductImages | null => {
  if (!images || images.length === 0) return null;

  // Находим изображение с минимальным sort_order (главное фото)
  const minSortOrder = Math.min(...images.map((img) => img.sort_order));
  const primaryImage = images.find((img) => img.sort_order === minSortOrder);

  if (!primaryImage) return null;

  // Генерируем все три размера из одного пути
  return getImageSizes(primaryImage.url);
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

**Как работает генерация размеров изображений?**

```typescript
// 1. Из БД приходит только large путь:
product_images: [
  { url: "catalog/variants/tshirt-red/large/tshirt-red.png", sort_order: 0 }
]

// 2. Mapper находит изображение с минимальным sort_order:
const minSortOrder = Math.min(...images.map(img => img.sort_order)); // 0
const primaryImage = images.find(img => img.sort_order === minSortOrder);

// 3. Генерирует все три размера заменой "/large/" в пути:
const getImageSizes = (basePath) => ({
  large: getStorageUrl(basePath),  // ...large/tshirt-red.png
  medium: getStorageUrl(basePath.replace('/large/', '/medium/')),  // ...medium/tshirt-red.png
  small: getStorageUrl(basePath.replace('/large/', '/small/')),    // ...small/tshirt-red.png
});

// 4. Результат:
images: {
  large: "https://project.supabase.co/storage/v1/object/public/catalog/variants/tshirt-red/large/tshirt-red.png",
  medium: "https://project.supabase.co/storage/v1/object/public/catalog/variants/tshirt-red/medium/tshirt-red.png",
  small: "https://project.supabase.co/storage/v1/object/public/catalog/variants/tshirt-red/small/tshirt-red.png"
}

// 5. UI выбирает нужный размер:
// Каталог: product.images?.medium
// Превью: product.images?.small
// Детали: product.images?.large
```

**Пример галереи (несколько фото):**

```typescript
// В БД — по одной записи на фото (только large):
product_images: [
  { url: 'catalog/variants/tshirt/large/tshirt-front.png', sort_order: 0 }, // Главное
  { url: 'catalog/variants/tshirt/large/tshirt-back.png', sort_order: 1 }, // Второе
];

// Mapper берёт только первое (minSortOrder = 0)
// и генерирует все три размера автоматически
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
5. **Изображения** - в БД только large путь, medium/small генерируются автоматически заменой `/large/` в URL
