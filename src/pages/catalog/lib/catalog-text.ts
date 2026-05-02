export const CATALOG_TEXT = {
  filters: {
    title: 'Filters',
    reset: 'Reset all',
    apply: 'Apply price',
    activeRegionLabel: 'Active filters',
    removeFilter: (value: string) => `Remove filter: ${value}`,
  },
  categories: {
    title: 'Categories',
  },
  size: {
    title: 'Size',
    legend: 'Size',
    chipAriaLabel: (size: string) => `Size: ${size}`,
  },
  color: {
    title: 'Color',
    legend: 'Color',
    swatchAriaLabel: (color: string) => `Color: ${color}`,
  },
  price: {
    title: 'Price',
    minLabel: 'Min',
    maxLabel: 'Max',
    rangeAriaLabel: 'Price range',
  },
  header: {
    searchPlaceholder: 'Search the catalog...',
    sortDefault: 'Default',
    sortNewest: 'Newest first',
    sortPriceAsc: 'Price: low to high',
    sortPriceDesc: 'Price: high to low',
    sortNameAsc: 'Name: A → Z',
    countLabel: (count: number) =>
      count === 1 ? '1 product' : `${count} products`,
  },
  view: {
    groupLabel: 'Grid view',
    grid4Label: 'Grid: 4 per row',
    grid3Label: 'Grid: 3 per row',
  },
  empty: {
    title: 'No products found',
    description:
      'No products match your filters. Try changing them or clearing the search query.',
    cta: 'Reset all filters',
  },
} as const;
