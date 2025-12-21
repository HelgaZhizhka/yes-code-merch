# Product Entity

Product entity for working with catalog products.

## Structure

```
entities/product/
  ├── api/                     # API layer
  │   ├── types.ts            # TypeScript types (DTOs, domain models)
  │   ├── index.ts            # API functions (getCatalogProducts)
  │   ├── mapper.ts           # DTO -> Domain mapping
  │   └── hooks.ts            # React Query hooks (useProducts)
  ├── ui/                     # UI components
  │   ├── product-card.tsx    # Single product card component
  │   ├── product-list.tsx    # Product grid/list component
  │   └── index.ts            # Public exports
  └── index.ts                # Public API
```

## Features

- ✅ **Nested queries** - single request fetches all data (variants, images, discounts)
- ✅ **Category filtering** - supports parent categories (includes all children) and leaf categories
- ✅ **Hierarchical filtering** - automatically includes child categories when filtering by parent
- ✅ **Multi-size images** - three sizes (120px, 384px, 600px) selected by minimum sort_order
- ✅ **Price in cents** - integer storage (3000 = €30.00) for precision and performance
- ✅ **Suspense integration** - automatic loading states with React Suspense
- ✅ **Error boundaries** - centralized error handling at page level
- ✅ **UI components** - ready-to-use ProductCard and ProductList components
- 🔜 **Discount system** - percentage and fixed-amount discounts (in progress)

## API

### `getCatalogProducts(params)`

Get a list of products for the catalog.

**Parameters:**

```typescript
interface CatalogParams {
  categoryIds: string[]; // Array of category IDs (parent + children)
}
```

**Example:**

```typescript
// Parent category - includes all children
const products = await getCatalogProducts({
  categoryIds: ['parent-id', 'child1-id', 'child2-id'],
});

// Leaf category - single category only
const products = await getCatalogProducts({
  categoryIds: ['child-id'],
});
```

**Returns:**

```typescript
CatalogProduct[] // Array of products
```

### `CatalogProduct` Type

Domain model for catalog products (clean camelCase format):

```typescript
interface ProductImages {
  large: string | null; // 600px image URL
  medium: string | null; // 384px image URL
  small: string | null; // 120px image URL
}

interface CatalogProduct {
  productId: string; // Product ID
  name: string; // Product name
  slug: string; // URL-friendly slug
  description: string | null; // Product description
  masterVariantId: string; // Master variant ID
  sku: string; // Stock keeping unit
  originalPrice: number; // Price in cents (e.g., 3000 = €30.00)
  currency: string; // Currency code (e.g., "EUR", "USD")
  stock: number; // Available stock quantity
  images: ProductImages | null; // Product images in three sizes
}
```

**Note:** This is a **domain model** mapped from `ProductDTO` (database DTO in snake_case).

> **⚠️ TODO:** Discount-related fields (`hasDiscount`, `finalPrice`, `discountAmount`, `discountPercentage`, `appliedDiscount`) will be added to this documentation after discount system implementation is complete.

**Image handling:**

- Three image sizes are stored for each product: `large` (600px), `medium` (384px), `small` (120px)
- Size is determined by URL path segment (e.g., `/large/`, `/medium/`, `/small/`)
- Image selection logic:
  1. Find minimum `sort_order` value among all product images
  2. Select all images with that minimum `sort_order` (typically 3 images - one per size)
  3. For each size (`large`, `medium`, `small`), use the first matching image from the selected set
- Each size URL is fully qualified (includes Supabase storage domain)
- If no images exist for the product, `images` field will be `null`

## Query Architecture

Uses Supabase **nested queries** without RPC functions:

```typescript
supabase
  .from('products')
  .select(
    `
    id, name, slug, description,
    product_variants!inner(
      id, sku, price, currency, stock,
      product_images(url, alt, is_primary, sort_order)
    ),
    product_discounts(
      id, discount_type, discount_value, priority,
      valid_from, valid_to, is_active, variant_id, product_id
    ),
    product_categories!inner(
      category_id
    )
  `
  )
  .eq('is_published', true)
  .eq('product_variants.is_master', true)
  .in('product_categories.category_id', categoryIds); // Filter by array of IDs
```

