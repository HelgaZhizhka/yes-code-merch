import { X } from 'lucide-react';

import { CATALOG_TEXT } from '@pages/catalog/lib';

import { useCatalogSearch } from '@entities/product';

type ActiveTag = {
  type: 'color' | 'size';
  value: string;
};

const buildTags = (
  colors: string[] | undefined,
  sizes: string[] | undefined
): ActiveTag[] => [
  ...(colors ?? []).map((value) => ({ type: 'color' as const, value })),
  ...(sizes ?? []).map((value) => ({ type: 'size' as const, value })),
];

export const CatalogActiveFilters = (): React.JSX.Element | null => {
  const { searchParams, removeFilter } = useCatalogSearch();
  const tags = buildTags(searchParams.colors, searchParams.sizes);

  if (tags.length === 0) return null;

  return (
    <div
      role="region"
      aria-label={CATALOG_TEXT.filters.activeRegionLabel}
      className="mb-3 flex flex-wrap gap-1.5"
    >
      {tags.map((tag) => (
        <button
          key={`${tag.type}:${tag.value}`}
          type="button"
          onClick={() => removeFilter(tag)}
          aria-label={CATALOG_TEXT.filters.removeFilter(tag.value)}
          className="flex h-6 items-center gap-1.5 rounded-full border border-primary-soft-border bg-primary-soft px-2 text-[11px] font-semibold text-primary transition-colors hover:bg-[#ffe6cc] focus-visible:outline-2 focus-visible:outline-primary"
        >
          <span>{tag.value}</span>
          <X className="h-2.5 w-2.5" aria-hidden />
        </button>
      ))}
    </div>
  );
};
