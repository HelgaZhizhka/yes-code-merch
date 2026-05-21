import * as Slider from '@radix-ui/react-slider';
import { useEffect, useState } from 'react';

import { CATALOG_TEXT, useCatalogSearch } from '@entities/catalog';

import { cn } from '@shared/lib/utils';

interface FilterByPriceProps {
  bounds: { min: number; max: number };
}

const toEur = (cents: number): number => Math.round(cents / 100);
const toCents = (eur: number): number => Math.round(eur * 100);

export const FilterByPrice = ({
  bounds,
}: FilterByPriceProps): React.JSX.Element | null => {
  const { searchParams, setPriceRange } = useCatalogSearch();

  const initialMin = searchParams.priceMin ?? bounds.min;
  const initialMax = searchParams.priceMax ?? bounds.max;

  const [draft, setDraft] = useState<[number, number]>([
    toEur(initialMin),
    toEur(initialMax),
  ]);

  useEffect(() => {
    setDraft([
      toEur(searchParams.priceMin ?? bounds.min),
      toEur(searchParams.priceMax ?? bounds.max),
    ]);
  }, [searchParams.priceMin, searchParams.priceMax, bounds.min, bounds.max]);

  if (bounds.max <= bounds.min) return null;

  const minEur = toEur(bounds.min);
  const maxEur = toEur(bounds.max);

  const handleApply = (): void => {
    const [draftMin, draftMax] = draft;
    setPriceRange(toCents(draftMin), toCents(draftMax));
  };

  return (
    <div>
      <div className="mb-3 flex justify-between text-xs text-muted-foreground">
        <span>
          {CATALOG_TEXT.price.minLabel}{' '}
          <strong className="text-foreground">€{draft[0]}</strong>
        </span>
        <span>
          {CATALOG_TEXT.price.maxLabel}{' '}
          <strong className="text-foreground">€{draft[1]}</strong>
        </span>
      </div>
      <Slider.Root
        className="relative mx-1.5 flex h-1 touch-none items-center"
        min={minEur}
        max={maxEur}
        step={1}
        value={draft}
        onValueChange={([min, max]: number[]) => {
          if (min !== undefined && max !== undefined) {
            setDraft([min, max]);
          }
        }}
        minStepsBetweenThumbs={1}
      >
        <Slider.Track className="relative h-1 grow rounded-sm bg-border">
          <Slider.Range className="absolute h-full rounded-sm bg-primary" />
        </Slider.Track>
        <Slider.Thumb
          aria-label={CATALOG_TEXT.price.minLabel}
          className={cn(
            'block h-3.5 w-3.5 rounded-full border-2 border-primary bg-background shadow-sm',
            'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2'
          )}
        />
        <Slider.Thumb
          aria-label={CATALOG_TEXT.price.maxLabel}
          className={cn(
            'block h-3.5 w-3.5 rounded-full border-2 border-primary bg-background shadow-sm',
            'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2'
          )}
        />
      </Slider.Root>
      <div className="mt-3.5 flex gap-2">
        <input
          type="number"
          min={minEur}
          max={draft[1]}
          value={draft[0]}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (!Number.isNaN(next)) {
              setDraft([Math.min(next, draft[1]), draft[1]]);
            }
          }}
          aria-label={CATALOG_TEXT.price.minLabel}
          className="h-8 w-full rounded-sm border-[1.5px] border-border bg-background px-2 text-sm focus-visible:border-primary focus-visible:outline-none"
        />
        <input
          type="number"
          min={draft[0]}
          max={maxEur}
          value={draft[1]}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (!Number.isNaN(next)) {
              setDraft([draft[0], Math.max(next, draft[0])]);
            }
          }}
          aria-label={CATALOG_TEXT.price.maxLabel}
          className="h-8 w-full rounded-sm border-[1.5px] border-border bg-background px-2 text-sm focus-visible:border-primary focus-visible:outline-none"
        />
      </div>
      <button
        type="button"
        onClick={handleApply}
        className="mt-4 h-10 w-full rounded-sm bg-primary text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
      >
        {CATALOG_TEXT.filters.apply}
      </button>
    </div>
  );
};
