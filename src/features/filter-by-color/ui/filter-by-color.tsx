import { Check } from 'lucide-react';
import { useMemo } from 'react';

import { CATALOG_TEXT, useCatalogSearch } from '@entities/catalog';

import { COLOR_HEX, isLightColor } from '@shared/lib/colors';
import { cn } from '@shared/lib/utils';

interface FilterByColorProps {
  available: string[];
}

export const FilterByColor = ({
  available,
}: FilterByColorProps): React.JSX.Element | null => {
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
            <label key={color} className="relative cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => toggleColor(color)}
                aria-label={CATALOG_TEXT.color.swatchAriaLabel(color)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  'relative flex h-[26px] w-[26px] shrink-0 rounded-full transition-transform',
                  'hover:scale-110',
                  'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-primary peer-focus-visible:outline-offset-2',
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
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};
