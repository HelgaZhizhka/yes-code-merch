# Product Entity

Product entity for working with catalog products.

## Structure

```
entities/product/
  ├── api/                     # API layer
  │   ├── types.ts            # TypeScript types (DTO, domain models)
  │   ├── index.ts            # API functions (getCatalogProducts)
  │   ├── mapper.ts           # DTO -> Domain mapping
  │   └── hooks.ts            # React Query hooks
  ├── lib/                    # Utilities
  │   └── calculate-price.ts  # Price calculation with discounts
  └── index.ts                # Public API
```

## Usage

### React Query Hook

```typescript
import { useProducts } from 'entities/product';

function CatalogPage() {
  const { data, isLoading } = useProducts({
    categoryId: 'uuid',
    page: 1,
    pageSize: 24,
    sortBy: 'finalPrice',
    sortDir: 'asc',
  });

  if (isLoading) return <Loader />;

  return (
    <div>
      {data?.products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  );
}
```

### Direct API Call

```typescript
import { getCatalogProducts } from 'entities/product';

async function loadProducts() {
  const { products, pagination } = await getCatalogProducts({
    search: 'hoodie',
    page: 1,
    pageSize: 12,
  });

  console.log(`Loaded ${products.length} of ${pagination.total}`);
}
```

## Features

- ✅ **Nested queries** - single request fetches all data (variants, images, discounts)
- ✅ **Category filtering** - through join table `product_categories`
- ✅ **Discount calculation** - automatic price calculation with discounts
- ✅ **Discount priority** - variant-level > product-level
- ✅ **Pagination** - built-in support
- ✅ **Search** - by product name
- ✅ **Sorting** - by price, name, date

## API

### `getCatalogProducts(params)`

Get a list of products for the catalog.

**Parameters:**
- `categoryId?: string` - Filter by category
- `search?: string` - Search by name
- `page?: number` - Page number (default: 1)
- `pageSize?: number` - Page size (default: 24)
- `sortBy?: 'price' | 'finalPrice' | 'name' | 'created_at'` - Sort field
- `sortDir?: 'asc' | 'desc'` - Sort direction

**Returns:**
```typescript
{
  products: CatalogProduct[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
```

### `CatalogProduct` Type

```typescript
interface CatalogProduct {
  productId: string;
  name: string;
  slug: string;
  description: string | null;
  masterVariantId: string;
  sku: string;
  originalPrice: number;    // Price without discount
  finalPrice: number;       // Price with discount applied
  currency: string;
  stock: number;
  primaryImageUrl: string | null;
  hasDiscount: boolean;
  discountInfo: DiscountInfo | null;
}
```

## Query Architecture

Uses Supabase **nested queries** without RPC functions:

```typescript
supabase
  .from('products')
  .select(`
    id, name, slug, description,
    product_variants!inner(
      id, sku, price, currency, stock,
      product_images(url, alt, is_primary, sort_order)
    ),
    product_discounts(
      id, discount_type, discount_value, priority,
      valid_from, valid_to, is_active
    )
  `)
  .eq('is_published', true)
  .eq('product_variants.is_master', true);
```

### Benefits of this approach:

1. **Single database query** - all related data fetched at once
2. **No RPC functions** - pure Supabase queries through foreign keys
3. **Type-safe** - full TypeScript support from generated types
4. **Efficient** - Supabase handles joins internally
5. **Category filtering** - works through `product_categories` join table

## Discount Calculation Logic

Discount calculation follows these rules:

1. **Filtering** - only active discounts with valid dates
2. **Priority** - variant-level discounts take precedence over product-level
3. **Priority field** - sorted by `priority` field (higher = more important)
4. **Discount types**:
   - `percent` - percentage discount (e.g., 20%)
   - `amount` - fixed amount discount (e.g., 5 EUR)

### Calculation formulas:

```typescript
// Percentage discount: 20% off
finalPrice = originalPrice * (1 - 20/100) = originalPrice * 0.8

// Fixed amount: 5 EUR off
finalPrice = max(0, originalPrice - 5)
```

### Example:

```typescript
Product: Hoodie
Original price: 50 EUR

Discounts available:
1. Product-level: 10% off (priority: 0)
2. Variant-level: 15% off (priority: 5)

Selected: Variant-level (higher priority + more specific)
Final price: 50 * (1 - 15/100) = 42.50 EUR
```

## Price Utilities

### `getActiveDiscount(discounts, variantId, productId)`

Finds the active discount with highest priority for a variant or product.

```typescript
const activeDiscount = getActiveDiscount(
  product.product_discounts,
  masterVariant.id,
  product.id
);
```

### `calculateFinalPrice(originalPrice, discount)`

Calculates final price with discount applied.

```typescript
const finalPrice = calculateFinalPrice(
  masterVariant.price,
  activeDiscount
);
```

## Integration Examples

### Catalog Page with Filtering

```typescript
import { useProducts } from 'entities/product';
import { useSearchParams } from '@tanstack/react-router';

function CatalogPage() {
  const [searchParams] = useSearchParams();

  const { data, isLoading, error } = useProducts({
    categoryId: searchParams.category,
    search: searchParams.q,
    page: Number(searchParams.page) || 1,
    sortBy: searchParams.sort || 'created_at',
    sortDir: searchParams.dir || 'desc',
  });

  if (error) return <ErrorMessage error={error} />;
  if (isLoading) return <CatalogSkeleton />;

  return (
    <div>
      <ProductGrid products={data.products} />
      <Pagination {...data.pagination} />
    </div>
  );
}
```

### Product Card Component

```typescript
import type { CatalogProduct } from 'entities/product';

interface ProductCardProps {
  product: CatalogProduct;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <div>
      <img src={product.primaryImageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <div>
        {product.hasDiscount && (
          <span className="line-through">
            {product.originalPrice} {product.currency}
          </span>
        )}
        <span className="font-bold">
          {product.finalPrice} {product.currency}
        </span>
      </div>
      {product.hasDiscount && (
        <Badge>
          {product.discountInfo?.discountType === 'percent'
            ? `-${product.discountInfo.discountValue}%`
            : `-${product.discountInfo?.discountValue} ${product.currency}`}
        </Badge>
      )}
    </div>
  );
}
```

## Testing

The implementation was tested with real database queries:

```typescript
✅ Full nested query structure works
✅ Total products: 90
✅ Has variants: true
✅ Has images: true
✅ Has discounts: true
✅ Category filtering works
```

## Performance Considerations

1. **Pagination** - limits data transferred (default 24 per page)
2. **Selective fields** - only necessary fields are fetched
3. **Index usage** - queries use `is_published` and `is_master` indexes
4. **Single query** - no N+1 problem with nested queries
5. **Client-side sorting** - for price-based sorts (unavoidable with nested data)

## Future Improvements

- [ ] Add product detail page API (`getProductBySlug`)
- [ ] Add UI components (`ProductCard`, `ProductPrice`)
- [ ] Add related products functionality
- [ ] Add product comparison
- [ ] Add wishlist integration
- [ ] Add reviews/ratings integration
