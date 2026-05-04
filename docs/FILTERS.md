# Product Filters

Context-aware filtering of the product catalog by **price**, **color**, and **size**.

## URL contract

| Param      | Type            | Example                    | Notes                                            |
| ---------- | --------------- | -------------------------- | ------------------------------------------------ |
| `colors`   | string[]        | `?colors=black&colors=red` | Multi-select; instant apply on click             |
| `sizes`    | string[]        | `?sizes=m&sizes=l`         | Visible only for categories with size attributes |
| `priceMin` | int (cents)     | `?priceMin=1000`           | Committed via Apply button                       |
| `priceMax` | int (cents)     | `?priceMax=5000`           | Committed via Apply button                       |
| `view`     | grid-4 / grid-3 | `?view=grid-3`             | Persists across category changes                 |

Filters are reset when the category changes (the `<Link>` in `CategoriesTree` navigates with `search: { view: prev.view }`).

## Architecture

- `products_search` view (PostgreSQL) exposes `colors text[]`, `sizes text[]`, `category_ids uuid[]`.
- RPC `get_catalog_filter_options(p_category_ids uuid[])` returns available colors/sizes/price-range/`hasSizeFilter` for the current category.
- React Query `productQueries` factory provides `catalog` (5 min stale) and `filterOptions` (1 hour stale).
- Router loader prefetches the categories tree; filter options are fetched in the page via `useFilterOptions`.

## Adding a new filter

1. Add the column to `products_search` (array aggregate from `product_variant_attributes`).
2. Add the field to `get_catalog_filter_options` return shape.
3. Extend `FilterOptions` interface and `getFilterOptions` mapper.
4. Extend `catalogSearchSchema` and `useCatalogSearch` setters.
5. Add a UI component in `pages/catalog/ui/catalog-<name>-filter/`.
6. Wire it into `<CatalogFilters>`.

## Out of scope (separate tasks)

- Search autosuggest dropdown.
- Stock toggle (data quality issue: most rows have `stock = 0`).
- Faceted counts.
- Brand filter.
- Mobile drawer pattern.
