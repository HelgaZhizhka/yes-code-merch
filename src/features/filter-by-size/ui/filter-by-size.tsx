import { useMemo } from 'react';

import { CATALOG_TEXT, useCatalogSearch } from '@entities/catalog';

import { cn } from '@shared/lib/utils';

interface FilterBySizeProps {
  available: string[];
}

export const FilterBySize = ({
  available,
}: FilterBySizeProps): React.JSX.Element | null => {
  const { searchParams, toggleSize } = useCatalogSearch();
  const selected = useMemo(
    () => new Set(searchParams.sizes ?? []),
    [searchParams.sizes]
  );

  if (available.length === 0) return null;

  return (
    <fieldset>
      <legend className="sr-only">{CATALOG_TEXT.size.legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {available.map((size) => {
          const isActive = selected.has(size);
          return (
            <button
              key={size}
              type="button"
              aria-pressed={isActive}
              aria-label={CATALOG_TEXT.size.chipAriaLabel(size)}
              onClick={() => toggleSize(size)}
              className={cn(
                'flex h-[34px] min-w-[38px] items-center justify-center rounded-sm border-[1.5px] px-2.5 text-xs font-medium transition-colors',
                'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
                isActive
                  ? 'border-primary bg-primary text-white font-bold'
                  : 'border-border bg-background text-foreground hover:border-primary hover:text-primary'
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
};
