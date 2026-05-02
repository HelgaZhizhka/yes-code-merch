import { LayoutGrid, Grid3X3 } from 'lucide-react';

import { CATALOG_TEXT } from '@pages/catalog/lib';

import {
  useCatalogSearch,
  CATALOG_VIEWS,
  type CatalogView,
} from '@entities/product';

import { cn } from '@shared/lib/utils';

const VIEW_BUTTONS: Array<{
  value: CatalogView;
  Icon: typeof LayoutGrid;
  label: string;
}> = [
  {
    value: CATALOG_VIEWS.GRID_4,
    Icon: LayoutGrid,
    label: CATALOG_TEXT.view.grid4Label,
  },
  {
    value: CATALOG_VIEWS.GRID_3,
    Icon: Grid3X3,
    label: CATALOG_TEXT.view.grid3Label,
  },
];

export const GridViewToggle = (): React.JSX.Element => {
  const { searchParams, setView } = useCatalogSearch();
  const current = searchParams.view ?? CATALOG_VIEWS.GRID_4;

  return (
    <div
      role="group"
      aria-label={CATALOG_TEXT.view.groupLabel}
      className="flex items-center gap-0.5 rounded-sm bg-muted p-0.5"
    >
      {VIEW_BUTTONS.map(({ value, Icon, label }) => {
        const isActive = current === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setView(value)}
            aria-pressed={isActive}
            aria-label={label}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground transition-colors',
              'focus-visible:outline-2 focus-visible:outline-primary',
              isActive && 'bg-background text-foreground shadow-sm'
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </button>
        );
      })}
    </div>
  );
};