### Benefits of this approach:

1. **Single database query** - all related data fetched at once
2. **No RPC functions** - pure Supabase queries through foreign keys
3. **Type-safe** - full TypeScript support from generated types
4. **Efficient** - Supabase handles joins internally
5. **Hierarchical filtering** - parent categories automatically include children
6. **Category filtering** - uses `.in()` for multiple category IDs through `product_categories` join table

## Type System Architecture

The product entity uses a layered type system following the project's DTO → Domain Model pattern:

### Layer 1: Database DTOs (from Supabase)

Auto-generated types from database schema (snake_case):

```typescript
type ProductRowDTO = Public['Tables']['products']['Row'];
type ProductVariantRowDTO = Public['Tables']['product_variants']['Row'];
type ProductImageRowDTO = Public['Tables']['product_images']['Row'];
type ProductDiscountRowDTO = Public['Tables']['product_discounts']['Row'];
```

### Layer 2: Nested Query DTOs

Types for complex nested query results (snake_case):

```typescript
interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  product_variants: ProductVariantDTO[];
  product_discounts?: ProductDiscountDTO[];
  product_categories: ProductCategoryDTO[];
}

interface ProductVariantDTO {
  id: string;
  sku: string;
  price: number;
  currency: string;
  stock: number;
  is_master: boolean;
  product_images?: ProductImageDTO[];
}

interface ProductImageDTO {
  url: string;
  alt: string | null;
  is_primary: boolean;
  sort_order: number;
}
```

### Layer 3: Domain Models

Clean camelCase models for business logic:

```typescript
interface ProductImages {
  large: string | null;
  medium: string | null;
  small: string | null;
}

interface CatalogProduct {
  productId: string;
  name: string;
  slug: string;
  description: string | null;
  masterVariantId: string;
  sku: string;
  originalPrice: number;
  currency: string;
  stock: number;
  images: ProductImages | null;
}
```

### Mapper Function

The `mapToCatalogProducts()` function transforms DTOs into domain models:

```typescript
const extractImageSize = (url: string): 'large' | 'medium' | 'small' | null => {
  if (url.includes('/large/')) return 'large';
  if (url.includes('/medium/')) return 'medium';
  if (url.includes('/small/')) return 'small';
  return null;
};

const groupImagesBySizes = (
  images: ProductImageDTO[] | undefined
): ProductImages | null => {
  if (!images || images.length === 0) return null;

  // Find minimum sort_order value
  const minSortOrder = Math.min(...images.map((img) => img.sort_order));

  // Select all images with minimum sort_order
  const targetImages = images.filter((img) => img.sort_order === minSortOrder);

  // Group by size
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
  products: readonly ProductDTO[]
): CatalogProduct[] => {
  return products
    .map((raw) => {
      const masterVariant = raw.product_variants?.[0];
      if (!masterVariant) return null;

      const images = groupImagesBySizes(masterVariant.product_images);

      return {
        productId: raw.id,
        name: raw.name,
        slug: raw.slug,
        description: raw.description,
        masterVariantId: masterVariant.id,
        sku: masterVariant.sku,
        originalPrice: masterVariant.price,
        currency: masterVariant.currency,
        stock: masterVariant.stock,
        images,
      };
    })
    .filter(isNotNull);
};
```

**Mapper responsibilities:**

- ✅ Flattens nested master variant data
- ✅ Groups images by size (large/medium/small):
  - Finds minimum `sort_order` value among all images
  - Selects all images with that minimum `sort_order`
  - For each size, selects first matching image from the selected set
- ✅ Converts snake_case to camelCase
- ✅ Filters out products without master variant
- ✅ Converts storage paths to full URLs (via `getStorageUrl()`)

> **⚠️ TODO:** Discount calculation logic will be added to mapper after implementation is complete.

## Performance Considerations

