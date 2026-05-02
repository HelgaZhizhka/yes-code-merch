import { Check } from 'lucide-react';
import { useMemo } from 'react';

import { CATALOG_TEXT, COLOR_HEX, isLightColor } from '@pages/catalog/lib';

import { useCatalogSearch } from '@entities/product';

import { cn } from '@shared/lib/utils';

interface CatalogColorFilterProps {
  available: string[];
}

export const CatalogColorFilter = ({
  available,
}: CatalogColorFilterProps): React.JSX.Element | null => {
  const { searchParams, toggleColor } = useCatalogSearch();
  const selected = useMemo(
    () => new Set(searchParams.colors ?? []),
    [searchParams.colors]
  );

  if (available.length === 0) return null;

  return (
    <fieldset>
      <legend className="sr-only">{CATALOG_TEXT.color.legend}</legend>
      <div className="flex flex-wrap gap-2">
        {available.map((color) => {
          const isActive = selected.has(color);
          const hex = COLOR_HEX[color] ?? '#cccccc';
          const light = isLightColor(color);
          return (
            <button
              key={color}
              type="button"
              role="checkbox"
              aria-checked={isActive}
              aria-label={CATALOG_TEXT.color.swatchAriaLabel(color)}
              onClick={() => toggleColor(color)}
              className={cn(
                'relative h-[26px] w-[26px] shrink-0 rounded-full transition-transform',
                'hover:scale-110',
                'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
                light && 'border border-[#ddd]',
                isActive &&
                  'after:absolute after:-inset-[3px] after:rounded-full after:border-2 after:border-primary',
                isActive && light && 'after:border-muted-foreground'
              )}
              style={{ backgroundColor: hex }}
            >
              {isActive && (
                <Check
                  className={cn(
                    'absolute inset-0 m-auto h-2.5 w-2.5',
                    light ? 'text-foreground' : 'text-white'
                  )}
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
};