1. **Selective fields** - only necessary fields are fetched
2. **Index usage** - queries use `is_published` and `is_master` indexes
3. **Single query** - no N+1 problem with nested queries
4. **Smart caching** - React Query caches each category combination separately
5. **Hierarchical optimization** - parent categories filter by multiple IDs in one query

## React Query Hooks Implementation

### `useProducts` Hook

Uses `useSuspenseQuery` for automatic Suspense and ErrorBoundary integration:

```typescript
import { useSuspenseQuery } from '@tanstack/react-query';
import { getCatalogProducts } from './index';
import { mapToCatalogProducts } from './mapper';

export const useProducts = (params: GetCatalogParams) => {
  return useSuspenseQuery<ProductDTO[], Error, CatalogProduct[]>({
    queryKey: productKeys.catalog(params),
    queryFn: () => getCatalogProducts(params), // Returns ProductDTO[]
    select: mapToCatalogProducts, // Maps to CatalogProduct[]
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    retry: 1,
  });
};
```

**Type parameters:**

- `ProductDTO[]` - type returned from `queryFn`
- `Error` - error type
- `CatalogProduct[]` - final type after `select` transformation

**Key differences from `useQuery`:**

- ✅ No `isLoading` state - handled by Suspense
- ✅ No `error` state - handled by ErrorBoundary
- ✅ `data` is never undefined - guaranteed by Suspense
- ✅ Throws errors automatically - caught by ErrorBoundary
- ✅ Suspends during loading - shows Suspense fallback

## React Query Keys

```typescript
export const productKeys = {
  all: ['products'], // All product queries
  catalog: (
    params: GetCatalogParams // Specific catalog
  ) => ['products', 'catalog', params],
};
```

**Cache invalidation examples:**

```typescript
// Invalidate all catalogs
queryClient.invalidateQueries({ queryKey: ['products', 'catalog'] });

// Invalidate specific catalog
queryClient.invalidateQueries({
  queryKey: productKeys.catalog({ categoryIds: ['id'] }),
});

// Invalidate everything related to products
queryClient.invalidateQueries({ queryKey: productKeys.all });
```

## UI Components

The product entity provides ready-to-use UI components for displaying products.

### `ProductCard`

Displays a single product with image and name.

**Props:**

```typescript
interface ProductCardProps {
  product: CatalogProduct;
}
```

**Usage:**

```typescript
import { ProductCard } from '@entities/product';

<ProductCard product={product} />
```

**Features:**

- Displays product image with lazy loading
- Uses `medium` size (384px) for catalog cards, with fallback to placeholder
- Falls back to placeholder image if no image available
- Shows product name
- Optimized image loading with `loading="lazy"` and `decoding="async"`

### `ProductList`

Displays a grid/list of products using ProductCard.

**Props:**

```typescript
interface ProductListProps {
  products: CatalogProduct[];
}
```

**Usage:**

```typescript
import { ProductList } from '@entities/product';

<ProductList products={products} />
```

**Features:**

- Responsive flex layout with gap
- Shows "No products found" when list is empty
- Automatically maps products to ProductCard components
- Uses `productId` as key for React reconciliation

## Usage Example

Complete example with Suspense and ErrorBoundary:

```typescript
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useProducts, ProductList } from '@entities/product';

const CatalogContent = ({ categoryIds }: { categoryIds: string[] }) => {
  const { data: products } = useProducts({ categoryIds });
  return <ProductList products={products} />;
};

const CatalogPage = ({ categoryIds }: { categoryIds: string[] }) => {
  return (
    <ErrorBoundary fallback={<div>Error loading products</div>}>
      <Suspense fallback={<div>Loading products...</div>}>
        <CatalogContent categoryIds={categoryIds} />
      </Suspense>
    </ErrorBoundary>
  );
};
```

## Image Size Selection Guide

Choose the appropriate image size based on the context:

- **`small` (120px)** - Thumbnails, mini previews, cart items
- **`medium` (384px)** - Catalog cards, product lists, search results
- **`large` (600px)** - Product detail pages, galleries, zoom previews
